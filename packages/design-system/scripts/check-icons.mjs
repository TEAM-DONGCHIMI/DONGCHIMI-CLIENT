/* global console, process */

import path from 'node:path';
import { validateIconSvgs } from './validate-icons.mjs';

const packageRoot = process.cwd();
const svgRoot = path.join(packageRoot, 'src', 'icons', 'svg');
const { svgFiles, validationErrors } = await validateIconSvgs({ packageRoot, svgRoot });

if (validationErrors.length > 0) {
  console.error('Icon SVG validation failed:');
  console.error(validationErrors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Icon SVG validation passed (${svgFiles.length} file${svgFiles.length === 1 ? '' : 's'}).`,
  );
}
