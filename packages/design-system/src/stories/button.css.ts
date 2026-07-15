import { style, styleVariants } from '@vanilla-extract/css';

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100%',
  minWidth: 0,
  minHeight: 44,
  overflow: 'hidden',
  cursor: 'pointer',
  border: 0,
  borderRadius: '3em',
  fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontWeight: 700,
  lineHeight: 1,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition:
    'background-color 160ms ease, box-shadow 160ms ease, color 160ms ease, opacity 160ms ease',
  selectors: {
    '&:focus-visible': {
      outline: '3px solid rgba(85, 90, 185, 0.35)',
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
  },
  '@media': {
    '(max-width: 480px)': {
      width: '100%',
    },
  },
});

export const tone = styleVariants({
  primary: {
    backgroundColor: '#555ab9',
    color: '#fff',
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: '#4449a4',
      },
      '&:disabled': {
        backgroundColor: '#a5a7d8',
      },
      '&[data-state="error"], &[data-state="invalid"]': {
        backgroundColor: '#b3261e',
      },
      '&[data-state="loading"]': {
        backgroundColor: '#6f73c6',
      },
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0 0 0 1px inset',
    color: '#333',
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: '#f4f4f8',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0 0 0 1px inset',
      },
      '&:disabled': {
        boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 0 1px inset',
        color: '#777',
      },
      '&[data-state="error"], &[data-state="invalid"]': {
        boxShadow: '#b3261e 0 0 0 1px inset',
        color: '#b3261e',
      },
      '&[data-state="loading"]': {
        backgroundColor: '#f4f4f8',
      },
    },
  },
});

export const size = styleVariants({
  small: {
    padding: '10px 16px',
    fontSize: 12,
    '@media': {
      '(max-width: 480px)': {
        padding: '10px 14px',
      },
    },
  },
  medium: {
    padding: '11px 20px',
    fontSize: 14,
    '@media': {
      '(max-width: 480px)': {
        padding: '11px 16px',
      },
    },
  },
  large: {
    padding: '12px 24px',
    fontSize: 16,
    '@media': {
      '(max-width: 480px)': {
        padding: '12px 18px',
        fontSize: 15,
      },
    },
  },
});
