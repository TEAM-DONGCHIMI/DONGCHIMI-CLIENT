import { style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

const guideLineButtonActionStyle = {
  ...typography['body-3-semibold'],
  color: atomic.neutral[60],
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.4rem',
};

export const sectionClassName = style({
  width: '100%',
  minWidth: 0,
  flex: 1,
  alignItems: 'center',
  boxSizing: 'border-box',
  gap: 0,
  justifyContent: 'flex-start',
  padding: '9rem 0 5.6rem',
  '@media': {
    'screen and (max-width: 1280px)': {
      gap: '4rem',
      paddingTop: '7rem',
    },
    'screen and (max-width: 768px)': {
      gap: '3.2rem',
      padding: '4rem 1.6rem 0',
    },
  },
});

export const headerClassName = style({
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['title-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
});

export const descriptionClassName = style({
  ...typography['body-1-medium'],
  margin: 0,
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const contentClassName = style({
  width: '100%',
  height: '55rem',
  minWidth: 0,
  flexShrink: 0,
  boxSizing: 'border-box',
  columnGap: '3.6rem',
  rowGap: '2.4rem',
  paddingBottom: '1.4rem',
  '@media': {
    'screen and (max-width: 1280px)': {
      height: 'auto',
      flexDirection: 'column',
      gap: '2.4rem',
      paddingBottom: 0,
    },
  },
});

export const methodCardClassName = style({
  position: 'relative',
  boxSizing: 'border-box',
  width: 'min(35.5rem, 100%)',
  maxWidth: '35.5rem',
  minHeight: '43.4rem',
  flex: '0 1 35.5rem',
  alignItems: 'center',
  padding: '3.6rem',
  borderRadius: '2.4rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.small,
  '@media': {
    'screen and (max-width: 768px)': {
      minHeight: 'auto',
      padding: '3.2rem 2rem',
    },
  },
});

export const methodImageClassName = style({
  display: 'block',
  width: '8rem',
  height: '8rem',
  flexShrink: 0,
  objectFit: 'contain',
});

export const cardTextGroupClassName = style({
  width: '100%',
  minWidth: 0,
  gap: '0.6rem',
  marginTop: '1.2rem',
});

export const cardTitleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
});

export const cardDescriptionClassName = style({
  ...typography['caption-1-regular'],
  width: '100%',
  margin: 0,
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const descriptionLineClassName = style({
  display: 'block',
});

export const actionSlotClassName = style({
  width: '100%',
  minHeight: '12.6rem',
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
  ...guideLineButtonActionStyle,
  alignSelf: 'center',
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  textAlign: 'center',
  whiteSpace: 'normal',
  selectors: {
    '&&:not(:disabled):hover': {
      ...guideLineButtonActionStyle,
    },
    '&&:focus-visible': {
      ...guideLineButtonActionStyle,
    },
  },
});

export const supportGroupClassName = style({
  minHeight: '3.4rem',
  gap: 0,
  justifyContent: 'flex-end',
  marginTop: 'auto',
});

export const supportTextClassName = style({
  ...typography['caption-1-medium'],
  color: atomic.neutral[90],
  textAlign: 'center',
});

export const helperTextClassName = style({
  ...typography['caption-1-medium'],
  color: semantic.status.negativeLight,
  textAlign: 'center',
});

export const dividerTextClassName = style({
  ...typography['caption-1-medium'],
  flexShrink: 0,
  color: atomic.neutral[70],
});
