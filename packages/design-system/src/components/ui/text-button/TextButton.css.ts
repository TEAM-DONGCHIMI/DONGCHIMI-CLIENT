import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const textButton = recipe({
  base: {
    ...typography['body-2-regular'],
    appearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3rem',
    padding: '0.4rem 1rem',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: atomic.neutral[90],
    whiteSpace: 'nowrap',
    transition: 'color 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
        outlineOffset: 2,
      },
      '&:disabled': {
        color: atomic.neutral[30],
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    tone: {
      default: {},
      negative: {
        color: semantic.status.negative,
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});
