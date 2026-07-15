import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

import { cardMaxWidthVar as periodProductCardMaxWidthVar } from '@/shared/components/ui/period-product-card/PeriodProductCard.css';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

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

export const contentClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3.2rem',
  padding: '2rem 2rem calc(3.6rem + var(--client-safe-area-bottom))',
});

export const queryStateClassName = style({
  ...typography['body-3-medium'],
  display: 'flex',
  minHeight: '24rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.6rem',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const productSectionsFrameClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2.4rem',
});

export const overviewClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.4rem',
});

export const marketTitleRowClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.8rem',
});

export const marketTitleClassName = style({
  ...typography['heading-3-semibold'],
  minWidth: 0,
  margin: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  letterSpacing: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const marketStatusChipClassName = style({
  flexShrink: 0,
});

export const marketInfoClassName = style({
  display: 'grid',
  gridTemplateColumns: '14.1rem minmax(0, 1fr)',
  gap: '1rem',
  alignItems: 'start',
});

export const marketImageFrameClassName = style({
  position: 'relative',
  width: '14.1rem',
  height: '10.6rem',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: 8,
  backgroundColor: atomic.neutral[10],
});

export const imageFallbackClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  backgroundColor: atomic.neutral[10],
  backgroundImage:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.7) 25%, transparent 25%), linear-gradient(-45deg, rgba(255, 255, 255, 0.7) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.7) 75%), linear-gradient(-45deg, rgba(255, 255, 255, 0.7) 75%, transparent 75%)',
  backgroundPosition: '0 0, 0 1.2rem, 1.2rem -1.2rem, -1.2rem 0',
  backgroundSize: '2.4rem 2.4rem',
});

export const marketMetaListClassName = style({
  ...typography['caption-1-medium'],
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.6rem',
  margin: 0,
  color: atomic.neutral[70],
});

export const marketMetaItemClassName = style({
  display: 'grid',
  gridTemplateColumns: '1.6rem minmax(0, 1fr)',
  gap: '0.8rem',
  alignItems: 'start',
});

export const marketMetaIconClassName = style({
  display: 'inline-flex',
  width: '1.6rem',
  height: '1.6rem',
  alignItems: 'center',
  justifyContent: 'center',
  color: atomic.neutral[60],
});

export const marketMetaTextClassName = style({
  minWidth: 0,
  margin: 0,
  wordBreak: 'keep-all',
});

export const businessHourLinesClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  margin: 0,
});

export const openBusinessHourClassName = style({
  display: 'inline-flex',
  gap: '0.4rem',
});

export const closedBusinessHourClassName = style({
  display: 'inline-flex',
  gap: '0.9rem',
});

export const closedDayClassName = style({
  color: semantic.status.negativeLight,
});

export const actionRowClassName = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '0.8rem',
});

const marketActionButtonBaseClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: '100%',
  height: '4.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: 8,
  padding: '0 1.2rem',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const shareTriggerClassName = style([
  marketActionButtonBaseClassName,
  {
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
  },
]);

export const primaryActionButtonClassName = style([
  marketActionButtonBaseClassName,
  {
    borderColor: semantic.primary.normal,
    backgroundColor: semantic.primary.normal,
    color: atomic.common[0],
  },
]);

export const sectionClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '1.2rem',
});

export const cardSectionClassName = style([
  sectionClassName,
  {
    border: `0.1rem solid ${atomic.neutral[20]}`,
    borderRadius: 12,
    padding: '1.92rem 1.8rem',
  },
]);

export const sectionHeaderClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.8rem',
});

export const sectionTitleClassName = style({
  ...typography['body-1-semibold'],
  minWidth: 0,
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const sectionCountClassName = style({
  ...typography['body-3-medium'],
  flexShrink: 0,
  color: atomic.neutral[60],
});

export const popularListClassName = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.8rem',
});

export const topProductLinkClassName = style({
  display: 'block',
  minWidth: 0,
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      borderRadius: 12,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 3,
    },
  },
});

export const topProductCardClassName = style({
  position: 'relative',
  display: 'flex',
  width: '100%',
  aspectRatio: '1 / 1',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  overflow: 'hidden',
  borderRadius: 12,
  backgroundColor: atomic.neutral[10],
  color: atomic.common[0],
});

export const topProductImageFallbackClassName = style([
  imageFallbackClassName,
  {
    position: 'absolute',
    inset: 0,
  },
]);

export const topProductImageClassName = style({
  objectFit: 'cover',
});

export const topProductScrimClassName = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(48, 49, 51, 0.00) 36%, rgba(48, 49, 51, 0.9) 100%)',
  pointerEvents: 'none',
});

export const topProductContentClassName = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.1rem',
  padding: '0 1rem 1rem',
});

export const topProductNameClassName = style({
  ...typography['caption-2-regular'],
  overflow: 'hidden',
  color: atomic.common[0],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const topProductPriceClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.common[0],
});

export const discountChipClassName = style({
  position: 'absolute',
  top: '0.4rem',
  right: '0.4rem',
  zIndex: 1,
});

export const todaySpecialCardClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.8rem',
  borderRadius: 12,
  padding: '1.8rem 1.8rem 1rem',
  backgroundColor: atomic.neutral[5],
});

export const todaySpecialQueryStateClassName = style({
  ...typography['body-3-medium'],
  display: 'flex',
  minHeight: '8rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.2rem',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const todaySpecialEmptyClassName = style({
  ...typography['body-3-medium'],
  minHeight: '8rem',
  margin: 0,
  alignContent: 'center',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const todayProductListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const todayProductLinkClassName = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '5.6rem minmax(0, 1fr) 4.5rem',
  gap: '1.7rem',
  alignItems: 'center',
  color: atomic.neutral[90],
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      borderRadius: 12,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 4,
    },
  },
});

export const todayProductImageClassName = style({
  position: 'relative',
  width: '5.6rem',
  height: '5.6rem',
  overflow: 'hidden',
  borderRadius: 10,
  backgroundColor: atomic.neutral[20],
});

export const todayProductImageElementClassName = style({
  objectFit: 'cover',
});

export const todayProductContentClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.2rem',
});

export const todayProductNameClassName = style({
  ...typography['body-3-medium'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[80],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const todayProductPriceRowClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'baseline',
  gap: '0.4rem',
});

export const todayProductDiscountedPriceClassName = style({
  ...typography['body-2-semibold'],
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
});

export const todayProductOriginalPriceClassName = style({
  ...typography['caption-1-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[40],
  textDecoration: 'line-through',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const inlineToggleButtonClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  border: 0,
  width: '100%',
  padding: '1.2rem 0',
  backgroundColor: 'transparent',
  color: semantic.primary.strong,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      borderRadius: 8,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const categoryListClassName = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

// Keep selected and outlined category chips the same width for stable wrapping.
globalStyle(`${categoryListClassName} button[aria-pressed="true"]`, {
  borderColor: 'transparent',
  borderWidth: 1,
});

export const categoryMeasurementRowClassName = style({
  position: 'absolute',
  display: 'flex',
  width: 'max-content',
  height: 0,
  gap: '0.4rem',
  overflow: 'hidden',
  pointerEvents: 'none',
  visibility: 'hidden',
});

export const categoryPrimaryRowClassName = style({
  display: 'flex',
  minWidth: 0,
  flexWrap: 'wrap',
  gap: '0.4rem',
});

export const categoryExpandedGroupClassName = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
});

export const eventProductGridClassName = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '1.2rem',
});

export const eventProductCardClassName = style({
  vars: {
    [periodProductCardMaxWidthVar]: 'none',
  },
});

export const eventDiscountLoadMoreSentinelClassName = style({
  width: '100%',
  height: '1px',
});

export const emptyTextClassName = style({
  ...typography['body-3-regular'],
  margin: 0,
  padding: '2.4rem 0',
  color: atomic.neutral[60],
  textAlign: 'center',
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
