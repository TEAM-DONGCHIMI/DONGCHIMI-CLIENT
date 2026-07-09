import { keyframes, style, styleVariants } from '@vanilla-extract/css';

const viewportOffsetXVar = 'var(--toast-viewport-offset-x, 1.6rem)';
const viewportOffsetYVar = 'var(--toast-viewport-offset-y, 1.6rem)';
const toastEnterAnimationDurationMs = 160;

export const toastExitAnimationDurationMs = 180;

const toastEnter = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-0.8rem)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const toastExit = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-0.8rem)',
  },
});

const toastViewportBaseClassName = style({
  position: 'fixed',
  zIndex: 1100,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  width: 'fit-content',
  maxWidth: `calc(100vw - ${viewportOffsetXVar} - ${viewportOffsetXVar})`,
  pointerEvents: 'none',
});

export const toastViewportPlacementClassNameMap = {
  'top-center': style([
    toastViewportBaseClassName,
    {
      top: `calc(env(safe-area-inset-top, 0px) + ${viewportOffsetYVar})`,
      left: '50%',
      alignItems: 'center',
      transform: 'translateX(-50%)',
    },
  ]),
  'top-right': style([
    toastViewportBaseClassName,
    {
      top: `calc(env(safe-area-inset-top, 0px) + ${viewportOffsetYVar})`,
      right: `calc(env(safe-area-inset-right, 0px) + ${viewportOffsetXVar})`,
      alignItems: 'flex-end',
    },
  ]),
  'bottom-center': style([
    toastViewportBaseClassName,
    {
      bottom: `calc(env(safe-area-inset-bottom, 0px) + ${viewportOffsetYVar})`,
      left: '50%',
      alignItems: 'center',
      transform: 'translateX(-50%)',
    },
  ]),
  'bottom-right': style([
    toastViewportBaseClassName,
    {
      right: `calc(env(safe-area-inset-right, 0px) + ${viewportOffsetXVar})`,
      bottom: `calc(env(safe-area-inset-bottom, 0px) + ${viewportOffsetYVar})`,
      alignItems: 'flex-end',
    },
  ]),
} as const;

export const toastViewportItemClassName = style({
  pointerEvents: 'auto',
});

export const toastViewportItemPhaseClassNameMap = styleVariants({
  dismissing: [
    toastViewportItemClassName,
    {
      animation: `${toastExit} ${toastExitAnimationDurationMs}ms ease-in forwards`,
    },
  ],
  visible: [
    toastViewportItemClassName,
    {
      animation: `${toastEnter} ${toastEnterAnimationDurationMs}ms ease-out`,
    },
  ],
});
