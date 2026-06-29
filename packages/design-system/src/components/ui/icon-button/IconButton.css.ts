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
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    transition:
      'background-color 160ms ease, border-color 160ms ease, color 160ms ease, opacity 160ms ease, outline-color 160ms ease',
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
      },
    },
    variant: {
      ghost: {
        padding: 8,
      },
      outlined: {
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
      },
      solid: {
        padding: 10,
      },
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
    {
      variants: {
        color: 'primary',
        variant: 'ghost',
      },
      style: {
        color: '#15C47E',
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'ghost',
      },
      style: {
        color: '#171719',
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'ghost',
      },
      style: {
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

export const iconButtonIcon = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    pointerEvents: 'none',
  },
  variants: {
    variant: {
      ghost: {
        width: 24,
        height: 24,
        fontSize: 24,
      },
      outlined: {
        width: 20,
        height: 20,
        fontSize: 20,
      },
      solid: {
        width: 20,
        height: 20,
        fontSize: 20,
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});
