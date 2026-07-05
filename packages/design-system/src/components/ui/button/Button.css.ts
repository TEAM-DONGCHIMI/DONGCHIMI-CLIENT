import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const button = recipe({
  base: {
    appearance: 'none',
    display: 'inline-flex',
    flexShrink: 0,
    justifySelf: 'start',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 0,
    maxWidth: '100%',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap',
    borderRadius: 8,
    gap: '0.4rem',
    transition:
      'background-color 160ms ease, border-color 160ms ease, color 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
        outlineOffset: 2,
      },
      '&:disabled': {
        borderColor: atomic.neutral[30],
        backgroundColor: atomic.neutral[30],
        color: atomic.common[0],
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      large: {
        ...typography['heading-3-semibold'],
        minWidth: '20rem',
        height: '6rem',
        padding: '1.6rem 7.4rem',
      },
      medium: {
        ...typography['body-2-semibold'],
        minWidth: '19.8rem',
        height: '5.4rem',
        padding: '1.6rem 7.6rem',
      },
      small: {
        ...typography['body-3-semibold'],
        minWidth: '19.2rem',
        height: '4.4rem',
        padding: '1.2rem 7.8rem',
      },
      xsmall: {
        ...typography['caption-1-medium'],
        minWidth: '15.1rem',
        height: '3.3rem',
        padding: '1rem 6rem',
      },
      mobile: {
        ...typography['caption-1-medium'],
        minWidth: '18.7rem',
        height: '3.5rem',
        padding: '1.2rem 7.8rem',
      },
    },
    variant: {
      solid: {},
      outlined: {
        borderWidth: 1,
      },
      soft: {
        borderWidth: 1,
      },
    },
    color: {
      primary: {},
      assistive: {},
      assistiveLight: {},
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
        backgroundColor: atomic.neutral[80],
        color: atomic.common[0],
      },
    },
    {
      variants: {
        color: 'negative',
        variant: 'solid',
      },
      style: {
        borderColor: semantic.status.negativeLight,
        backgroundColor: semantic.status.negativeLight,
        color: atomic.common[0],
      },
    },
    {
      variants: {
        color: 'primary',
        variant: 'soft',
      },
      style: {
        borderColor: semantic.primary.normal,
        backgroundColor: semantic.primary.light,
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
        backgroundColor: atomic.common[0],
        color: atomic.neutral[90],
      },
    },
    {
      variants: {
        color: 'assistiveLight',
        variant: 'outlined',
      },
      style: {
        borderColor: atomic.neutral[20],
        backgroundColor: atomic.common[0],
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
        backgroundColor: atomic.common[0],
        color: semantic.status.negative,
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'small',
    variant: 'solid',
  },
});

export const buttonIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.13rem',
  pointerEvents: 'none',
  width: 16,
  height: 16,
});
