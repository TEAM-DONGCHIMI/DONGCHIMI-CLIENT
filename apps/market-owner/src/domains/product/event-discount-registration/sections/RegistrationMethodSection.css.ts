import { style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

export const sectionClassName = style({
  width: '100%',
  minWidth: 0,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6.8rem',
});

export const headerClassName = style({
  gap: '1.2rem',
});

export const titleClassName = style({
  ...typography['title-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
});

export const descriptionClassName = style({
  ...typography['body-1-medium'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
  textAlign: 'center',
});

export const contentClassName = style({
  width: '100%',
  minWidth: 0,
  gap: '5.2rem',
});

export const methodCardClassName = style({
  position: 'relative',
  boxSizing: 'border-box',
  width: '36rem',
  minHeight: '45rem',
  alignItems: 'center',
  padding: '4rem 4rem 3.6rem',
  borderRadius: '2.4rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});

export const imagePlaceholderClassName = style({
  width: '8rem',
  height: '8rem',
  flexShrink: 0,
  borderRadius: '1.6rem',
  backgroundImage:
    'linear-gradient(45deg, rgba(226, 232, 240, 0.76) 25%, transparent 25%), linear-gradient(-45deg, rgba(226, 232, 240, 0.76) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(226, 232, 240, 0.76) 75%), linear-gradient(-45deg, transparent 75%, rgba(226, 232, 240, 0.76) 75%)',
  backgroundPosition: '0 0, 0 0.8rem, 0.8rem -0.8rem, -0.8rem 0',
  backgroundSize: '1.6rem 1.6rem',
});

export const cardTextGroupClassName = style({
  width: '100%',
  minWidth: 0,
  minHeight: '7.6rem',
  gap: '1rem',
  marginTop: '2.2rem',
});

export const cardTitleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
});

export const cardDescriptionClassName = style({
  ...typography['caption-1-regular'],
  width: '100%',
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
  textAlign: 'center',
});

export const descriptionLineClassName = style({
  display: 'block',
});

export const actionSlotClassName = style({
  width: '100%',
  height: '12.4rem',
  alignItems: 'stretch',
  marginTop: '2.4rem',
});

export const excelActionGroupClassName = style({
  width: '100%',
  gap: '0.8rem',
});

export const primaryActionButtonClassName = style({
  width: '100%',
  minWidth: 0,
  height: '4.4rem',
  padding: '1.2rem 2.4rem',
});

export const secondaryActionButtonClassName = style({
  width: '100%',
  minWidth: 0,
  height: '4.4rem',
  padding: '1.2rem 2.4rem',
});

export const guideLineButtonClassName = style({
  ...typography['caption-1-medium'],
  alignSelf: 'center',
  marginTop: '0.4rem',
  color: atomic.neutral[60],
  letterSpacing: 0,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2rem',
});

export const supportGroupClassName = style({
  minHeight: '3.4rem',
  gap: '0.6rem',
  marginTop: '2.8rem',
});

export const supportTextClassName = style({
  ...typography['caption-2-medium'],
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
});

export const helperTextClassName = style({
  ...typography['caption-2-medium'],
  color: semantic.status.negativeLight,
  letterSpacing: 0,
  textAlign: 'center',
});

export const dividerTextClassName = style({
  ...typography['caption-1-medium'],
  flexShrink: 0,
  color: atomic.neutral[70],
  letterSpacing: 0,
});
