/* global console, process */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createIconIndexSource, toIconComponentName } from './icon-utils.mjs';
import { validateIconSvgs } from './validate-icons.mjs';

const packageRoot = process.cwd();
const iconsRoot = path.join(packageRoot, 'src', 'icons');
const svgRoot = path.join(iconsRoot, 'svg');
const generatedRoot = path.join(iconsRoot, 'generated');
const indexPath = path.join(iconsRoot, 'index.ts');

const collectGeneratedIconFiles = async () => {
  let entries = [];

  try {
    entries = await readdir(generatedRoot, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name)
    .sort();
};

const checkGeneratedIconSync = async (svgFiles) => {
  const errors = [];
  const expectedGeneratedFiles = svgFiles
    .map((svgFile) => `${toIconComponentName(svgFile)}.tsx`)
    .sort();
  const actualGeneratedFiles = await collectGeneratedIconFiles();
  const expectedGeneratedFileSet = new Set(expectedGeneratedFiles);
  const actualGeneratedFileSet = new Set(actualGeneratedFiles);

  for (const expectedFile of expectedGeneratedFiles) {
    if (!actualGeneratedFileSet.has(expectedFile)) {
      errors.push(
        `missing generated icon component: ${path.join('src/icons/generated', expectedFile)}`,
      );
    }
  }

  for (const actualFile of actualGeneratedFiles) {
    if (!expectedGeneratedFileSet.has(actualFile)) {
      errors.push(
        `stale generated icon component: ${path.join('src/icons/generated', actualFile)}`,
      );
    }
  }

  let actualIndexSource = null;
  try {
    actualIndexSource = await readFile(indexPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    errors.push('missing icon index: src/icons/index.ts');
  }

  if (actualIndexSource != null && actualIndexSource !== createIconIndexSource(svgFiles)) {
    errors.push('stale icon index: run `pnpm --filter @dongchimi/design-system icons:generate`');
  }

  return errors;
};

const { svgFiles, validationErrors } = await validateIconSvgs({ packageRoot, svgRoot });
const syncErrors = await checkGeneratedIconSync(svgFiles);
const errors = [...validationErrors, ...syncErrors];

if (errors.length > 0) {
  console.error('Icon check failed:');
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Icon SVG validation and generated output sync passed (${svgFiles.length} file${
      svgFiles.length === 1 ? '' : 's'
    }).`,
  );
}
