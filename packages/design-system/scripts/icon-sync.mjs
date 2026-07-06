import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  collectSvgFiles,
  createIconIndexSource,
  createSvgFingerprint,
  toIconComponentName,
} from './icon-utils.mjs';

export const iconManifestFileName = 'icons.manifest.json';

const generateHint = 'run `pnpm --filter @dongchimi/design-system icons:generate`';

export const createContentFingerprint = (source) => {
  return createHash('sha256').update(source).digest('hex');
};

export const collectIconSvgEntries = async (svgRoot) => {
  const svgFiles = await collectSvgFiles(svgRoot);

  return Promise.all(
    svgFiles.map(async (filePath) => {
      const source = await readFile(filePath, 'utf8');

      return {
        fileName: path.basename(filePath),
        filePath,
        source,
        sourceFingerprint: createSvgFingerprint(source),
      };
    }),
  );
};

export const collectGeneratedIconEntries = async (generatedRoot) => {
  let entries = [];

  try {
    entries = await readdir(generatedRoot, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
      .map(async (entry) => {
        const filePath = path.join(generatedRoot, entry.name);
        const source = await readFile(filePath, 'utf8');

        return {
          fileName: entry.name,
          filePath,
          source,
          fingerprint: createContentFingerprint(source),
        };
      }),
  );
};

// Build the manifest that `icons:generate` records alongside generated
// components. Each source SVG stores both the source fingerprint and the exact
// generated component fingerprint, so check:icons can detect stale generated
// content as well as edited SVG sources.
export const buildIconManifest = ({ generatedEntries, svgEntries }) => {
  const manifest = {};
  const generatedEntryByFileName = new Map(
    generatedEntries.map((entry) => [entry.fileName, entry]),
  );

  for (const { fileName, sourceFingerprint } of [...svgEntries].sort((a, b) =>
    a.fileName.localeCompare(b.fileName),
  )) {
    const generatedFile = `${toIconComponentName(fileName)}.tsx`;
    const generatedEntry = generatedEntryByFileName.get(generatedFile);

    manifest[fileName] = {
      generatedFile,
      generatedFingerprint: generatedEntry?.fingerprint ?? null,
      sourceFingerprint,
    };
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
// - svgEntries:       current source SVGs as [{ fileName, sourceFingerprint }]
// - generatedEntries: current generated components as [{ fileName, fingerprint }]
// - indexSource:     current src/icons/index.ts content (null when missing)
// - manifestSource:  current manifest JSON content (null when missing)
export const diffIconSync = ({ svgEntries, generatedEntries, indexSource, manifestSource }) => {
  const errors = [];
  const svgFiles = svgEntries.map((entry) => entry.fileName);

  // 1. Generated component presence: every source SVG maps to exactly one Ic*.tsx.
  const expectedGeneratedFiles = svgFiles.map((svgFile) => `${toIconComponentName(svgFile)}.tsx`);
  const expectedGeneratedFileSet = new Set(expectedGeneratedFiles);
  const actualGeneratedFileSet = new Set(generatedEntries.map((entry) => entry.fileName));

  for (const expectedFile of [...expectedGeneratedFiles].sort()) {
    if (!actualGeneratedFileSet.has(expectedFile)) {
      errors.push(`missing generated icon component: src/icons/generated/${expectedFile}`);
    }
  }

  for (const actualFile of [...actualGeneratedFileSet].sort()) {
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

    const generatedEntryByFileName = new Map(
      generatedEntries.map((entry) => [entry.fileName, entry]),
    );

    for (const { fileName, sourceFingerprint } of svgEntries) {
      const manifestEntry = manifest[fileName];

      if (!manifestFileSet.has(fileName)) {
        errors.push(`missing manifest entry: ${fileName} (${generateHint})`);
        continue;
      }

      if (manifestEntry.sourceFingerprint !== sourceFingerprint) {
        errors.push(
          `outdated generated icon: ${fileName} changed since last generate (${generateHint})`,
        );
        continue;
      }

      const generatedFile = `${toIconComponentName(fileName)}.tsx`;
      const generatedEntry = generatedEntryByFileName.get(generatedFile);

      if (manifestEntry.generatedFile !== generatedFile) {
        errors.push(`outdated manifest generated file: ${fileName} (${generateHint})`);
      }

      if (
        generatedEntry != null &&
        manifestEntry.generatedFingerprint !== generatedEntry.fingerprint
      ) {
        errors.push(
          `outdated generated icon: src/icons/generated/${generatedFile} changed since last generate (${generateHint})`,
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
