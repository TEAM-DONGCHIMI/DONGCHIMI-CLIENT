import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, shadow, typography } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: 1182,
  maxWidth: 'calc(100vw - 32px)',
  borderRadius: 24,
  boxShadow: shadow.normal.medium,
});

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 52,
  padding: '72px 68px 66px',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const titleClassName = style({
  ...typography['title-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const sectionClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gridTemplateColumns: '172px 1fr',
  columnGap: 70,
});

export const sectionTitleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const fieldGroupClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 8,
});

export const fieldLabelClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.neutral[90],
});

export const dateRowClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: 16,
});

export const dateDividerClassName = style({
  ...typography['title-2-semibold'],
  flexShrink: 0,
  color: atomic.neutral[70],
});

export const dateFieldClassName = style({
  width: 290,
  flexShrink: 0,
});

globalStyle(`${dateFieldClassName} label`, {
  height: 40,
  padding: '10px 16px',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  gap: 14,
});

export const footerButtonClassName = style({
  width: '16rem',
  minWidth: '16rem',
  height: 44,
});
