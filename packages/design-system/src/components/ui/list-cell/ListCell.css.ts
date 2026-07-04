import { globalStyle, style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  minHeight: 98,
  borderRight: `1px solid ${atomic.neutral[30]}`,
  borderBottom: `1px solid ${atomic.neutral[30]}`,
  borderLeft: `1px solid ${atomic.neutral[30]}`,
  padding: '0 2rem',
  overflowX: 'auto',
  backgroundColor: atomic.common[0],
  scrollbarWidth: 'thin',
});

export const rowClassName = style({
  display: 'flex',
  width: 'max-content',
  minWidth: '100%',
  minHeight: 98,
  alignItems: 'center',
  gap: '4.2rem',
});

export const leadingClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '2.1rem',
});

export const checkboxClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  flexShrink: 0,
  boxSizing: 'border-box',
  width: 18,
  height: 18,
  margin: 3,
  border: `1.5px dashed ${atomic.neutral[5]}`,
  borderRadius: 4,
  backgroundColor: atomic.common[0],
  cursor: 'pointer',
  transition: 'background-color 160ms ease, border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:checked': {
      borderColor: semantic.primary.normal,
      backgroundColor: semantic.primary.normal,
      boxShadow: `inset 0 0 0 4px ${atomic.common[0]}`,
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
  },
});

export const mediaFrameClassName = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: 64,
    height: 64,
    overflow: 'hidden',
    borderRadius: 8,
  },
  variants: {
    status: {
      default: {
        backgroundColor: atomic.neutral[20],
      },
      error: {
        border: `2px dashed ${semantic.status.negativeLight}`,
        backgroundColor: atomic.common[0],
      },
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

export const mediaContentClassName = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

globalStyle(`${mediaContentClassName} > img`, {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const mediaActionClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  width: '100%',
  height: '100%',
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: semantic.status.negative,
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: -3,
    },
  },
});

export const mediaActionButtonClassName = style({
  cursor: 'pointer',
});

export const mediaActionIconClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  fontSize: 24,
  lineHeight: 1,
});

export const mediaActionLabelClassName = style({
  ...typography['caption-2-light'],
  whiteSpace: 'nowrap',
});

export const fieldsClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '3rem',
});

export const fieldClassName = style({
  ...typography['caption-1-medium'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  width: 'var(--list-cell-field-width, 16rem)',
  height: 32,
  minWidth: 0,
  gap: 8,
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: 4,
  padding: '0.6rem 1.2rem',
  overflow: 'hidden',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  textAlign: 'left',
  transition: 'border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:is(button)': {
      cursor: 'pointer',
    },
    '&:is(button):hover': {
      borderColor: atomic.neutral[40],
    },
    '&:is(button):focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
  },
});

export const fieldTextClassName = recipe({
  base: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      placeholder: {
        color: atomic.neutral[60],
      },
      value: {
        color: atomic.neutral[90],
      },
    },
  },
  defaultVariants: {
    tone: 'value',
  },
});

export const fieldTrailingIconClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  color: atomic.neutral[90],
  lineHeight: 0,
});

globalStyle(`${fieldTrailingIconClassName} > svg`, {
  width: 16,
  height: 16,
});

export const statusColumnClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
  minWidth: 0,
});

export const statusBadgeClassName = recipe({
  base: {
    ...typography['caption-1-medium'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 21,
    borderRadius: 4,
    padding: '0.2rem 0.8rem',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      neutral: {
        backgroundColor: atomic.neutral[10],
        color: atomic.neutral[70],
      },
      negative: {
        backgroundColor: semantic.status.negative,
        color: atomic.common[0],
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
});

export const helperClassName = style({
  ...typography['caption-2-regular'],
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  minWidth: 0,
  padding: '0.3rem 0',
  color: atomic.neutral[60],
});

export const helperIconClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 12,
  height: 12,
  lineHeight: 0,
});

globalStyle(`${helperIconClassName} > svg`, {
  width: 12,
  height: 12,
});

export const helperTextClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
