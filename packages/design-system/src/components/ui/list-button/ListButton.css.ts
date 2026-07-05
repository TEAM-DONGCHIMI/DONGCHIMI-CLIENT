import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const listButton = recipe({
  base: {
    ...typography['body-2-regular'],
    appearance: 'none',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '16.6rem',
    height: '4rem',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: atomic.neutral[90],
    whiteSpace: 'nowrap',
    transition: 'background-color 160ms ease, color 160ms ease, outline-color 160ms ease',
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        insetBlock: 0,
        insetInline: '-1.2rem',
        zIndex: 0,
        borderRadius: 8,
        pointerEvents: 'none',
      },
      '&:not(:disabled):hover::before': {
        backgroundColor: atomic.neutral[10],
      },
      '&:disabled': {
        cursor: 'not-allowed',
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
      true: {},
    },
    hasLeadingVisual: {
      false: {},
      true: {
        justifyContent: 'flex-start',
        gap: '0.4rem',
      },
    },
    color: {
      assistive: {},
      primary: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'assistive',
        hasLeadingVisual: false,
        selected: true,
      },
      style: {
        color: atomic.neutral[90],
        selectors: {
          '&::before': {
            backgroundColor: atomic.neutral[10],
          },
          '&:hover::before': {
            backgroundColor: atomic.neutral[10],
          },
        },
      },
    },
    {
      variants: {
        color: 'primary',
        hasLeadingVisual: false,
        selected: true,
      },
      style: {
        color: semantic.primary.strong,
        selectors: {
          '&::before': {
            backgroundColor: semantic.primary.light,
          },
          '&:hover::before': {
            backgroundColor: semantic.primary.light,
          },
        },
      },
    },
  ],
  defaultVariants: {
    color: 'assistive',
    hasLeadingVisual: false,
    selected: false,
  },
});

export const listButtonIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  width: 24,
  height: 24,
  padding: 2,
  pointerEvents: 'none',
});

export const listButtonCheckbox = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    borderRadius: 4,
    borderStyle: 'solid',
  },
  variants: {
    checked: {
      false: {
        borderWidth: 1.5,
        borderColor: atomic.neutral[70],
        backgroundColor: 'transparent',
      },
      true: {
        borderWidth: 1,
        borderColor: semantic.primary.normal,
        backgroundColor: semantic.primary.normal,
        color: atomic.common[0],
      },
    },
    disabled: {
      false: {},
      true: {},
    },
  },
  compoundVariants: [
    {
      variants: { checked: false, disabled: true },
      style: {
        borderColor: atomic.neutral[40],
      },
    },
    {
      variants: { checked: true, disabled: true },
      style: {
        backgroundColor: atomic.neutral[40],
        borderColor: atomic.neutral[40],
      },
    },
  ],
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

export const listButtonCheckIcon = style({
  display: 'block',
  width: '100%',
  height: '100%',
});

export const listButtonLabel = style({
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  zIndex: 1,
});
