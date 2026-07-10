import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

const toastLifetime = keyframes({
  '0%, 84%': {
    opacity: 1,
    transform: 'translate(-50%, 0)',
  },
  '100%': {
    opacity: 0,
    transform: 'translate(-50%, -0.8rem)',
  },
});

export const toastClassName = style({
  position: 'fixed',
  top: '2rem',
  left: 'calc(50% + 145px)',
  zIndex: 20,
  animation: `${toastLifetime} 3000ms ease forwards`,
});

export const errorIconClassName = style({
  color: atomic.common[0],
});

globalStyle(`${toastClassName} svg`, {
  width: '2.4rem',
  height: '2.4rem',
});
