import { recipe } from '../../../styles/recipe';
import { atomic, semantic } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

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
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    transition:
      'background-color 160ms ease, border-color 160ms ease, color 160ms ease, opacity 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
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
        backgroundColor: atomic.common[0],
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
    rounded: {
      false: {
        borderRadius: 12,
      },
      true: {
        borderRadius: 100,
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'primary',
        variant: 'solid',
      },
      style: {
        backgroundColor: semantic.primary.normal,
        color: atomic.common[0],
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'solid',
      },
      style: {
        backgroundColor: atomic.neutral[10],
        color: atomic.neutral[90],
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'solid',
      },
      style: {
        backgroundColor: semantic.status.negative,
        color: atomic.common[0],
      },
    },
    {
      variants: {
        color: 'primary',
        variant: 'outlined',
      },
      style: {
        borderColor: semantic.primary.normal,
        color: semantic.primary.normal,
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'outlined',
      },
      style: {
        borderColor: atomic.neutral[40],
        color: atomic.neutral[90],
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'outlined',
      },
      style: {
        borderColor: semantic.status.negativeLight,
        color: semantic.status.negative,
      },
    },
    {
      variants: {
        color: 'primary',
        variant: 'ghost',
      },
      style: {
        color: semantic.primary.normal,
      },
    },
    {
      variants: {
        color: 'assistive',
        variant: 'ghost',
      },
      style: {
        color: atomic.neutral[90],
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'ghost',
      },
      style: {
        color: semantic.status.negative,
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    rounded: false,
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
