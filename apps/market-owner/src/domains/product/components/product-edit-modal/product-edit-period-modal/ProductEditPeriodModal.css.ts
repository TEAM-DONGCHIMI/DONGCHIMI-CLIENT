import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

import * as Content from '../ProductEditModalContent.css';

export const contentClassName = Content.contentClassName;

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '5.2rem',
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
  gridTemplateColumns: '17.2rem 1fr',
  columnGap: '7rem',
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
  color: atomic.neutral[90],
});

export const dateRowClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '1.6rem',
});

export const dateDividerClassName = style({
  ...typography['title-2-semibold'],
  flexShrink: 0,
  color: atomic.neutral[70],
});

export const dateFieldClassName = style({
  flex: '1 1 0',
  minWidth: 0,
});

globalStyle(`${dateFieldClassName} label`, {
  height: '4rem',
  padding: '1rem 1.6rem',
});

export const periodToggleButtonClassName = style({
  flexShrink: 0,
  width: '13.7rem',
  minWidth: '13.7rem',
  height: '4rem',
  borderRadius: '10rem',
  paddingRight: '1.6rem',
  paddingLeft: '1.6rem',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  gap: '1.4rem',
});

export const footerButtonClassName = style({
  width: '16rem',
  minWidth: '16rem',
  height: '4.4rem',
});
