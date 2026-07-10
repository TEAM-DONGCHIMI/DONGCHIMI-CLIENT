import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const errorIconClassName = style({
  color: atomic.common[0],
});

export const pageRootClassName = style({
  position: 'relative',
  width: '100%',
  minWidth: 'max-content',
  minHeight: '100vh',
});
