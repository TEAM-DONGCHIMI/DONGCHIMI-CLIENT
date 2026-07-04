import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.4rem',
  borderRight: `1px solid ${atomic.neutral[30]}`,
  borderBottom: `1px solid ${atomic.neutral[30]}`,
  borderLeft: `1px solid ${atomic.neutral[30]}`,
  borderBottomRightRadius: '1.2rem',
  borderBottomLeftRadius: '1.2rem',
  padding: '1.6rem 2.4rem',
  overflowX: 'auto',
  backgroundColor: atomic.common[0],
});

export const contentClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '1.2rem',
  minWidth: 0,
});

export const summaryClassName = style({
  ...typography['body-3-regular'],
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  color: atomic.neutral[60],
  whiteSpace: 'nowrap',
});

export const summaryValueClassName = style({
  fontWeight: 400,
});

export const pageSizeClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '0.8rem',
  height: '3.2rem',
});

export const pageSizeControlClassName = style({
  ...typography['body-3-medium'],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.1rem',
  minWidth: '3.8rem',
  height: '3.2rem',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: '0.8rem',
  padding: '0.6rem 0.6rem 0.6rem 0.8rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
  selectors: {
    '&:is(button):hover': {
      borderColor: atomic.neutral[40],
    },
    '&:is(button):focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const pageSizeValueClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 0.2rem',
});

export const pageSizeSuffixClassName = style({
  ...typography['body-3-regular'],
  flexShrink: 0,
  color: atomic.neutral[40],
  whiteSpace: 'nowrap',
});

export const navigationClassName = style({
  flexShrink: 0,
});

export const chevronIconClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.6rem',
  height: '1.6rem',
  lineHeight: 0,
});

globalStyle(`${chevronIconClassName} > svg`, {
  width: '1.6rem',
  height: '1.6rem',
});

export const chevronDownClassName = style([
  chevronIconClassName,
  {
    transform: 'rotate(90deg)',
  },
]);
