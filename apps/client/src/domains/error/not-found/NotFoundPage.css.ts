import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  minHeight: '100dvh',
  paddingTop: 'clamp(12rem, 28.8dvh, 23.4rem)',
  paddingRight: 'max(2rem, var(--client-safe-area-right))',
  paddingBottom: 'calc(6rem + var(--client-safe-area-bottom))',
  paddingLeft: 'max(2rem, var(--client-safe-area-left))',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  '@supports': {
    'not (min-height: 100dvh)': {
      minHeight: '100vh',
      paddingTop: 'clamp(12rem, 28.8vh, 23.4rem)',
    },
  },
});

export const contentClassName = style({
  textAlign: 'center',
});

export const imageClassName = style({
  width: '20rem',
  height: '20rem',
});

export const messageClassName = style({
  gap: '0.8rem',
  padding: '2rem',
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  color: atomic.neutral[90],
  wordBreak: 'keep-all',
});

export const descriptionClassName = style({
  ...typography['caption-1-medium'],
  color: atomic.neutral[50],
  wordBreak: 'keep-all',
});

export const homeLinkClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: '100%',
  maxWidth: '33.5rem',
  minHeight: '5rem',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 'auto',
  padding: '1.2rem 2rem',
  borderRadius: '1.2rem',
  backgroundColor: atomic.neutral[80],
  color: atomic.common[0],
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${atomic.neutral[80]} 34%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});
