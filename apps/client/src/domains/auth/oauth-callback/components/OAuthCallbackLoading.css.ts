import { keyframes, style } from '@vanilla-extract/css';

import { atomic, semantic } from '@dongchimi/design-system/tokens';

const rotate = keyframes({
  to: {
    transform: 'rotate(360deg)',
  },
});

export const pageClassName = style({
  display: 'flex',
  minHeight: '100dvh',
  alignItems: 'center',
  justifyContent: 'center',
});

export const statusClassName = style({
  width: '6.4rem',
  height: '6.4rem',
});

export const lottieClassName = style({
  width: '100%',
  height: '100%',
});

export const hiddenLottieClassName = style({
  display: 'none',
});

export const fallbackSpinnerClassName = style({
  display: 'block',
  width: '4rem',
  height: '4rem',
  margin: '1.2rem',
  border: `0.4rem solid ${atomic.neutral[20]}`,
  borderTopColor: semantic.primary.normal,
  borderRadius: '50%',
  animation: `${rotate} 800ms linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
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
