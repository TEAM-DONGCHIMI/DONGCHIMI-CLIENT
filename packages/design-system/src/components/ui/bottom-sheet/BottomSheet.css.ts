import { keyframes, style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '../../../tokens';

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
    transform: 'translate3d(-50%, 1.6rem, 0)',
  },
  to: {
    opacity: 1,
    transform: 'translate3d(-50%, 0, 0)',
  },
});

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const contentClassName = style({
  position: 'fixed',
  right: 'auto',
  bottom: 0,
  left: '50%',
  zIndex: contentZIndex,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '37.5rem',
  maxHeight: 'min(90dvh, calc(100dvh - 2.4rem))',
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  border: 0,
  borderRadius: '2.4rem 2.4rem 0 0',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
  color: atomic.neutral[90],
  transform: 'translate3d(-50%, 0, 0)',
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

export const handleClassName = style({
  flexShrink: 0,
  alignSelf: 'center',
  width: '6.8rem',
  height: '0.6rem',
  marginTop: '2.4rem',
  borderRadius: '999rem',
  backgroundColor: atomic.neutral[20],
});

export const headerClassName = style({
  display: 'grid',
  gap: '0.8rem',
  padding: '3.6rem 2.4rem 0',
});

export const titleClassName = style({
  ...typography['title-2-bold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const descriptionClassName = style({
  ...typography['body-2-medium'],
  margin: 0,
  color: atomic.neutral[50],
});

export const bodyClassName = style({
  display: 'grid',
  gap: '1.6rem',
  overflowY: 'auto',
  padding: '3.2rem 2.4rem',
});

export const footerClassName = style({
  flexShrink: 0,
  borderTop: `0.1rem solid ${atomic.neutral[20]}`,
});

export const closeClassName = style({
  ...typography['body-1-semibold'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '6.4rem',
  padding: '1.6rem 2.4rem',
  border: 0,
  backgroundColor: atomic.common[0],
  color: atomic.neutral[70],
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: atomic.neutral[10],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: -3,
    },
    '&:disabled': {
      color: atomic.neutral[30],
      cursor: 'not-allowed',
    },
  },
});
