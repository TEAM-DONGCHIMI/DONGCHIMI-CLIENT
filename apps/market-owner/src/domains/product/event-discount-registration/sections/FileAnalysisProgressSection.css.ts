import { style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

export const cardClassName = style({
  width: 'min(67.2rem, 100%)',
  height: '65.4rem',
  alignSelf: 'center',
  boxSizing: 'border-box',
  gap: '3.9rem',
  marginBlock: 'auto',
  padding: '3.9rem',
  borderRadius: '2.4rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});

export const headerClassName = style({
  height: '6.4rem',
  gap: '0.8rem',
});

export const titleClassName = style({
  ...typography['heading-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
});

export const descriptionClassName = style({
  ...typography['body-3-regular'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
  textAlign: 'center',
});

export const progressStepListClassName = style({
  flexShrink: 0,
});

export const progressRowClassName = style({
  width: '100%',
  gap: '0.6rem',
});

export const progressTrackClassName = style({
  position: 'relative',
  flex: 1,
  height: '0.8rem',
  overflow: 'hidden',
  borderRadius: '7.2rem',
  backgroundColor: atomic.neutral[30],
});

export const progressFillClassName = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  borderRadius: 'inherit',
  backgroundColor: semantic.primary.normal,
});

export const progressValueClassName = style({
  ...typography['heading-3-semibold'],
  width: '5.3rem',
  flexShrink: 0,
  color: atomic.neutral[70],
  letterSpacing: 0,
  textAlign: 'right',
});

export const actionRowClassName = style({
  height: '4.3rem',
});

export const actionButtonClassName = style({
  ...typography['body-3-semibold'],
  width: '12rem',
  minWidth: '12rem',
  height: '4.4rem',
  padding: '1.2rem 2.4rem',
  letterSpacing: 0,
});
