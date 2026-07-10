import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const previewClassName = style({
  position: 'relative',
  width: '30rem',
  aspectRatio: '300 / 610',
  overflow: 'hidden',
});

export const previewContentClassName = style({
  position: 'absolute',
  inset: '1.1rem 1.4rem 1rem',
  overflow: 'hidden',
  borderRadius: '4rem',
  backgroundColor: atomic.common[0],
});

export const statusBarClassName = style({
  position: 'absolute',
  top: '1.1rem',
  left: '1.4rem',
  zIndex: 1,
  display: 'block',
  width: 'calc(100% - 2.8rem)',
  height: 'auto',
});

export const phoneFrameClassName = style({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  display: 'block',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});
