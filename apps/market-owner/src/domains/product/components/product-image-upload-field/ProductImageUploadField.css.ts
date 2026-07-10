import { style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  variants: {
    variant: {
      editModal: {
        gap: 12,
      },
      registration: {
        gap: '0.9rem',
      },
    },
  },
});

export const textGroupClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const labelRecipe = recipe({
  base: {
    color: atomic.neutral[90],
  },
  variants: {
    variant: {
      editModal: {
        ...typography['body-3-semibold'],
      },
      registration: {
        ...typography['body-3-medium'],
        color: atomic.neutral[70],
      },
    },
  },
});

export const descriptionClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: atomic.neutral[50],
});

export const imageBoxRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: 12,
    color: atomic.neutral[60],
    backgroundColor: atomic.neutral[20],
  },
  variants: {
    variant: {
      editModal: {
        width: 120,
        height: 120,
        backgroundImage:
          'linear-gradient(45deg, #e2e5e8 25%, transparent 25%), linear-gradient(-45deg, #e2e5e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e5e8 75%), linear-gradient(-45deg, transparent 75%, #e2e5e8 75%)',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
        backgroundSize: '20px 20px',
        backgroundColor: atomic.neutral[10],
      },
      registration: {
        width: '11.2rem',
        height: '11.2rem',
        border: `1px dashed ${atomic.neutral[40]}`,
        cursor: 'pointer',
        transition: 'border-color 160ms ease, outline-color 160ms ease',
        selectors: {
          '&:focus-within': {
            outline: `0.3rem solid ${focusOutlineColor}`,
            outlineOffset: '0.2rem',
          },
        },
      },
    },
  },
});

export const imageBoxPreviewRecipe = recipe({
  variants: {
    variant: {
      editModal: {},
      registration: {
        border: 0,
        selectors: {
          '&::after': {
            position: 'absolute',
            inset: 0,
            content: '',
            background: `linear-gradient(0deg, ${semantic.status.dimmer.hover} 0%, ${semantic.status.dimmer.hover} 100%)`,
          },
        },
      },
    },
  },
});

export const emptyContentClassName = style({
  ...typography['body-3-medium'],
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.6rem',
  textAlign: 'center',
});

export const emptyIconClassName = style({
  width: '2.4rem',
  height: '2.4rem',
});

export const previewContentClassName = style({
  width: '100%',
  height: '100%',
});

export const previewImageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const cameraBadgeRecipe = recipe({
  base: {
    position: 'absolute',
    zIndex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderRadius: '10rem',
    backgroundColor: atomic.common[0],
    color: atomic.common[100],
  },
  variants: {
    variant: {
      editModal: {
        top: 10,
        right: 10,
        width: 38,
        height: 38,
        boxShadow: shadow.normal.small,
        fontSize: 20,
      },
      registration: {
        top: '0.7rem',
        right: '0.7rem',
        width: '4rem',
        height: '4rem',
        border: `1px solid ${atomic.neutral[40]}`,
        fontSize: '2rem',
      },
    },
  },
});

export const fileInputClassName = style({
  position: 'absolute',
  width: '0.1rem',
  height: '0.1rem',
  margin: '-0.1rem',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
