import config from '@dongchimi/eslint-config/next';

const clientConfig = [...config, { ignores: ['src/shared/api/__generated__/**'] }];

export default clientConfig;
