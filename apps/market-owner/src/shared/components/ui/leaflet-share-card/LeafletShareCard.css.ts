import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '2rem',
  backgroundColor: atomic.common[0],
});

export const headerClassName = style({
  display: 'grid',
  gap: '0.4rem',
  padding: '2rem 2rem 0',
});

export const titleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  overflow: 'hidden',
  color: atomic.neutral[50],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const linkContainerClassName = style({
  padding: '1.8rem 2rem 0.8rem',
});

export const linkFieldClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  gridTemplateColumns: 'minmax(0, 1fr) 2.4rem',
  borderRadius: '1.2rem',
  padding: '1.4rem 1.6rem',
  backgroundColor: atomic.neutral[10],
});

export const shareUrlClassName = style({
  ...typography['body-3-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[60],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const linkCopyButtonClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRadius: '0.6rem',
  padding: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[60],
  cursor: 'pointer',
  transition: 'background-color 130ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: atomic.neutral[20],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const actionListClassName = style({
  display: 'grid',
  gap: '0.2rem',
  margin: 0,
  padding: '0 2rem 2.4rem',
  listStyle: 'none',
});

export const actionButtonClassName = style({
  ...typography['body-2-semibold'],
  appearance: 'none',
  display: 'inline-flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '1.6rem',
  border: 0,
  borderRadius: '1.2rem',
  padding: '0.8rem 0',
  backgroundColor: 'transparent',
  color: atomic.neutral[80],
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 130ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: atomic.neutral[10],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const actionIconClassName = style({
  display: 'inline-flex',
  width: '4rem',
  height: '4rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: `0.1rem solid ${atomic.neutral[40]}`,
  borderRadius: '999rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[80],
});

globalStyle(`${linkCopyButtonClassName} > svg`, {
  width: '2.4rem',
  height: '2.4rem',
});

globalStyle(`${actionIconClassName} > svg`, {
  width: '2rem',
  height: '2rem',
});
