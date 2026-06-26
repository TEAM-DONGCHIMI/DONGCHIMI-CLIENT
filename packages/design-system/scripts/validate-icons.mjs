import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const blockedTagPattern = /<\s*(script|foreignObject|iframe|object|embed)\b/i;
const eventAttributePattern = /\s(on[a-z][\w:-]*)\s*=/i;
const javascriptUrlPattern = /(?:href|xlink:href)\s*=\s*["']\s*javascript:/i;
const hrefAttributePattern = /\s(?:href|xlink:href)\s*=\s*["']([^"']*)["']/gi;
const iconFileNamePattern = /^ic-[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

export const collectSvgFiles = async (directory) => {
  let entries = [];

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSvgFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.svg') ? [entryPath] : [];
    }),
  );

  return files.flat().sort();
};

const validateSvgContent = (filePath, source, packageRoot) => {
  const errors = [];

  if (!iconFileNamePattern.test(path.basename(filePath))) {
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
