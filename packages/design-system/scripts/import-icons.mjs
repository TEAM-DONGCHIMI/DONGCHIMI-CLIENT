/* global console, process */

import { spawn } from 'node:child_process';
import { constants as fsConstants } from 'node:fs';
import { copyFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageRoot, prepareIconImport, svgRoot } from './icon-import-core.mjs';
import { printNextActions, printResult, writeReport } from './icon-import-report.mjs';

const usage = [
  'Usage: pnpm --filter @dongchimi/design-system icons:import <staging-dir> [options]',
  '',
  'Options:',
  '  --dry-run             Print the import result without copying files.',
  '  --generate            Run icons:generate after copying imported SVG files.',
  '  --report <path>       Write the import result as JSON.',
  '  --name-map <path>     Map exported file names to ic-name.svg file names.',
  '  --help                Show this help message.',
].join('\n');

const parseArgs = (args) => {
  const options = {
    dryRun: false,
    generate: false,
    nameMapPath: null,
    reportPath: null,
    showHelp: false,
    stagingDir: null,
  };
  const positionalArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--generate') {
      options.generate = true;
      continue;
    }

    if (arg === '--help') {
      options.showHelp = true;
      continue;
    }

    if (arg === '--name-map' || arg === '--report') {
      const value = args[index + 1];

      if (value == null || value.startsWith('--')) {
        throw new Error(`${arg} requires a path.`);
      }

      if (arg === '--name-map') {
        options.nameMapPath = value;
      } else {
        options.reportPath = value;
      }

      index += 1;
      continue;
    }

    if (arg.startsWith('--name-map=')) {
      options.nameMapPath = arg.slice('--name-map='.length);
      continue;
    }

    if (arg.startsWith('--report=')) {
      options.reportPath = arg.slice('--report='.length);
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positionalArgs.push(arg);
  }

  if (options.showHelp) {
    return options;
  }

  if (positionalArgs.length !== 1) {
    throw new Error('Exactly one staging directory is required.');
  }

  options.stagingDir = positionalArgs[0];
  return options;
};

const copyImportedIcons = async (imported) => {
  await mkdir(svgRoot, { recursive: true });
  const copiedPaths = [];

  try {
    for (const record of imported) {
      const targetPath = path.join(svgRoot, record.targetFileName);
      await copyFile(record.filePath, targetPath, fsConstants.COPYFILE_EXCL);
      copiedPaths.push(targetPath);
    }
  } catch (error) {
    await Promise.all(
      copiedPaths.map(async (copiedPath) => {
        try {
          await unlink(copiedPath);
        } catch {
          // Keep the original copy failure as the actionable error.
        }
      }),
    );

    throw new Error(
      `Icon import failed while copying files. Rolled back ${copiedPaths.length} copied file${
        copiedPaths.length === 1 ? '' : 's'
      }. ${error.message}`,
    );
  }
};

const runIconGenerator = () => {
  const args = [path.join(packageRoot, 'scripts', 'generate-icons.mjs')];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: packageRoot,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`icons:generate exited with code ${code}`));
    });
  });
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (options.showHelp) {
    console.log(usage);
    return;
  }

  const { result, stagingRoot } = await prepareIconImport({
    nameMapPath: options.nameMapPath,
    stagingDir: options.stagingDir,
  });

  printResult({ dryRun: options.dryRun, result });
  await writeReport({
    dryRun: options.dryRun,
    reportPath: options.reportPath,
    result,
    stagingRoot,
  });

  if (result.invalid.length > 0) {
    printNextActions({
      dryRun: options.dryRun,
      generate: options.generate,
      result,
    });
    console.error('Icon import failed. No files were copied because invalid SVG input exists.');
    process.exitCode = 1;
    return;
  }

  if (!options.dryRun) {
    await copyImportedIcons(result.imported);

    if (options.generate && result.imported.length > 0) {
      await runIconGenerator();
    }
  }

  printNextActions({
    dryRun: options.dryRun,
    generate: options.generate,
    result,
  });
};

const isCliExecution = () => {
  return (
    process.argv[1] != null && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  );
};

if (isCliExecution()) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    console.error('');
    console.error(usage);
    process.exitCode = 1;
  }
}
