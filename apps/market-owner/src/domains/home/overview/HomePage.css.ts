import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;
const cardShadow = '0 1.6rem 3.6rem rgba(25, 33, 46, 0.08)';
const checkerboardColor = 'rgba(229, 232, 235, 0.68)';
const dashboardCardHeight = '38.6rem';
const dashboardCardMinWidth = '32rem';
const dashboardGap = '2.6rem';
const contentSectionGap = '1.6rem';
const contentInlinePadding = '4rem';
const contentBlockEndPadding = '2.6rem';

export const pageRootClassName = style({
  position: 'relative',
  display: 'flex',
  minHeight: '100vh',
  minWidth: 0,
  boxSizing: 'border-box',
  flexDirection: 'column',
  padding: 0,
  backgroundColor: atomic.neutral[5],
  color: atomic.neutral[90],
});

export const visuallyHiddenHeadingClassName = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const pageHeaderClassName = style({
  width: '100%',
  minWidth: 0,
  flexShrink: 0,
});

export const homeToastIconClassName = style({
  display: 'block',
  width: '2rem',
  height: '2rem',
  fontSize: '2rem',
});

export const contentSectionClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  gap: contentSectionGap,
  padding: `0 ${contentInlinePadding} ${contentBlockEndPadding}`,
});

export const heroSectionClassName = style({
  position: 'relative',
  width: '100%',
  minHeight: '40.8rem',
  alignSelf: 'stretch',
  backgroundImage: `repeating-conic-gradient(from 90deg, ${checkerboardColor} 0 25%, transparent 0 50%)`,
  backgroundPosition: 'center top',
  backgroundSize: '9.6rem 9.6rem',
  borderRadius: '2rem',
  overflow: 'hidden',
});

export const heroActionListClassName = style({
  position: 'absolute',
  top: '8.4rem',
  right: '5.6rem',
  display: 'grid',
  width: '31.2rem',
  maxWidth: 'calc(100% - 11.2rem)',
  gap: '0.8rem',
});

export const dashboardGridClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  alignItems: 'stretch',
  alignSelf: 'stretch',
  columnGap: dashboardGap,
  justifyContent: 'space-between',
  rowGap: dashboardGap,
  gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${dashboardCardMinWidth}), 1fr))`,
});

export const productCardClassName = style({
  height: dashboardCardHeight,
  overflow: 'hidden',
});

export const dashboardCardContainerClassName = style({
  position: 'relative',
  minWidth: 0,
});

export const dashboardCardEmptyOverlayClassName = style({
  position: 'absolute',
  zIndex: 1,
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2rem',
  padding: '2rem',
  backgroundColor: semantic.overlay.dimmer,
  color: atomic.common[0],
  pointerEvents: 'auto',
  textAlign: 'center',
});

export const dashboardCardEmptyMessageClassName = style({
  ...typography['heading-2-semibold'],
  letterSpacing: '-0.044rem',
  margin: 0,
  whiteSpace: 'pre-line',
});

export const productCardActionButtonClassName = style({
  ...typography['body-3-semibold'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRadius: '1.2rem',
  padding: '0.4rem 0.8rem',
  backgroundColor: 'transparent',
  color: semantic.primary.strong,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const shareCardClassName = style({
  height: dashboardCardHeight,
  boxShadow: cardShadow,
});
