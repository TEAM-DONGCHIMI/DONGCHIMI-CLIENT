import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const numButton = recipe({
  base: {
    ...typography['body-2-regular'],
    appearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    padding: '0.4rem 1rem',
    borderRadius: 6,
    color: atomic.neutral[90],
    whiteSpace: 'nowrap',
    transition: 'background-color 160ms ease, color 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:hover': {
        backgroundColor: atomic.neutral[20],
      },
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
        outlineOffset: 2,
      },
    },
  },
  variants: {
    selected: {
      false: {},
      true: {
        backgroundColor: atomic.neutral[30],
        selectors: {
          '&:hover': {
            backgroundColor: atomic.neutral[30],
          },
        },
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});
