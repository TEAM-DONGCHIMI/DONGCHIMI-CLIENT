import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const cardClassName = style({
  boxSizing: 'border-box',
  padding: '3.2rem',
  borderRadius: '2rem',
  backgroundColor: atomic.common[0],
});

export const headerClassName = style({
  rowGap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const descriptionClassName = style({
  ...typography['body-2-medium'],
  margin: 0,
  color: atomic.neutral[50],
  letterSpacing: 0,
});

export const linkFieldClassName = style({
  gap: '1.2rem',
  boxSizing: 'border-box',
  margin: '1.8rem 0 0.8rem 0',
  padding: '1.4rem 1.6rem',
  borderRadius: '1.2rem',
  backgroundColor: semantic.primary.light,
});

export const linkTextClassName = style({
  ...typography['body-3-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[60],
  letterSpacing: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const linkCopyIconClassName = style({
  flexShrink: 0,
  width: '2rem',
  height: '2rem',
});

export const actionListClassName = style({
  gap: '0.2rem',
  marginBottom: '1.2rem',
});

export const actionItemClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  minHeight: '4.8rem',
  alignItems: 'center',
  gap: '1.6rem',
  padding: '0.8rem 0',
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:disabled': {
      cursor: 'wait',
      opacity: 0.6,
    },
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`,
      outlineOffset: '0.2rem',
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
  border: `0.1rem solid ${atomic.neutral[30]}`,
  borderRadius: '999rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[80],
});

export const actionSvgClassName = style({
  width: '2rem',
  height: '2rem',
});

export const actionTextClassName = style({
  ...typography['body-2-semibold'],
  color: atomic.neutral[80],
  letterSpacing: 0,
});
