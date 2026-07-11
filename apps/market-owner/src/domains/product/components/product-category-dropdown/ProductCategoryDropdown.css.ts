import { style } from '@vanilla-extract/css';

import { semantic } from '@dongchimi/design-system/tokens';

export const itemClassName = style({
  flexShrink: 0,
  selectors: {
    '&:not(:disabled):hover': {
      color: semantic.primary.strong,
    },
    '&:not(:disabled):hover::before': {
      backgroundColor: semantic.primary.light,
    },
  },
});
