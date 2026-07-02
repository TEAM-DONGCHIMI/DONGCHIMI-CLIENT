import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const pillButton = recipe({
  base: {
    appearance: 'none',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 0,
    whiteSpace: 'nowrap',
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
    platform: {
      desktop: {
        height: 40,
        paddingInline: 20,
        gap: 4,
        ...typography['body-3-semibold'],
      },
      mobile: {
        height: 30,
        paddingInline: 14,
        gap: 2,
        ...typography['caption-1-medium'],
      },
    },
    variant: {
      'outlined-light': {
        borderWidth: 1,
        backgroundColor: atomic.common[0],
        borderColor: atomic.neutral[20],
      },
      outlined: {
        borderWidth: 1,
        backgroundColor: atomic.common[0],
        borderColor: atomic.neutral[40],
      },
      filled: {},
    },
  },
  compoundVariants: [
    {
      variants: { platform: 'desktop', variant: 'outlined-light' },
      style: { color: atomic.neutral[90] },
    },
    {
      variants: { platform: 'desktop', variant: 'outlined' },
      style: { color: atomic.neutral[90] },
    },
    {
      variants: { platform: 'desktop', variant: 'filled' },
      style: { backgroundColor: atomic.common[100], color: atomic.common[0] },
    },
    {
      variants: { platform: 'mobile', variant: 'outlined-light' },
      style: { color: atomic.neutral[80] },
    },
    // mobile + outlined는 타입에서 막지만, 런타임 우회 시 텍스트색이 비지 않도록 fallback을 둡니다.
    {
      variants: { platform: 'mobile', variant: 'outlined' },
      style: { color: atomic.neutral[80] },
    },
    {
      variants: { platform: 'mobile', variant: 'filled' },
      style: { backgroundColor: semantic.primary.normal, color: atomic.common[0] },
    },
  ],
  defaultVariants: {
    platform: 'desktop',
    variant: 'outlined-light',
  },
});

export const pillButtonIcon = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    pointerEvents: 'none',
  },
  variants: {
    platform: {
      desktop: {
        width: 16,
        height: 16,
        fontSize: 16,
      },
      mobile: {
        width: 12,
        height: 12,
        fontSize: 12,
      },
    },
  },
  defaultVariants: {
    platform: 'desktop',
  },
});
