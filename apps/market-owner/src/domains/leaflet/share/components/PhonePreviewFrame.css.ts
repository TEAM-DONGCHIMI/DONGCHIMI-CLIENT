import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const previewClassName = style({
  position: 'relative',
  width: '30rem',
  aspectRatio: '300 / 610',
  overflow: 'hidden',
});

export const previewContentClassName = style({
  position: 'absolute',
  inset: '5.3rem 1.4rem 1rem',
  overflow: 'hidden',
  borderRadius: '0 0 4rem 4rem',
  backgroundColor: atomic.common[0],
});

export const marketPreviewClassName = style({
  position: 'relative',
  zIndex: 0,
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  color: atomic.neutral[90],
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const marketPreviewScaleClassName = style({
  width: '37.5rem',
  zoom: 0.7253333333,
});

export const mobileHeaderClassName = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'grid',
  width: '100%',
  minHeight: '4.8rem',
  gridTemplateColumns: '4.8rem minmax(0, 1fr) 4.8rem',
  alignItems: 'center',
  padding: '0.4rem 1.2rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const backIconClassName = style({
  display: 'inline-flex',
  width: '4.8rem',
  height: '4rem',
  alignItems: 'center',
  justifyContent: 'center',
  color: atomic.neutral[90],
});

export const mobileHeaderTitleClassName = style({
  ...typography['body-2-semibold'],
  gridColumn: 2,
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const contentClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3.2rem',
  padding: '2rem 2rem 3.6rem',
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
  ...typography['caption-2-medium'],
  flexShrink: 0,
  borderRadius: 999,
  padding: '0.3rem 0.7rem',
  backgroundColor: semantic.primary.normal,
  color: atomic.common[0],
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

export const imageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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
  display: 'flex',
  gap: '0.4rem',
});

export const closedBusinessHourClassName = style({
  display: 'flex',
  gap: '0.4rem',
});

export const closedDayClassName = style({
  flexShrink: 0,
  color: atomic.neutral[50],
});

export const actionRowClassName = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '0.8rem',
});

const actionClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  height: '4.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: 8,
  padding: '0 1.2rem',
  whiteSpace: 'nowrap',
});

export const shareActionClassName = style([
  actionClassName,
  {
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
  },
]);

export const callActionClassName = style([
  actionClassName,
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

export const topProductImageClassName = style([
  imageFallbackClassName,
  {
    position: 'absolute',
    inset: 0,
    objectFit: 'cover',
  },
]);

export const topProductScrimClassName = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(48, 49, 51, 0) 36%, rgba(48, 49, 51, 0.9) 100%)',
  pointerEvents: 'none',
});

export const discountBadgeClassName = style({
  position: 'absolute',
  top: '0.4rem',
  right: '0.4rem',
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

export const todaySpecialCardClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.8rem',
  borderRadius: 12,
  padding: '1.8rem 1.8rem 1rem',
  backgroundColor: atomic.neutral[5],
});

export const todayProductListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
});

export const todayProductCardClassName = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '5.6rem minmax(0, 1fr) 4.5rem',
  gap: '1.7rem',
  alignItems: 'center',
  color: atomic.neutral[90],
});

export const todayProductImageClassName = style({
  width: '5.6rem',
  height: '5.6rem',
  overflow: 'hidden',
  borderRadius: 10,
  backgroundColor: atomic.neutral[20],
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

export const todayDiscountChipClassName = style({
  justifySelf: 'end',
});

export const inlineToggleClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  padding: '1.2rem 0',
  color: semantic.primary.strong,
});

export const categoryListClassName = style({
  display: 'flex',
  minWidth: 0,
  flexWrap: 'nowrap',
  gap: '0.4rem',
  overflow: 'hidden',
});

export const categoryChipClassName = style({
  ...typography['caption-1-medium'],
  display: 'inline-flex',
  flexShrink: 0,
  minHeight: '3rem',
  alignItems: 'center',
  gap: '0.2rem',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: 999,
  padding: '0 1rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[70],
});

export const categoryChipSelectedClassName = style([
  categoryChipClassName,
  {
    borderColor: semantic.primary.normal,
    backgroundColor: semantic.primary.normal,
    color: atomic.common[0],
  },
]);

export const eventProductGridClassName = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '1.2rem',
});

export const eventProductCardClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.4rem',
});

export const eventProductImageFrameClassName = style({
  display: 'block',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: 12,
  backgroundColor: atomic.neutral[10],
});

export const eventProductNameClassName = style({
  ...typography['caption-1-medium'],
  display: '-webkit-box',
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[70],
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  wordBreak: 'break-word',
});

export const eventProductPriceClassName = style({
  ...typography['body-3-semibold'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const statusBarClassName = style({
  position: 'absolute',
  top: '1.1rem',
  left: '1.4rem',
  zIndex: 1,
  display: 'block',
  width: 'calc(100% - 2.8rem)',
  height: 'auto',
  pointerEvents: 'none',
});

export const phoneFrameClassName = style({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  display: 'block',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});
