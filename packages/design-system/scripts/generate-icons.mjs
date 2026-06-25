/* global console, process */

import { spawn } from 'node:child_process';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { validateIconSvgs } from './validate-icons.mjs';

const packageRoot = process.cwd();
const iconsRoot = path.join(packageRoot, 'src', 'icons');
const svgRoot = path.join(iconsRoot, 'svg');
const generatedRoot = path.join(iconsRoot, 'generated');
const indexPath = path.join(iconsRoot, 'index.ts');

const toComponentName = (svgFile) => {
  return path
    .basename(svgFile, '.svg')
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
};

const cleanGeneratedFiles = async () => {
  await mkdir(generatedRoot, { recursive: true });

  const entries = await readdir(generatedRoot, { withFileTypes: true });
  await Promise.all(
    entries
      .filter(
        (entry) => entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')),
      )
      .map((entry) => rm(path.join(generatedRoot, entry.name))),
  );
};

const runSvgr = () => {
  const svgrCliPath = path.join(packageRoot, 'node_modules', '@svgr', 'cli', 'bin', 'svgr');
  const args = [
    svgrCliPath,
    '--typescript',
    '--icon',
    '--memo',
    '--ref',
    '--no-index',
    '--out-dir',
    path.relative(packageRoot, generatedRoot),
    path.relative(packageRoot, svgRoot),
  ];

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

      reject(new Error(`SVGR exited with code ${code}`));
    });
  });
};

const runPrettier = () => {
  const args = [
    path.join(packageRoot, '..', '..', 'node_modules', 'prettier', 'bin', 'prettier.cjs'),
    '--write',
    path.relative(packageRoot, generatedRoot),
    path.relative(packageRoot, indexPath),
  ];

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

      reject(new Error(`Prettier exited with code ${code}`));
    });
  });
};

const normalizeGeneratedIconImports = async () => {
  const entries = await readdir(generatedRoot, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
      .map(async (entry) => {
        const filePath = path.join(generatedRoot, entry.name);
        const source = await readFile(filePath, 'utf8');
        const normalizedSource = source
          .replace('import * as React from "react";\n', '')
          .replace(
            'import type { SVGProps } from "react";\nimport { Ref, forwardRef, memo } from "react";',
            "import { forwardRef, memo, type Ref, type SVGProps } from 'react';",
          )
          // Normalize hardcoded black fill/stroke to currentColor so consumers
          // can control icon color via CSS (e.g. color: token.blue).
          // Targets only solid-black values that SVGO produces (#000, #000000)
          // and the raw keyword (black) in case SVGO is skipped.
          .replace(/(fill|stroke)="(?:#000(?:000)?|black)"/g, '$1="currentColor"');

        await writeFile(filePath, normalizedSource, 'utf8');
      }),
  );
};

const writeIconIndex = async (svgFiles) => {
  const exports = svgFiles.map((svgFile) => {
    const componentName = toComponentName(svgFile);
    return `export { default as ${componentName} } from './generated/${componentName}';`;
  });
  const header = [
    '// This barrel file is auto-generated. Do not edit it manually.',
    '// Run `pnpm icons:generate` to rebuild icon exports.',
  ].join('\n');

  const source =
    exports.length > 0 ? `${header}\n${exports.join('\n')}\n` : `${header}\nexport {};\n`;

  await writeFile(indexPath, source, 'utf8');
};

const { svgFiles, validationErrors } = await validateIconSvgs({ packageRoot, svgRoot });

if (validationErrors.length > 0) {
  console.error('Icon SVG validation failed:');
  console.error(validationErrors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

await cleanGeneratedFiles();

if (svgFiles.length > 0) {
  await runSvgr();
  await normalizeGeneratedIconImports();
}

await writeIconIndex(svgFiles);
await runPrettier();

console.log(`Generated ${svgFiles.length} icon${svgFiles.length === 1 ? '' : 's'}.`);
