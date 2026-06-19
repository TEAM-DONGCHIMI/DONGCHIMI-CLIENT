const quote = (value) => JSON.stringify(value);
const prettierExtensions = '*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,yml,yaml,md,css}';

const formatFiles = (files) => `prettier --write ${files.map(quote).join(' ')}`;

const lintClientFiles = (files) => {
  const clientFiles = files.filter((file) => file.includes('/apps/client/'));

  if (clientFiles.length === 0) {
    return [];
  }

  return [`pnpm --filter client exec eslint --fix ${clientFiles.map(quote).join(' ')}`];
};

export default {
  [prettierExtensions]: (files) => [...lintClientFiles(files), formatFiles(files)],
};
