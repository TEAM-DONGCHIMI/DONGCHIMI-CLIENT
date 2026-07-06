import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { collectSvgFiles, iconFileNamePattern } from './icon-utils.mjs';

const blockedTagPattern = /<\s*(script|foreignObject|iframe|object|embed)\b/i;
const eventAttributePattern = /\s(on[a-z][\w:-]*)\s*=/i;
const javascriptUrlPattern = /(?:href|xlink:href)\s*=\s*["']\s*javascript:/i;
const hrefAttributePattern = /\s(?:href|xlink:href)\s*=\s*["']([^"']*)["']/gi;

export { collectSvgFiles };

export const validateSvgContent = (filePath, source, packageRoot, options = {}) => {
  const errors = [];
  const fileName = options.fileName ?? path.basename(filePath);

  if (!iconFileNamePattern.test(fileName)) {
    errors.push('file name must match ic-name.svg');
  }

  if (blockedTagPattern.test(source)) {
    errors.push('blocked element: script, foreignObject, iframe, object, or embed');
  }

  if (eventAttributePattern.test(source)) {
    errors.push('blocked event attribute: on*');
  }

  if (javascriptUrlPattern.test(source)) {
    errors.push('blocked javascript: URL');
  }

  for (const match of source.matchAll(hrefAttributePattern)) {
    const hrefValue = match[1].trim();

    if (hrefValue !== '' && !hrefValue.startsWith('#')) {
      errors.push(`blocked external href: ${hrefValue}`);
    }
  }

  return errors.map((message) => `${path.relative(packageRoot, filePath)} - ${message}`);
};

export const validateIconSvgs = async ({ packageRoot, svgRoot }) => {
  const svgFiles = await collectSvgFiles(svgRoot);
  const validationErrors = [];

  for (const svgFile of svgFiles) {
    const source = await readFile(svgFile, 'utf8');
    validationErrors.push(...validateSvgContent(svgFile, source, packageRoot));
  }

  return {
    svgFiles,
    validationErrors,
  };
};
