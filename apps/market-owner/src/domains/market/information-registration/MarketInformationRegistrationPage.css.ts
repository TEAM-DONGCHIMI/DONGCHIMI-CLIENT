import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  minHeight: '100vh',
  backgroundColor: atomic.neutral[10],
});

export const logoClassName = style({
  display: 'inline-flex',
  width: '9.2rem',
  height: '3.2rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.8rem',
  backgroundColor: atomic.neutral[90],
  color: atomic.common[0],
  ...typography['caption-1-medium'],
});

export const mainClassName = style({
  width: '100%',
  padding: '3.6rem 2.4rem 4.8rem',
});

export const pageContainerClassName = style({
  width: '100%',
  maxWidth: '115.6rem',
  margin: '0 auto',
});

export const titleClassName = style({
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
  ...typography['heading-2-semibold'],
});

export const descriptionClassName = style({
  margin: 0,
  color: atomic.neutral[70],
  textAlign: 'center',
  ...typography['body-2-medium'],
});

export const toastErrorIconClassName = style({
  color: atomic.common[0],
});

export const formClassName = style({
  marginTop: '3.6rem',
});

export const formContentClassName = style({
  gap: '5rem',
  justifyContent: 'center',
  '@media': {
    'screen and (max-width: 960px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
});

export const fieldsClassName = style({
  width: '100%',
  maxWidth: '86.6rem',
  minWidth: 0,
});

export const fieldPairGridClassName = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 39.4rem) minmax(0, 43.7rem)',
  gap: '3.5rem',
  '@media': {
    'screen and (max-width: 860px)': {
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gap: '3.2rem',
    },
  },
});

export const submitAreaClassName = style({
  marginTop: '7.4rem',
});

export const submitButtonClassName = style({
  width: '38.8rem',
  minWidth: 0,
  '@media': {
    'screen and (max-width: 520px)': {
      width: '100%',
    },
  },
});
