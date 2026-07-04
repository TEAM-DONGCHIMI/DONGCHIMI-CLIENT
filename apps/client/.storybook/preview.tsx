import type { Preview } from '@storybook/react-vite';

import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        state: 'open',
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
