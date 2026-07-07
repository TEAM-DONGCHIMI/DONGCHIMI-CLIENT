import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const inlineFieldClassName = style({
  display: 'grid',
  gridTemplateColumns: 'max-content minmax(0, 1fr)',
  gap: '1.2rem',
  alignItems: 'start',
});

export const inlineLabelClassName = style({
  display: 'inline-flex',
  minHeight: '4.8rem',
  alignItems: 'center',
  gap: '0.4rem',
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
  ...typography['body-3-semibold'],
});

export const phoneLabelClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const requiredLabelGroupClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
});

export const addableFieldClassName = style({
  minWidth: 0,
});

export const marketPhoneRowsClassName = style({
  display: 'grid',
  minHeight: '10.8rem',
  alignContent: 'start',
  gap: '1.2rem',
});

export const textIconFieldClassName = style({
  display: 'flex',
  height: '4.8rem',
  alignItems: 'center',
  gap: '0.8rem',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.8rem',
  padding: '1.2rem',
  backgroundColor: atomic.common[0],
  selectors: {
    '&:focus-within': {
      borderColor: atomic.neutral[80],
    },
  },
});

export const textIconFieldErrorClassName = style({
  borderColor: semantic.status.negativeLight,
  selectors: {
    '&:focus-within': {
      borderColor: semantic.status.negativeLight,
    },
  },
});

export const ownerPhoneRowsClassName = style({
  display: 'grid',
  minWidth: 0,
  gap: '1.2rem',
});

export const ownerPhoneErrorMessageClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.4rem',
  color: semantic.status.negative,
  ...typography['caption-1-medium'],
});

export const errorIconClassName = style({
  width: '1.6rem',
  height: '1.6rem',
  flexShrink: 0,
});

export const textIconInputClassName = style({
  appearance: 'none',
  width: '100%',
  minWidth: 0,
  border: 0,
  padding: 0,
  outline: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  ...typography['body-3-medium'],
  selectors: {
    '&::placeholder': {
      color: atomic.neutral[60],
      opacity: 1,
    },
  },
});

export const textIconActionButtonClassName = style({
  display: 'inline-flex',
  width: '2rem',
  height: '2rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[60],
  cursor: 'pointer',
  lineHeight: 0,
});

export const textIconActionIconClassName = style({
  width: '2rem',
  height: '2rem',
});

export const inputIconClassName = style({
  width: '2rem',
  height: '2rem',
  flexShrink: 0,
  color: atomic.neutral[60],
});
