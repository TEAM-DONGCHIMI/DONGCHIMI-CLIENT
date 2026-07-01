import storybook from 'eslint-plugin-storybook';

import config from '@dongchimi/eslint-config/react';

export default [...config, ...storybook.configs['flat/recommended']];
