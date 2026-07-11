import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

import chipPointImageUrl from './assets/img-chip-point.webp';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;
const PRODUCT_IMAGE_SIZE = '5.6rem';
const PRODUCT_ITEM_HEIGHT = PRODUCT_IMAGE_SIZE;
const PRODUCT_CONTENT_GAP = '1.7rem';
const PRODUCT_BADGE_SIZE = '4.5rem';
const PRODUCT_MEDIA_COLUMNS = `${PRODUCT_IMAGE_SIZE} minmax(0, 1fr)`;

export const cardClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  color: atomic.neutral[90],
});

export const cardSurfaceClassNames = styleVariants({
  elevated: {
    borderRadius: 20,
    padding: '2rem 2rem 1rem',
    backgroundColor: atomic.common[0],
    boxShadow: shadow.normal.small,
  },
  flat: {
    borderRadius: 12,
    padding: '1.8rem 1.8rem 1rem',
    backgroundColor: atomic.neutral[5],
  },
});

export const contentClassName = style({
  display: 'flex',
  flexGrow: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.6rem',
});

export const bodyClassName = style({
  display: 'flex',
  flexShrink: 0,
  minWidth: 0,
  flexDirection: 'column',
  gap: '1.8rem',
});

export const headerClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.2rem',
});

export const titleClassName = style({
  ...typography['body-1-semibold'],
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const countClassName = style({
  ...typography['body-3-medium'],
  flexShrink: 0,
  color: atomic.neutral[60],
});

export const listClassName = style({
  width: '100%',
});

export const productItemClassName = style({
  height: PRODUCT_ITEM_HEIGHT,
  minWidth: 0,
});

export const productItemLayoutClassName = style({
  boxSizing: 'border-box',
  display: 'grid',
  height: '100%',
  width: '100%',
  minWidth: 0,
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: '1.2rem',
});

export const productMainClassName = style({
  display: 'grid',
  height: '100%',
  minWidth: 0,
  gridTemplateColumns: PRODUCT_MEDIA_COLUMNS,
  alignItems: 'center',
  gap: PRODUCT_CONTENT_GAP,
});

export const productMainWithRankClassName = style({
  gridTemplateColumns: '2.8rem minmax(0, 1fr)',
  gap: '0.4rem',
});

export const productContentWithRankClassName = style({
  display: 'grid',
  minWidth: 0,
  gridTemplateColumns: PRODUCT_MEDIA_COLUMNS,
  alignItems: 'center',
  gap: PRODUCT_CONTENT_GAP,
});

export const rankClassName = style({
  ...typography['body-2-semibold'],
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: '1rem',
  color: atomic.neutral[90],
});

export const imageFrameClassName = style({
  position: 'relative',
  width: PRODUCT_IMAGE_SIZE,
  height: PRODUCT_IMAGE_SIZE,
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: 8,
  backgroundColor: atomic.neutral[10],
});

export const imageClassName = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const imagePlaceholderClassName = style({
  width: '100%',
  height: '100%',
  backgroundColor: atomic.neutral[10],
  backgroundImage:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.64) 25%, transparent 25%), linear-gradient(-45deg, rgba(255, 255, 255, 0.64) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.64) 75%), linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.64) 75%)',
  backgroundPosition: '0 0, 0 0.6rem, 0.6rem -0.6rem, -0.6rem 0',
  backgroundSize: '1.2rem 1.2rem',
});

export const infoClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const productNameClassName = style({
  ...typography['body-3-medium'],
  width: '100%',
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const priceRowClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.6rem',
});

export const currentPriceClassName = style({
  ...typography['body-2-semibold'],
  flexShrink: 0,
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
});

export const originalPriceClassName = style({
  ...typography['body-3-medium'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[40],
  textDecoration: 'line-through',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const badgeClassName = style({
  ...typography['caption-2-medium'],
  display: 'inline-flex',
  width: PRODUCT_BADGE_SIZE,
  height: PRODUCT_BADGE_SIZE,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${chipPointImageUrl})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  color: atomic.neutral[5],
  whiteSpace: 'nowrap',
});

export const itemButtonClassName = style({
  height: '100%',
  width: '100%',
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:focus-visible': {
      borderRadius: 10,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 4,
    },
  },
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  minHeight: '4.8rem',
  marginTop: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.2rem',
});

export const toggleButtonClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  border: 0,
  borderRadius: 12,
  padding: '0.4rem 0.8rem',
  backgroundColor: 'transparent',
  color: semantic.primary.strong,
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const toggleIconClassName = style({
  width: '0.8rem',
  height: '0.8rem',
  borderRight: `2px solid ${semantic.primary.strong}`,
  borderBottom: `2px solid ${semantic.primary.strong}`,
  transform: 'translateY(-0.2rem) rotate(45deg)',
  transition: 'transform 160ms ease',
});

export const toggleIconExpandedClassName = style({
  transform: 'translateY(0.2rem) rotate(225deg)',
});

export const emptyClassName = style({
  ...typography['body-3-medium'],
  display: 'flex',
  minHeight: '8rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  backgroundColor: atomic.neutral[10],
  color: atomic.neutral[60],
  textAlign: 'center',
});
