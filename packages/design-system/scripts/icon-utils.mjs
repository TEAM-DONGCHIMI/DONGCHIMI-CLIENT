import { createHash } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { optimize } from 'svgo';

export const iconFileNamePattern = /^ic-[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

export const toPosixPath = (filePath) => filePath.split(path.sep).join('/');

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

      return entry.isFile() && entry.name.toLowerCase().endsWith('.svg') ? [entryPath] : [];
    }),
  );

  return files.flat().sort();
};

export const toIconComponentName = (svgFileOrName) => {
  return path
    .basename(svgFileOrName, path.extname(svgFileOrName))
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
};

const normalizeBlackColorAttributes = (source) => {
  return source
    .replace(/\b(fill|stroke)\s*=\s*(["'])(?:#000(?:000)?|black)\2/gi, '$1=$2currentColor$2')
    .replace(/\b(fill|stroke):\s*(?:#000(?:000)?|black)\b/gi, '$1:currentColor');
};

export const optimizeSvgSource = (source) => {
  const colorNormalizedSource = normalizeBlackColorAttributes(source);

  try {
    const result = optimize(colorNormalizedSource, {
      js2svg: {
        pretty: false,
      },
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertShapeToPath: false,
              removeViewBox: false,
            },
          },
        },
        'sortAttrs',
      ],
    });

    return 'data' in result ? result.data : colorNormalizedSource;
  } catch {
    return colorNormalizedSource;
  }
};

export const normalizeSvgSource = (source) => {
  return normalizeBlackColorAttributes(optimizeSvgSource(source))
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/'/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
};

export const createSvgFingerprint = (source) => {
  return createHash('sha256').update(normalizeSvgSource(source)).digest('hex');
};

const attributePattern = (name) => new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'gi');

const collectAttributeValues = (source, name) => {
  return [...source.matchAll(attributePattern(name))].map((match) =>
    match[1].replace(/\s+/g, ' ').trim(),
  );
};

export const createSvgShapeSignature = (source) => {
  const normalizedSource = normalizeSvgSource(source);
  const paths = collectAttributeValues(normalizedSource, 'd');

  if (paths.length === 0) {
    return null;
  }

  const viewBox = collectAttributeValues(normalizedSource, 'viewBox')[0] ?? null;

  return createHash('sha256').update(JSON.stringify({ paths, viewBox })).digest('hex');
};

export const createIconIndexSource = (svgFiles) => {
  const exports = svgFiles.map((svgFile) => {
    const componentName = toIconComponentName(svgFile);
    return `export { default as ${componentName} } from './generated/${componentName}';`;
  });
  const header = [
    '// This barrel file is auto-generated. Do not edit it manually.',
    '// Run `pnpm --filter @dongchimi/design-system icons:generate` to rebuild icon exports.',
  ].join('\n');

  return exports.length > 0 ? `${header}\n${exports.join('\n')}\n` : `${header}\nexport {};\n`;
};
