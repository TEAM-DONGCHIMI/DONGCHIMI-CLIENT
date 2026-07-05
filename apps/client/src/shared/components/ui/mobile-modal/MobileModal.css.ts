import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: 'min(30.5rem, calc(100vw - 3.2rem))',
  maxWidth: 'calc(100vw - 3.2rem)',
  borderRadius: '1.2rem',
  boxShadow: 'none',
});

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxHeight: 'inherit',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '2rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const messageClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(26.5rem, 100%)',
  minWidth: 0,
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-2-semibold'],
  width: '100%',
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

export const subTextClassName = style({
  ...typography['caption-1-regular'],
  margin: 0,
  color: atomic.neutral[50],
  textAlign: 'center',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[80],
  textAlign: 'center',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

export const footerClassName = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '0.8rem',
  width: 'min(26.5rem, 100%)',
  marginTop: '1.2rem',
});

export const actionButtonClassName = style({
  width: '100%',
  minWidth: 0,
  height: '4.4rem',
  padding: '1.2rem',
  borderRadius: '0.8rem',
  ...typography['body-3-semibold'],
});

export const cancelButtonClassName = style({
  backgroundColor: atomic.neutral[30],
  color: atomic.common[0],
  selectors: {
    '&:not(:disabled):hover': {
      backgroundColor: atomic.neutral[40],
    },
    '&:not(:disabled):active': {
      backgroundColor: atomic.neutral[50],
    },
    '&:focus-visible': {
      outlineColor: `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`,
    },
  },
});
