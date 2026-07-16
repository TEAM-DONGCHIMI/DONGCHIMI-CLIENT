import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  display: 'grid',
  minHeight: '100dvh',
  paddingTop: 'max(3.2rem, var(--client-safe-area-top))',
  paddingRight: 'max(2rem, var(--client-safe-area-right))',
  paddingBottom: 'max(3.2rem, var(--client-safe-area-bottom))',
  paddingLeft: 'max(2rem, var(--client-safe-area-left))',
  backgroundColor: atomic.common[0],
  placeItems: 'center',
  '@supports': {
    'not (min-height: 100dvh)': {
      minHeight: '100vh',
    },
  },
});

export const contentClassName = style({
  display: 'flex',
  width: '100%',
  maxWidth: '33.5rem',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3.2rem',
  textAlign: 'center',
});

export const messageClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});

export const statusClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: semantic.primary.normal,
  letterSpacing: '0.08em',
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  wordBreak: 'keep-all',
});

export const descriptionClassName = style({
  ...typography['body-3-regular'],
  maxWidth: '28rem',
  margin: 0,
  color: atomic.neutral[60],
  wordBreak: 'keep-all',
});

export const retryButtonClassName = style({
  width: '100%',
});
