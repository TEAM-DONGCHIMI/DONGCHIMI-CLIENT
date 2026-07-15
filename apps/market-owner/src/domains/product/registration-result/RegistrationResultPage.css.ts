import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  minHeight: '100vh',
  backgroundColor: atomic.neutral[5],
});

export const pageHeaderClassName = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  borderBottom: `1px solid ${atomic.neutral[20]}`,
  backgroundColor: atomic.neutral[5],
});

export const logoPlaceholderClassName = style({
  display: 'block',
  width: '9.2rem',
  height: '3.2rem',
  backgroundColor: atomic.neutral[20],
  backgroundImage: [
    `linear-gradient(45deg, ${atomic.common[0]} 25%, transparent 25%)`,
    `linear-gradient(-45deg, ${atomic.common[0]} 25%, transparent 25%)`,
    `linear-gradient(45deg, transparent 75%, ${atomic.common[0]} 75%)`,
    `linear-gradient(-45deg, transparent 75%, ${atomic.common[0]} 75%)`,
  ].join(','),
  backgroundPosition: '0 0, 0 0.4rem, 0.4rem -0.4rem, -0.4rem 0',
  backgroundSize: '0.8rem 0.8rem',
});
