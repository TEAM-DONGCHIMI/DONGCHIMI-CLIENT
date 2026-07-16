import config from '@dongchimi/eslint-config/next';

const clientConfig = [
  ...config,
  { ignores: ['src/shared/api/__generated__/**', 'public/sw.js', 'public/sw.js.map'] },
];

export default clientConfig;
