import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const sectionClassName = style({
  minHeight: 'calc(100vh - 6.4rem)',
  gridTemplateRows: 'auto 1fr',
  gap: '8.8rem',
  boxSizing: 'border-box',
  padding: '3.2rem 4rem 6rem',
  backgroundColor: atomic.common[0],
  backgroundImage: "url('/images/Img_background.svg')",
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

export const headingGroupClassName = style({
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
});
