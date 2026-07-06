import { style } from '@vanilla-extract/css';

import { atomic, shadow, typography } from '@dongchimi/design-system/tokens';

export const fallbackRootClassName = style({
  display: 'grid',
  minHeight: '100%',
  placeItems: 'center',
  padding: '4rem',
  backgroundColor: atomic.neutral[10],
});

export const fallbackPanelClassName = style({
  display: 'grid',
  width: 'min(100%, 42rem)',
  gap: '1.6rem',
  padding: '3.2rem',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.8rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});

export const fallbackTitleClassName = style({
  margin: 0,
  color: atomic.neutral[90],
  ...typography['heading-2-semibold'],
});

export const fallbackDescriptionClassName = style({
  margin: 0,
  color: atomic.neutral[60],
  ...typography['body-3-medium'],
});

export const retryButtonClassName = style({
  appearance: 'none',
  minHeight: '4.8rem',
  border: 0,
  borderRadius: '0.8rem',
  backgroundColor: atomic.neutral[90],
  color: atomic.common[0],
  cursor: 'pointer',
  ...typography['body-3-semibold'],
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${atomic.neutral[90]} 20%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});
