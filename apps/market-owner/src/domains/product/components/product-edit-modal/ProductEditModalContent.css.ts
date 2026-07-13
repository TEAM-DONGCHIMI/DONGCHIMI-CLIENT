import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, shadow, typography } from '@dongchimi/design-system/tokens';

export const editModalFieldWidth = '31.9rem';

export const contentClassName = style({
  boxSizing: 'border-box',
  width: '100.8rem',
  maxWidth: 'calc(100vw - 3.2rem)',
  maxHeight: 'calc(100dvh - 4.8rem)',
  padding: '5.6rem 5.9rem',
  borderRadius: '2.4rem',
  boxShadow: shadow.normal.medium,
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  '@media': {
    '(max-width: 1180px)': {
      padding: '4.8rem 4rem',
    },
  },
});

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '4rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
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
  gap: '0.8rem',
});

export const fieldLabelClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.neutral[70],
});

export const dateDividerClassName = style({
  ...typography['heading-1-semibold'],
  flexShrink: 0,
  color: atomic.neutral[40],
});

export const dateRangeClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gridTemplateColumns: 'minmax(0, 1fr) max-content minmax(0, 1fr)',
  columnGap: '1.4rem',
});

export const dateFieldLabelClassName = style({});

globalStyle(`${dateFieldLabelClassName} label`, {
  height: '4rem',
  padding: '1rem 1.6rem',
});

export const periodToggleButtonClassName = style({
  flexShrink: 0,
  width: '13.5rem',
  minWidth: '13.5rem',
  height: '4rem',
  borderRadius: '2rem',
  padding: '1rem 2rem',
  backgroundColor: atomic.common[0],
  transition: 'none',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  justifyContent: 'flex-end',
  gap: '1.4rem',
});

export const footerButtonClassName = style({
  width: '16rem',
  minWidth: '16rem',
  height: '4.4rem',
});
