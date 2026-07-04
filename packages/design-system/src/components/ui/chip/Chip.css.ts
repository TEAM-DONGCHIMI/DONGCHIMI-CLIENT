import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';
import chipsPointImageUrl from './assets/img-chips-point.png';

export const chip = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    maxWidth: '100%',
    borderStyle: 'solid',
    borderWidth: 0,
    whiteSpace: 'nowrap',
  },
  variants: {
    size: {
      desktop: {
        ...typography['caption-2-medium'],
        minHeight: '2.1rem',
        padding: '0.3rem 0.8rem',
        gap: '0.3rem',
      },
      mobile: {
        ...typography['caption-2-medium'],
        minHeight: '1.8rem',
        padding: '0.2rem 0.6rem',
        gap: '0.2rem',
      },
      mobileLarge: {
        ...typography['caption-2-medium'],
        minHeight: '2.5rem',
        padding: '0.5rem 1rem',
        gap: '0.2rem',
      },
      status: {
        ...typography['caption-1-medium'],
        minHeight: '3.6rem',
        padding: '0.8rem 1.4rem',
        gap: '0.6rem',
      },
      pointDesktop: {
        ...typography['caption-2-medium'],
        width: '4.5rem',
        height: '4.5rem',
        padding: '0.8rem',
      },
      pointMobile: {
        ...typography['caption-2-medium'],
        width: '4rem',
        height: '4rem',
        padding: '0.7rem',
      },
    },
    variant: {
      solid: {},
      soft: {},
      subtle: {},
      outlined: {
        borderWidth: 1,
      },
      point: {
        backgroundImage: `url(${chipsPointImageUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        color: atomic.common[0],
      },
    },
    color: {
      neutral: {},
      primary: {},
      negative: {},
      dark: {},
    },
    rounded: {
      false: {
        borderRadius: 4,
      },
      true: {
        borderRadius: 999,
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        variant: 'subtle',
      },
      style: {
        backgroundColor: atomic.neutral[10],
        color: atomic.neutral[70],
      },
    },
    {
      variants: {
        color: 'primary',
        variant: 'soft',
      },
      style: {
        backgroundColor: semantic.primary.light,
        color: semantic.primary.strong,
      },
    },
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
        color: 'negative',
        variant: 'outlined',
      },
      style: {
        borderColor: semantic.status.negativeLight,
        backgroundColor: atomic.common[0],
        color: semantic.status.negative,
      },
    },
    {
      variants: {
        color: 'dark',
        variant: 'solid',
      },
      style: {
        backgroundColor: atomic.neutral[80],
        color: atomic.common[0],
      },
    },
  ],
  defaultVariants: {
    color: 'neutral',
    rounded: true,
    size: 'desktop',
    variant: 'subtle',
  },
});

export const chipIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.2rem',
  height: '1.2rem',
  lineHeight: 0,
});

export const chipText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
