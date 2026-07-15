import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

import { MARKET_OWNER_SIDEBAR_WIDTH_PX } from '@/shared/constants/layout';

export const sidebarLayoutRootClassName = style({
  display: 'grid',
  height: '100vh',
  gridTemplateColumns: `${MARKET_OWNER_SIDEBAR_WIDTH_PX}px minmax(0, 1fr)`,
  overflow: 'hidden',
  backgroundColor: atomic.neutral[5],
});

export const sidebarSlotClassName = style({
  position: 'sticky',
  top: 0,
  height: '100vh',
  alignSelf: 'start',
  overflow: 'hidden',
});

export const contentSlotClassName = style({
  minWidth: 0,
  minHeight: 0,
  height: '100vh',
  overflowX: 'hidden',
  overflowY: 'auto',
});

export const brandImageClassName = style({
  display: 'block',
  width: '9.2rem',
  height: '3.2rem',
  flexShrink: 0,
});

export const profileAvatarClassName = style({
  display: 'inline-flex',
  width: '4rem',
  height: '4rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999rem',
  backgroundColor: atomic.neutral[20],
  color: atomic.neutral[70],
  ...typography['caption-1-medium'],
});

export const profileAvatarImageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const sidebarStateIconClassName = style({
  position: 'relative',
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  alignItems: 'center',
  justifyContent: 'center',
});

export const sidebarStateIconDefaultClassName = style({
  position: 'absolute',
  inset: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    ':where(a:hover, button:hover, a[aria-current="page"], button[aria-current="page"]) &': {
      opacity: 0,
    },
  },
});

export const sidebarStateIconHoverClassName = style({
  position: 'absolute',
  inset: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  selectors: {
    ':where(a:hover, button:hover, a[aria-current="page"], button[aria-current="page"]) &': {
      opacity: 1,
    },
  },
});

export const helpCardClassName = style({
  display: 'grid',
  gap: '1rem',
});

export const helpTextClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.8rem',
  margin: 0,
  color: atomic.neutral[80],
  ...typography['caption-1-medium'],
});

export const helpIconClassName = style({
  flexShrink: 0,
  width: '1.6rem',
  height: '1.6rem',
});

export const helpButtonClassName = style({
  appearance: 'none',
  minHeight: '4.4rem',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.8rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[70],
  cursor: 'pointer',
  ...typography['body-3-semibold'],
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${atomic.neutral[90]} 20%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});
