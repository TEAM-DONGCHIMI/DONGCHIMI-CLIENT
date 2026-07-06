import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const noSidebarLayoutRootClassName = style({
  minHeight: '100vh',
  backgroundColor: atomic.neutral[10],
});
