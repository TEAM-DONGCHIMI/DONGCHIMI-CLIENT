/* global process */

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createSvgFingerprint,
  createSvgShapeSignature,
  toIconComponentName,
} from './icon-utils.mjs';
import { classifyCandidates, createCandidates } from './icon-import-core.mjs';

const importedTmpDirs = [];

const createSvg = (body = '<path d="M4 4h16v16H4z" fill="currentColor"/>') => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`;
};

const createEmptyIndex = () => ({
  componentNames: new Map(),
  fileNames: new Map(),
  fingerprints: new Map(),
  shapeSignatures: new Map(),
});

const createCandidate = ({ errors = [], source = createSvg(), targetFileName }) => {
  return {
    componentName: toIconComponentName(targetFileName),
    errors: [...errors],
    filePath: path.join(os.tmpdir(), targetFileName),
    fingerprint: createSvgFingerprint(source),
    shapeSignature: createSvgShapeSignature(source),
    source: targetFileName,
    target: path.join('packages/design-system/src/icons/svg', targetFileName),
    targetFileName,
  };
};

const createExistingRecord = (fileName) => {
  return {
    componentName: toIconComponentName(fileName),
    fileName,
    path: path.join(process.cwd(), 'src', 'icons', 'svg', fileName),
  };
};

const classify = ({ candidates, sourceIndex = createEmptyIndex() }) => {
  return classifyCandidates({ candidates, sourceIndex });
};

const createTempStagingDir = async () => {
  const stagingDir = await mkdtemp(path.join(os.tmpdir(), 'dongchimi-icon-import-'));
  importedTmpDirs.push(stagingDir);
  return stagingDir;
};

afterEach(async () => {
  await Promise.all(
    importedTmpDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })),
  );
});

describe('icon import classification', () => {
  it('skips an icon when the target file name already exists', () => {
    const sourceIndex = createEmptyIndex();
    sourceIndex.fileNames.set('ic-close.svg', [createExistingRecord('ic-close.svg')]);

    const result = classify({
      candidates: [createCandidate({ targetFileName: 'ic-close.svg' })],
      sourceIndex,
    });

    expect(result.imported).toHaveLength(0);
    expect(result.skipped).toMatchObject([{ reason: 'duplicate file name' }]);
  });

  it('skips an icon when only the component name already exists', () => {
    const sourceIndex = createEmptyIndex();
    sourceIndex.componentNames.set('IcArrowRight', [
      createExistingRecord('ic-arrow-right-old.svg'),
    ]);

    const result = classify({
      candidates: [createCandidate({ targetFileName: 'ic-arrow-right.svg' })],
      sourceIndex,
    });

    expect(result.imported).toHaveLength(0);
    expect(result.skipped).toMatchObject([{ reason: 'duplicate component name' }]);
  });

  it('imports the first matching input and skips the duplicate within the same import batch', () => {
    const source = createSvg('<path d="M4 4h16v16H4z" fill="#000"/>');

    const result = classify({
      candidates: [
        createCandidate({ source, targetFileName: 'ic-square.svg' }),
        createCandidate({ source, targetFileName: 'ic-square-copy.svg' }),
      ],
    });

    expect(result.imported).toHaveLength(1);
    expect(result.imported[0].targetFileName).toBe('ic-square.svg');
    expect(result.skipped).toMatchObject([{ reason: 'duplicate SVG fingerprint in import input' }]);
  });

  it('keeps invalid candidates out of the imported and skipped results', () => {
    const result = classify({
      candidates: [
        createCandidate({
          errors: ['file name must match ic-name.svg'],
          targetFileName: 'bad-name.svg',
        }),
      ],
    });

    expect(result.imported).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);
    expect(result.invalid).toMatchObject([{ errors: ['file name must match ic-name.svg'] }]);
  });

  it('applies name-map targets before duplicate checks', async () => {
    const stagingDir = await createTempStagingDir();
    await writeFile(path.join(stagingDir, 'Close.svg'), createSvg(), 'utf8');

    const candidates = await createCandidates({
      nameMap: {
        'Close.svg': 'ic-close.svg',
      },
      stagingRoot: stagingDir,
    });
    const sourceIndex = createEmptyIndex();
    sourceIndex.fileNames.set('ic-close.svg', [createExistingRecord('ic-close.svg')]);

    const result = classify({ candidates, sourceIndex });

    expect(candidates[0].targetFileName).toBe('ic-close.svg');
    expect(result.imported).toHaveLength(0);
    expect(result.skipped).toMatchObject([{ reason: 'duplicate file name' }]);
  });

  it('reports source as a staging-relative path without leaking absolute paths', async () => {
    const stagingDir = await createTempStagingDir();
    await writeFile(path.join(stagingDir, 'ic-close.svg'), createSvg(), 'utf8');

    const candidates = await createCandidates({ nameMap: {}, stagingRoot: stagingDir });

    // stagingDir is an OS temp dir outside the workspace; the report source must
    // stay relative to the staging root instead of exposing the absolute path.
    expect(candidates[0].source).toBe('ic-close.svg');
    expect(path.isAbsolute(candidates[0].source)).toBe(false);
    expect(candidates[0].source).not.toContain(stagingDir);
  });
});
