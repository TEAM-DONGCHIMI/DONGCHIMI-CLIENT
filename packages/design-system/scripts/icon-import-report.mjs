/* global console */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveReportPath, toReportPath } from './icon-import-core.mjs';

export const toJsonReport = ({ dryRun, result, stagingRoot }) => {
  return {
    dryRun,
    generatedAt: new Date().toISOString(),
    stagingDir: toReportPath(stagingRoot),
    summary: {
      imported: result.imported.length,
      invalid: result.invalid.length,
      skipped: result.skipped.length,
    },
    imported: result.imported.map((record) => ({
      componentName: record.componentName,
      source: record.source,
      target: record.target,
      targetFileName: record.targetFileName,
    })),
    invalid: result.invalid,
    skipped: result.skipped,
  };
};

export const writeReport = async ({ dryRun, reportPath, result, stagingRoot }) => {
  if (reportPath == null) {
    return null;
  }

  const resolvedReportPath = resolveReportPath(reportPath);
  await mkdir(path.dirname(resolvedReportPath), { recursive: true });
  await writeFile(
    resolvedReportPath,
    `${JSON.stringify(toJsonReport({ dryRun, result, stagingRoot }), null, 2)}\n`,
    'utf8',
  );
  console.log(`Wrote icon import report: ${toReportPath(resolvedReportPath)}`);
  return resolvedReportPath;
};

const printList = ({ emptyMessage, records, title }) => {
  if (records.length === 0) {
    console.log(emptyMessage);
    return;
  }

  console.log(title);

  for (const record of records) {
    const detail = record.reason
      ? `: ${record.reason}${record.duplicateOf ? ` (${record.duplicateOf})` : ''}`
      : '';
    console.log(`- ${record.targetFileName}${detail}`);
  }
};

export const printResult = ({ dryRun, result }) => {
  const importVerb = dryRun || result.invalid.length > 0 ? 'Will import' : 'Imported';

  console.log(
    `${importVerb} ${result.imported.length} icon${result.imported.length === 1 ? '' : 's'}.`,
  );
  console.log(
    `Skipped ${result.skipped.length} duplicate icon${result.skipped.length === 1 ? '' : 's'}.`,
  );
  console.log(`Invalid: ${result.invalid.length} icon${result.invalid.length === 1 ? '' : 's'}.`);

  printList({
    emptyMessage: 'No imported icons.',
    records: result.imported,
    title: importVerb === 'Will import' ? 'Will import:' : 'Imported:',
  });
  printList({
    emptyMessage: 'No skipped icons.',
    records: result.skipped,
    title: 'Skipped:',
  });
  printList({
    emptyMessage: 'No invalid icons.',
    records: result.invalid.map((record) => ({
      ...record,
      reason: record.errors.join('; '),
    })),
    title: 'Invalid:',
  });
};

export const printNextActions = ({ dryRun, generate, result }) => {
  if (result.invalid.length > 0) {
    console.log('Fix invalid SVG input, then rerun icons:import.');
    return;
  }

  if (dryRun) {
    console.log('Next: rerun without --dry-run to copy imported icons.');
    return;
  }

  if (result.imported.length > 0 && !generate) {
    console.log('Next: run `pnpm --filter @dongchimi/design-system icons:generate`.');
  }
};
