import { style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

export const overlayClassName = style({
  position: 'fixed',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(17, 24, 39, 0.48)',
});

export const panelClassName = style({
  boxSizing: 'border-box',
  width: '42rem',
  maxWidth: 'calc(100vw - 3.2rem)',
  height: '100vh',
  overflowY: 'auto',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
  color: atomic.neutral[90],
});

export const closeButtonClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  width: '4rem',
  height: '4rem',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '1.6rem 0 0 1.6rem',
  border: 0,
  borderRadius: '0.8rem',
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});

export const contentClassName = style({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
  gap: '2.4rem',
  padding: '1.2rem 3.2rem 4rem',
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const stepListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const stepItemClassName = style({
  display: 'grid',
  gridTemplateColumns: '2.4rem minmax(0, 1fr)',
  gap: '1.2rem',
});

export const stepNumberClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.6rem',
  backgroundColor: atomic.neutral[90],
  color: atomic.common[0],
  letterSpacing: 0,
});

export const stepBodyClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.8rem',
});

export const stepTitleClassName = style({
  ...typography['body-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const stepDescriptionClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
});

export const stepImagePlaceholderClassName = style({
  width: '100%',
  height: '12rem',
  borderRadius: '1.2rem',
  backgroundColor: atomic.neutral[10],
  backgroundImage:
    'linear-gradient(45deg, rgba(226, 232, 240, 0.72) 25%, transparent 25%), linear-gradient(-45deg, rgba(226, 232, 240, 0.72) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(226, 232, 240, 0.72) 75%), linear-gradient(-45deg, transparent 75%, rgba(226, 232, 240, 0.72) 75%)',
  backgroundPosition: '0 0, 0 1rem, 1rem -1rem, -1rem 0',
  backgroundSize: '2rem 2rem',
});
