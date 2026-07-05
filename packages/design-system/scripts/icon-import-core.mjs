/* global process */

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  collectSvgFiles,
  createSvgFingerprint,
  createSvgShapeSignature,
  toIconComponentName,
  toPosixPath,
} from './icon-utils.mjs';
import { validateSvgContent } from './validate-icons.mjs';

export const packageRoot = process.cwd();
const workspaceRoot = path.resolve(packageRoot, '..', '..');
const iconsRoot = path.join(packageRoot, 'src', 'icons');
export const svgRoot = path.join(iconsRoot, 'svg');
const generatedRoot = path.join(iconsRoot, 'generated');

const pathExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resolveReadablePath = async (inputPath) => {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }

  const packageRelativePath = path.resolve(packageRoot, inputPath);
  if (await pathExists(packageRelativePath)) {
    return packageRelativePath;
  }

  const workspaceRelativePath = path.resolve(workspaceRoot, inputPath);
  if (await pathExists(workspaceRelativePath)) {
    return workspaceRelativePath;
  }

  return packageRelativePath;
};

export const resolveReportPath = (inputPath) => {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(workspaceRoot, inputPath);
};

export const toReportPath = (filePath) => {
  const relativePath = path.relative(workspaceRoot, filePath);

  if (relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))) {
    return toPosixPath(relativePath);
  }

  return toPosixPath(filePath);
};

const appendToMap = (map, key, value) => {
  if (key == null) {
    return;
  }

  const values = map.get(key) ?? [];
  values.push(value);
  map.set(key, values);
};

const firstMapValue = (map, key) => {
  return map.get(key)?.[0] ?? null;
};

const collectGeneratedComponentNames = async () => {
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
    .map((entry) => ({
      componentName: path.basename(entry.name, '.tsx'),
      path: path.join(generatedRoot, entry.name),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
};

const buildSourceIndex = async () => {
  const svgFiles = await collectSvgFiles(svgRoot);
  const records = await Promise.all(
    svgFiles.map(async (filePath) => {
      const source = await readFile(filePath, 'utf8');
      const fileName = path.basename(filePath);

      return {
        componentName: toIconComponentName(fileName),
        fileName,
        fingerprint: createSvgFingerprint(source),
        path: filePath,
        shapeSignature: createSvgShapeSignature(source),
      };
    }),
  );

  const fileNames = new Map();
  const componentNames = new Map();
  const fingerprints = new Map();
  const shapeSignatures = new Map();

  for (const record of records) {
    appendToMap(fileNames, record.fileName, record);
    appendToMap(componentNames, record.componentName, record);
    appendToMap(fingerprints, record.fingerprint, record);
    appendToMap(shapeSignatures, record.shapeSignature, record);
  }

  for (const record of await collectGeneratedComponentNames()) {
    appendToMap(componentNames, record.componentName, record);
  }

  return {
    componentNames,
    fileNames,
    fingerprints,
    shapeSignatures,
  };
};

const readNameMap = async (nameMapPath) => {
  if (nameMapPath == null) {
    return {};
  }

  const resolvedPath = await resolveReadablePath(nameMapPath);
  const source = await readFile(resolvedPath, 'utf8');
  const parsed = JSON.parse(source);

  if (parsed == null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('Name map must be a JSON object.');
  }

  for (const [from, to] of Object.entries(parsed)) {
    if (typeof from !== 'string' || typeof to !== 'string') {
      throw new Error('Name map keys and values must be strings.');
    }
  }

  return parsed;
};

const resolveTargetFileName = ({ filePath, nameMap, stagingRoot }) => {
  const relativePath = toPosixPath(path.relative(stagingRoot, filePath));
  const originalFileName = path.basename(filePath);

  return nameMap[relativePath] ?? nameMap[originalFileName] ?? originalFileName;
};

// Report the source as a staging-relative path so shared reports never leak the
// user's absolute filesystem paths (e.g. home directory) when the staging
// directory lives outside the workspace.
const createRecordBase = ({ componentName, filePath, stagingRoot, targetFileName }) => ({
  componentName,
  source: toPosixPath(path.relative(stagingRoot, filePath)),
  target: toPosixPath(path.join('packages/design-system/src/icons/svg', targetFileName)),
  targetFileName,
});

export const createCandidates = async ({ nameMap, stagingRoot }) => {
  const svgFiles = await collectSvgFiles(stagingRoot);

  if (svgFiles.length === 0) {
    throw new Error(`No SVG files found in ${stagingRoot}.`);
  }

  const candidates = [];

  for (const filePath of svgFiles) {
    const source = await readFile(filePath, 'utf8');
    const targetFileName = resolveTargetFileName({ filePath, nameMap, stagingRoot });
    const errors = [];

    if (path.basename(targetFileName) !== targetFileName) {
      errors.push('mapped file name must not include directories');
    }

    const validationErrors = validateSvgContent(filePath, source, workspaceRoot, {
      fileName: targetFileName,
    });
    errors.push(...validationErrors);

    candidates.push({
      ...createRecordBase({
        componentName: toIconComponentName(targetFileName),
        filePath,
        stagingRoot,
        targetFileName,
      }),
      errors,
      filePath,
      fingerprint: createSvgFingerprint(source),
      shapeSignature: createSvgShapeSignature(source),
    });
  }

  return candidates;
};

const addInputDuplicateErrors = (candidates) => {
  const targetFileNames = new Map();
  const componentNames = new Map();

  for (const candidate of candidates) {
    if (candidate.errors.length > 0) {
      continue;
    }

    appendToMap(targetFileNames, candidate.targetFileName, candidate);
    appendToMap(componentNames, candidate.componentName, candidate);
  }

  for (const candidate of candidates) {
    if ((targetFileNames.get(candidate.targetFileName)?.length ?? 0) > 1) {
      candidate.errors.push('duplicate target file name in import input');
    }

    if ((componentNames.get(candidate.componentName)?.length ?? 0) > 1) {
      candidate.errors.push('duplicate component name in import input');
    }
  }
};

const describeDuplicate = (record) => {
  return toReportPath(record.path);
};

export const classifyCandidates = ({ candidates, sourceIndex }) => {
  const result = {
    imported: [],
    invalid: [],
    skipped: [],
  };
  const importedFingerprints = new Map();
  const importedShapeSignatures = new Map();

  addInputDuplicateErrors(candidates);

  for (const candidate of candidates) {
    const baseRecord = {
      componentName: candidate.componentName,
      source: candidate.source,
      target: candidate.target,
      targetFileName: candidate.targetFileName,
    };

    if (candidate.errors.length > 0) {
      result.invalid.push({
        ...baseRecord,
        errors: candidate.errors,
      });
      continue;
    }

    const duplicateFileName = firstMapValue(sourceIndex.fileNames, candidate.targetFileName);
    if (duplicateFileName != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: describeDuplicate(duplicateFileName),
        reason: 'duplicate file name',
      });
      continue;
    }

    const duplicateComponent = firstMapValue(sourceIndex.componentNames, candidate.componentName);
    if (duplicateComponent != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: describeDuplicate(duplicateComponent),
        reason: 'duplicate component name',
      });
      continue;
    }

    const duplicateFingerprint = firstMapValue(sourceIndex.fingerprints, candidate.fingerprint);
    if (duplicateFingerprint != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: describeDuplicate(duplicateFingerprint),
        reason: 'duplicate SVG fingerprint',
      });
      continue;
    }

    const duplicateShapeSignature = firstMapValue(
      sourceIndex.shapeSignatures,
      candidate.shapeSignature,
    );
    if (duplicateShapeSignature != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: describeDuplicate(duplicateShapeSignature),
        reason: 'duplicate SVG shape',
      });
      continue;
    }

    const duplicateInputFingerprint = importedFingerprints.get(candidate.fingerprint);
    if (duplicateInputFingerprint != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: duplicateInputFingerprint.target,
        reason: 'duplicate SVG fingerprint in import input',
      });
      continue;
    }

    const duplicateInputShape =
      candidate.shapeSignature == null
        ? null
        : importedShapeSignatures.get(candidate.shapeSignature);
    if (duplicateInputShape != null) {
      result.skipped.push({
        ...baseRecord,
        duplicateOf: duplicateInputShape.target,
        reason: 'duplicate SVG shape in import input',
      });
      continue;
    }

    result.imported.push({
      ...baseRecord,
      filePath: candidate.filePath,
    });
    importedFingerprints.set(candidate.fingerprint, baseRecord);
    if (candidate.shapeSignature != null) {
      importedShapeSignatures.set(candidate.shapeSignature, baseRecord);
    }
  }

  return result;
};

export const prepareIconImport = async ({ nameMapPath, stagingDir }) => {
  const stagingRoot = await resolveReadablePath(stagingDir);
  const nameMap = await readNameMap(nameMapPath);
  const sourceIndex = await buildSourceIndex();
  const candidates = await createCandidates({ nameMap, stagingRoot });
  const result = classifyCandidates({ candidates, sourceIndex });

  return {
    result,
    stagingRoot,
  };
};
