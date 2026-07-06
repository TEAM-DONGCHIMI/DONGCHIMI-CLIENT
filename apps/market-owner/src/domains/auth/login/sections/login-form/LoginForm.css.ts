import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const formClassName = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '2rem',
});

export const keepSignedInClassName = style({
  position: 'relative',
  display: 'inline-flex',
  width: 'fit-content',
  maxWidth: '100%',
  alignItems: 'center',
  gap: '0.8rem',
  cursor: 'pointer',
});

export const keepSignedInInputClassName = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  margin: 0,
  cursor: 'pointer',
  opacity: 0,
});

export const keepSignedInIconClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  width: '2rem',
  height: '2rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.4rem',
  selectors: {
    [`${keepSignedInInputClassName}:focus-visible + &`]: {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const keepSignedInUncheckedIconClassName = style({
  display: 'block',
  width: '2rem',
  height: '2rem',
  selectors: {
    [`${keepSignedInInputClassName}:checked + ${keepSignedInIconClassName} &`]: {
      display: 'none',
    },
  },
});

export const keepSignedInCheckedIconClassName = style({
  display: 'none',
  width: '2rem',
  height: '2rem',
  selectors: {
    [`${keepSignedInInputClassName}:checked + ${keepSignedInIconClassName} &`]: {
      display: 'block',
    },
  },
});

export const keepSignedInTextClassName = style({
  ...typography['caption-1-regular'],
  color: atomic.neutral[60],
});

export const fullWidthButtonClassName = style({
  width: '100%',
});
