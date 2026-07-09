import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

export const overlayClassName = style({
  position: 'fixed',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  justifyContent: 'flex-end',
  backgroundColor: semantic.overlay.dimmer,
});

export const panelClassName = style({
  boxSizing: 'border-box',
  width: 'min(41rem, 100vw)',
  height: '100dvh',
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
  margin: '1.8rem 0 0 2.5rem',
  border: 0,
  borderRadius: '0.8rem',
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  cursor: 'pointer',
  fontSize: '2.4rem',
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
  gap: '2.2rem',
  padding: '1.2rem 2.5rem 3rem',
  '@media': {
    'screen and (max-width: 480px)': {
      padding: '1.2rem 2.5rem 3rem',
    },
  },
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  whiteSpace: 'pre-line',
});

export const imageListClassName = style({
  display: 'flex',
  width: '36rem',
  maxWidth: '100%',
  alignSelf: 'center',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const guideImagePlaceholderClassName = style({
  flex: '0 0 auto',
  width: '100%',
  backgroundColor: atomic.neutral[10],
  backgroundImage:
    'linear-gradient(45deg, rgba(226, 232, 240, 0.72) 25%, transparent 25%), linear-gradient(-45deg, rgba(226, 232, 240, 0.72) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(226, 232, 240, 0.72) 75%), linear-gradient(-45deg, transparent 75%, rgba(226, 232, 240, 0.72) 75%)',
  backgroundPosition: '0 0, 0 1rem, 1rem -1rem, -1rem 0',
  backgroundSize: '2rem 2rem',
});

export const guideImagePlaceholderHeightClassNames = styleVariants({
  large: {
    height: '27.4rem',
  },
  medium: {
    height: '24.1rem',
  },
  small: {
    height: '17.5rem',
  },
});
