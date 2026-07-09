import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const headerClassName = style({
  width: '100%',
  minWidth: 0,
  minHeight: '6.4rem',
  padding: '0 4rem',
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

export const logoHeaderClassName = style([
  headerClassName,
  {
    height: '6.4rem',
    gap: '1rem',
    padding: '0 2.4rem',
  },
]);

export const logoSlotClassName = style({
  display: 'inline-flex',
  width: '9.2rem',
  height: '3.2rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const logoBreadcrumbClassName = style([
  breadcrumbClassName,
  {
    height: '6.4rem',
    padding: '0 4rem',
  },
]);

export const logoSearchSlotClassName = style({
  marginLeft: 'auto',
});
