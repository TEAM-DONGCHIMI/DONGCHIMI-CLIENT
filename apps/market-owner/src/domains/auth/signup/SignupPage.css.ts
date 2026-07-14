import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3.4rem',
  width: '71.5rem',
  maxWidth: '100%',
  minHeight: '60.2rem',
  padding: '4rem',
  backgroundColor: atomic.common[0],
});

export const headerClassName = style({
  gap: '0.2rem',
  width: '100%',
  minWidth: 0,
});

export const titleGroupClassName = style({
  gap: '1.2rem',
  width: '100%',
  minWidth: 0,
});

export const logoSlotClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '15.7rem',
  height: '6rem',
  borderRadius: '0.6rem',
  backgroundColor: atomic.common[0],
  backgroundImage: `linear-gradient(45deg, ${atomic.neutral[10]} 25%, transparent 25%),
    linear-gradient(-45deg, ${atomic.neutral[10]} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${atomic.neutral[10]} 75%),
    linear-gradient(-45deg, transparent 75%, ${atomic.neutral[10]} 75%)`,
  backgroundPosition: '0 0, 0 0.6rem, 0.6rem -0.6rem, -0.6rem 0',
  backgroundSize: '1.2rem 1.2rem',
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[60],
  textAlign: 'center',
  overflowWrap: 'anywhere',
});

export const formClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2.4rem',
  width: '63.5rem',
  maxWidth: '100%',
  minWidth: 0,
});

export const fieldGroupClassName = style({
  gap: '2.4rem',
  width: '100%',
  minWidth: 0,
});

export const submitButtonClassName = style({
  width: '100%',
});
