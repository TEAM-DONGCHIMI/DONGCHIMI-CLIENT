import { createIconIndexSource, toIconComponentName } from './icon-utils.mjs';

export const iconManifestFileName = 'icons.manifest.json';

const generateHint = 'run `pnpm --filter @dongchimi/design-system icons:generate`';

// Build the source-fingerprint manifest that `icons:generate` records alongside
// the generated components. Keys are source SVG file names, values are the
// SVGO-normalized fingerprint of that SVG at generation time.
export const buildIconManifest = (svgEntries) => {
  const manifest = {};

  for (const { fileName, fingerprint } of [...svgEntries].sort((a, b) =>
    a.fileName.localeCompare(b.fileName),
  )) {
    manifest[fileName] = fingerprint;
  }

  return manifest;
};

export const serializeIconManifest = (manifest) => {
  return `${JSON.stringify(manifest, null, 2)}\n`;
};

const parseManifestSource = (manifestSource) => {
  if (manifestSource == null) {
    return null;
  }

  try {
    const parsed = JSON.parse(manifestSource);
    return parsed != null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

// Pure sync check shared by `check:icons`. Everything it needs is injected so it
// can be unit tested without touching the filesystem.
//
// - svgEntries:      current source SVGs as [{ fileName, fingerprint }]
// - generatedFiles:  actual generated component file names (e.g. ['IcHome.tsx'])
// - indexSource:     current src/icons/index.ts content (null when missing)
// - manifestSource:  current manifest JSON content (null when missing)
export const diffIconSync = ({ svgEntries, generatedFiles, indexSource, manifestSource }) => {
  const errors = [];
  const svgFiles = svgEntries.map((entry) => entry.fileName);

  // 1. Generated component presence: every source SVG maps to exactly one Ic*.tsx.
  const expectedGeneratedFiles = svgFiles.map((svgFile) => `${toIconComponentName(svgFile)}.tsx`);
  const expectedGeneratedFileSet = new Set(expectedGeneratedFiles);
  const actualGeneratedFileSet = new Set(generatedFiles);

  for (const expectedFile of [...expectedGeneratedFiles].sort()) {
    if (!actualGeneratedFileSet.has(expectedFile)) {
      errors.push(`missing generated icon component: src/icons/generated/${expectedFile}`);
    }
  }

  for (const actualFile of [...generatedFiles].sort()) {
    if (!expectedGeneratedFileSet.has(actualFile)) {
      errors.push(`stale generated icon component: src/icons/generated/${actualFile}`);
    }
  }

  // 2. Barrel export sync.
  if (indexSource == null) {
    errors.push('missing icon index: src/icons/index.ts');
  } else if (indexSource !== createIconIndexSource(svgFiles)) {
    errors.push(`stale icon index: ${generateHint}`);
  }

  // 3. Content sync via source-fingerprint manifest. Comparing the current SVG
  //    fingerprint against the fingerprint recorded at generation time catches
  //    "SVG edited but not regenerated", which the file-name check cannot see.
  const manifest = parseManifestSource(manifestSource);

  if (manifest == null) {
    errors.push(`missing icon manifest: src/icons/generated/${iconManifestFileName}`);
  } else {
    const manifestFileSet = new Set(Object.keys(manifest));

    for (const { fileName, fingerprint } of svgEntries) {
      if (!manifestFileSet.has(fileName)) {
        errors.push(`missing manifest entry: ${fileName} (${generateHint})`);
      } else if (manifest[fileName] !== fingerprint) {
        errors.push(
          `outdated generated icon: ${fileName} changed since last generate (${generateHint})`,
        );
      }
    }

    const svgFileSet = new Set(svgFiles);
    for (const manifestFile of Object.keys(manifest)) {
      if (!svgFileSet.has(manifestFile)) {
        errors.push(`stale manifest entry: ${manifestFile} (${generateHint})`);
      }
    }
  }

  return errors;
};
