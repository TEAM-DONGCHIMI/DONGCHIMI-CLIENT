import nextVitals from 'eslint-config-next/core-web-vitals';

import { baseConfig, formattingConfig, reactConventions } from './shared.mjs';

export default [...baseConfig, ...nextVitals, ...reactConventions, formattingConfig];
