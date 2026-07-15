import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  position: 'relative',
  minHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: atomic.common[0],
  '@supports': {
    'not (min-height: 100dvh)': {
      minHeight: '100vh',
    },
  },
});

export const onboardingImageClassName = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  aspectRatio: '375 / 433',
  backgroundColor: atomic.neutral[10],
  backgroundImage: [
    'linear-gradient(45deg, rgba(255, 255, 255, 0.72) 25%, transparent 25%)',
    'linear-gradient(-45deg, rgba(255, 255, 255, 0.72) 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.72) 75%)',
    'linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.72) 75%)',
  ].join(', '),
  backgroundPosition: '0 0, 0 3.1rem, 3.1rem -3.1rem, -3.1rem 0',
  backgroundSize: '6.2rem 6.2rem',
});

export const loginSectionClassName = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  minHeight: '100dvh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: 'max(2rem, var(--client-safe-area-right))',
  paddingBottom: 'calc(6rem + var(--client-safe-area-bottom))',
  paddingLeft: 'max(2rem, var(--client-safe-area-left))',
  '@supports': {
    'not (min-height: 100dvh)': {
      minHeight: '100vh',
    },
  },
});

export const termsClassName = style({
  ...typography['caption-2-light'],
  width: '100%',
  maxWidth: '27.3rem',
  margin: '1.8rem 0 0',
  color: atomic.neutral[50],
  textAlign: 'center',
});

export const visuallyHiddenClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
