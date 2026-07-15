import storybook from 'eslint-plugin-storybook';

import config from '@dongchimi/eslint-config/react';

export default [
  {
    ignores: ['src/api/__generated__/**'],
  },
  ...config,
  ...storybook.configs['flat/recommended'],
];
