/* global console, process */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  collectGeneratedIconEntries,
  collectIconSvgEntries,
  diffIconSync,
  iconManifestFileName,
} from './icon-sync.mjs';
import { validateSvgContent } from './validate-icons.mjs';

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

const [svgEntries, generatedEntries, indexSource, manifestSource] = await Promise.all([
  collectIconSvgEntries(svgRoot),
  collectGeneratedIconEntries(generatedRoot),
  readFileOrNull(indexPath),
  readFileOrNull(manifestPath),
]);
const validationErrors = svgEntries.flatMap((entry) =>
  validateSvgContent(entry.filePath, entry.source, packageRoot),
);

const syncErrors = diffIconSync({ svgEntries, generatedEntries, indexSource, manifestSource });
const errors = [...validationErrors, ...syncErrors];

if (errors.length > 0) {
  console.error('Icon check failed:');
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Icon SVG validation and generated output sync passed (${svgEntries.length} file${
      svgEntries.length === 1 ? '' : 's'
    }).`,
  );
}
