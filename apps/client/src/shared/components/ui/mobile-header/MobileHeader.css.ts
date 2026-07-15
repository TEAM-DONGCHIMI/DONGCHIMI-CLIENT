import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

const sideSlotWidth = '4.8rem';

export const mobileHeaderClassName = style({
  display: 'grid',
  gridTemplateColumns: `${sideSlotWidth} minmax(0, 1fr) ${sideSlotWidth}`,
  alignItems: 'center',
  width: '100%',
  minHeight: '4.8rem',
  padding: '0.4rem 1.2rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const backButtonClassName = style({
  color: atomic.neutral[90],
});

export const titleClassName = style({
  ...typography['body-2-semibold'],
  gridColumn: 2,
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const logoClassName = style({
  gridColumn: '1 / -1',
  justifySelf: 'start',
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  width: '12rem',
  height: '3.2rem',
});
