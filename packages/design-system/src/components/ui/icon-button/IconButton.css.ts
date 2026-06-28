import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';

export const iconButton = recipe({
  base: {
    appearance: 'none',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'opacity 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:focus-visible': {
        outline: '3px solid rgba(21, 196, 126, 0.34)',
        outlineOffset: 2,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  },
  variants: {
    size: {
      large: {
        width: 40,
        height: 40,
        padding: 10,
      },
    },
    variant: {
      solid: {},
      outlined: {},
    },
    color: {
      primary: {},
      assistive: {},
      negative: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'primary',
        variant: 'solid',
      },
      style: {
        borderColor: '#15C47E',
        backgroundColor: '#15C47E',
        color: '#FFFFFF',
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'solid',
      },
      style: {
        borderColor: '#B0B8C1',
        backgroundColor: '#F2F4F6',
        color: '#171719',
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'solid',
      },
      style: {
        borderColor: '#FF4242',
        backgroundColor: '#FF4242',
        color: '#FFFFFF',
      },
    },
    {
      variants: {
        color: 'primary',
        variant: 'outlined',
      },
      style: {
        borderColor: '#15C47E',
        color: '#15C47E',
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'outlined',
      },
      style: {
        borderColor: '#B0B8C1',
        color: '#171719',
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'outlined',
      },
      style: {
        borderColor: '#FF6362',
        color: '#FF4242',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'large',
    variant: 'solid',
  },
});

export const iconButtonIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  fontSize: 20,
  lineHeight: 0,
  pointerEvents: 'none',
});
