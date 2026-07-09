import { style } from '@vanilla-extract/css';

const viewportOffsetXVar = 'var(--toast-viewport-offset-x, 1.6rem)';
const viewportOffsetYVar = 'var(--toast-viewport-offset-y, 1.6rem)';

const toastViewportBaseClassName = style({
  position: 'fixed',
  zIndex: 1100,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  width: 'fit-content',
  maxWidth: 'calc(100vw - 3.2rem)',
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
