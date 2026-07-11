import config from '@dongchimi/eslint-config/react';

const marketOwnerConfig = [...config, { ignores: ['src/shared/api/__generated__/**'] }];

export default marketOwnerConfig;
