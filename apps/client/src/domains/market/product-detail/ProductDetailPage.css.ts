import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  minHeight: '100dvh',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const headerClassName = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
});

export const imageSectionClassName = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundColor: atomic.neutral[10],
});

export const imageFallbackClassName = style({
  width: '100%',
  height: '100%',
  backgroundColor: atomic.neutral[10],
  backgroundImage: [
    'linear-gradient(45deg, rgba(255, 255, 255, 0.72) 25%, transparent 25%)',
    'linear-gradient(-45deg, rgba(255, 255, 255, 0.72) 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.72) 75%)',
    'linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.72) 75%)',
  ].join(', '),
  backgroundPosition: '0 0, 0 1.85rem, 1.85rem -1.85rem, -1.85rem 0',
  backgroundSize: '3.7rem 3.7rem',
});

export const contentSectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '2rem',
  paddingBottom: 'calc(2rem + var(--client-safe-area-bottom))',
});

export const productSummaryClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.8rem',
});

export const marketNameClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
});

export const chipRowClassName = style({
  display: 'flex',
  maxWidth: '100%',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.4rem',
});

export const productNameClassName = style({
  ...typography['heading-3-medium'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  wordBreak: 'keep-all',
});

export const priceRowClassName = style({
  display: 'flex',
  minWidth: 0,
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: '1rem',
});

export const discountedPriceGroupClassName = style({
  ...typography['heading-1-semibold'],
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'baseline',
  gap: '0.6rem',
  letterSpacing: 0,
  whiteSpace: 'nowrap',
});

export const discountRateClassName = style({
  color: semantic.status.negative,
});

export const salePriceClassName = style({
  minWidth: 0,
  color: atomic.neutral[90],
});

export const originalPriceClassName = style({
  ...typography['body-1-medium'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[40],
  letterSpacing: 0,
  textDecoration: 'line-through',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const singlePriceClassName = style({
  ...typography['heading-1-semibold'],
  color: atomic.neutral[90],
  letterSpacing: 0,
  whiteSpace: 'nowrap',
});

export const commentCardClassName = style({
  marginTop: '0.8rem',
});

export const visuallyHiddenClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
