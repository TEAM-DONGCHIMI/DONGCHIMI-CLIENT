import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const headerClassName = style({
  width: '100%',
  minWidth: 0,
  minHeight: '6.4rem',
  padding: '0 4rem',
  backgroundColor: atomic.common[0],
});

export const breadcrumbClassName = style({
  minWidth: 0,
  gap: '1.6rem',
  minHeight: '2rem',
});

export const parentLabelClassName = style({
  ...typography['body-3-medium'],
  overflow: 'hidden',
  color: atomic.neutral[50],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const separatorClassName = style({
  ...typography['body-3-regular'],
  flexShrink: 0,
  color: atomic.neutral[40],
});

export const currentLabelClassName = style({
  ...typography['body-3-semibold'],
  flexShrink: 0,
  color: atomic.neutral[80],
  whiteSpace: 'nowrap',
});

export const homeLabelClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.neutral[80],
  whiteSpace: 'nowrap',
});

export const searchIconClassName = style({
  display: 'block',
  width: '1.6rem',
  height: '1.6rem',
  border: `0.15rem dashed ${atomic.neutral[90]}`,
  borderRadius: '0.4rem',
});
