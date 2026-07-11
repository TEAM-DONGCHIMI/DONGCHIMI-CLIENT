import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const emptySectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.8rem',
  paddingTop: '9.2rem',
});

export const emptyImageClassName = style({
  width: '18.3rem',
  height: '18.3rem',
  objectFit: 'cover',
});

export const emptyContentClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.4rem',
});

export const emptyTextBlockClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const emptyTitleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[80],
});

export const emptyDescriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  paddingTop: '0.4rem',
  color: atomic.neutral[50],
});

export const registrationButtonClassName = style({
  width: '19.2rem',
  minWidth: '19.2rem',
  paddingRight: 0,
  paddingLeft: 0,
});
