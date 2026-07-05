import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: '76.8rem',
  maxWidth: 'calc(100vw - 3.2rem)',
  borderRadius: '2.4rem',
  boxShadow: 'none',
});

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3.6rem',
  padding: '3rem 4rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const mainClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
});

export const titleClassName = style({
  display: 'flex',
  width: '22.8rem',
  minHeight: '6.6rem',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  overflowWrap: 'anywhere',
  ...typography['title-2-semibold'],
  color: atomic.neutral[90],
});

export const bodyRecipe = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '68.8rem',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: '18.9rem',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2rem',
    padding: '4rem 2rem',
    backgroundColor: atomic.neutral[10],
  },
  variants: {
    state: {
      default: {
        gap: '2rem',
      },
      upload: {
        gap: '1rem',
      },
      error: {
        gap: '2rem',
      },
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export const textGroupClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '1rem',
});

export const descriptionClassName = style({
  ...typography['body-3-semibold'],
  width: '100%',
  margin: 0,
  overflowWrap: 'anywhere',
  color: atomic.neutral[50],
  textAlign: 'center',
});

export const labelRecipe = recipe({
  base: {
    ...typography['body-1-medium'],
    width: '100%',
    margin: 0,
    overflowWrap: 'anywhere',
    textAlign: 'center',
  },
  variants: {
    state: {
      default: {
        color: atomic.neutral[70],
      },
      upload: {
        color: atomic.neutral[70],
      },
      error: {
        color: semantic.status.negativeLight,
      },
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export const fileInputClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const fileSelectButtonClassName = style({
  boxSizing: 'border-box',
  width: '13.4rem',
  minWidth: '13.4rem',
  padding: '1.2rem 1.6rem',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.4rem',
});

export const footerButtonClassName = style({
  boxSizing: 'border-box',
  width: '20rem',
  padding: '1.6rem 7.4rem',
});
