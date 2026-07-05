import { keyframes, style } from '@vanilla-extract/css';

import { atomic, semantic, shadow } from '../../../tokens';

const overlayZIndex = 1000;
const contentZIndex = overlayZIndex + 1;
const overlayAnimationDurationMs = 160;
const contentAnimationDurationMs = 180;

const overlayShow = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const contentShow = keyframes({
  from: {
    opacity: 0,
    transform: 'translate3d(-50%, -48%, 0) scale(0.98)',
  },
  to: {
    opacity: 1,
    transform: 'translate3d(-50%, -50%, 0) scale(1)',
  },
});

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const contentClassName = style({
  position: 'fixed',
  top: '50%',
  right: 'auto',
  bottom: 'auto',
  left: '50%',
  zIndex: contentZIndex,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  maxWidth: 'calc(100vw - 3.2rem)',
  maxHeight: 'calc(100dvh - 4.8rem)',
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  border: 0,
  borderRadius: '0.8rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
  color: atomic.neutral[90],
  transform: 'translate3d(-50%, -50%, 0)',
  animation: `${contentShow} ${contentAnimationDurationMs}ms ease-out`,
  selectors: {
    '&::backdrop': {
      zIndex: overlayZIndex,
      backgroundColor: semantic.overlay.dimmer,
      animation: `${overlayShow} ${overlayAnimationDurationMs}ms ease-out`,
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: -3,
    },
  },
});
