import { fileURLToPath } from 'node:url';

const quote = (value) => JSON.stringify(value);
const prettierExtensions = '*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,yml,yaml,md,css}';
const node = quote(process.execPath);
const prettier = quote(
  fileURLToPath(new URL('./node_modules/prettier/bin/prettier.cjs', import.meta.url)),
);
const pnpm = process.env.npm_execpath ? `${node} ${quote(process.env.npm_execpath)}` : 'pnpm';

const formatFiles = (files) => `${node} ${prettier} --write ${files.map(quote).join(' ')}`;

const lintClientFiles = (files) => {
  const clientFiles = files.filter((file) => file.includes('/apps/client/'));

  if (clientFiles.length === 0) {
    return [];
  }

  return [`${pnpm} --filter client exec eslint --fix ${clientFiles.map(quote).join(' ')}`];
};

export default {
  [prettierExtensions]: (files) => [...lintClientFiles(files), formatFiles(files)],
};
