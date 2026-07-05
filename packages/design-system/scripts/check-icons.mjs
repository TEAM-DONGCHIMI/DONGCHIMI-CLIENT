/* global console, process */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createSvgFingerprint } from './icon-utils.mjs';
import { diffIconSync, iconManifestFileName } from './icon-sync.mjs';
import { collectSvgFiles, validateIconSvgs } from './validate-icons.mjs';

const packageRoot = process.cwd();
const iconsRoot = path.join(packageRoot, 'src', 'icons');
const svgRoot = path.join(iconsRoot, 'svg');
const generatedRoot = path.join(iconsRoot, 'generated');
const indexPath = path.join(iconsRoot, 'index.ts');
const manifestPath = path.join(generatedRoot, iconManifestFileName);

const readFileOrNull = async (filePath) => {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

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
    .map((entry) => entry.name);
};

const collectSvgEntries = async () => {
  const svgFiles = await collectSvgFiles(svgRoot);

  return Promise.all(
    svgFiles.map(async (svgFile) => ({
      fileName: path.basename(svgFile),
      fingerprint: createSvgFingerprint(await readFile(svgFile, 'utf8')),
    })),
  );
};

const { svgFiles, validationErrors } = await validateIconSvgs({ packageRoot, svgRoot });
const [svgEntries, generatedFiles, indexSource, manifestSource] = await Promise.all([
  collectSvgEntries(),
  collectGeneratedIconFiles(),
  readFileOrNull(indexPath),
  readFileOrNull(manifestPath),
]);

const syncErrors = diffIconSync({ svgEntries, generatedFiles, indexSource, manifestSource });
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
