import { style } from '@vanilla-extract/css';

export const addressSectionClassName = style({
  gap: '0.8rem',
});

export const addressRowClassName = style({
  display: 'flex',
  alignItems: 'flex-end',
  alignSelf: 'stretch',
  gap: '0.8rem',
});

export const addressInputSlotClassName = style({
  flex: '1 1 auto',
  minWidth: 0,
});

export const addressButtonClassName = style({
  marginBottom: '0.2rem',
  width: '11.8rem',
  minWidth: '11.8rem',
  paddingInline: 0,
});
