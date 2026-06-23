import { style, styleVariants } from '@vanilla-extract/css';

export const button = style({
  display: 'inline-block',
  cursor: 'pointer',
  border: 0,
  borderRadius: '3em',
  fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontWeight: 700,
  lineHeight: 1,
});

export const tone = styleVariants({
  primary: {
    backgroundColor: '#555ab9',
    color: '#fff',
  },
  secondary: {
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0 0 0 1px inset',
    color: '#333',
  },
});

export const size = styleVariants({
  small: {
    padding: '10px 16px',
    fontSize: 12,
  },
  medium: {
    padding: '11px 20px',
    fontSize: 14,
  },
  large: {
    padding: '12px 24px',
    fontSize: 16,
  },
});
