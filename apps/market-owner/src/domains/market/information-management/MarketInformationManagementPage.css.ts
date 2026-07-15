import { style } from '@vanilla-extract/css';

export const actionButtonClassName = style({
  width: '19.4rem',
  minWidth: 0,
});

export const actionAreaClassName = style({
  right: 'max(2.4rem, calc((100vw - 115.6rem) / 2))',
  bottom: '9.9rem',
  left: 'auto',
  padding: 0,
  gap: '1.4rem',
});
