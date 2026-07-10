import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const pageRootClassName = style({
  width: '100%',
  minWidth: 'max-content',
  minHeight: '100vh',
  backgroundColor: atomic.neutral[5],
});

export const formContentClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '4rem',
  width: '90rem',
  marginLeft: '4rem',
  padding: '3.2rem 0 0',
});

export const titleSectionClassName = style({
  flexShrink: 0,
});

export const titleContentClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: '4rem',
});

export const titleMainClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.8rem',
  minWidth: 0,
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  display: 'inline-flex',
  alignItems: 'center',
  margin: 0,
  color: atomic.neutral[90],
  gap: '0.4rem',
});

export const titleCountClassName = style({
  display: 'inline-flex',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'pre',
});

export const titleCurrentCountClassName = style({
  color: semantic.primary.normal,
});

export const titleButtonGroupClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: '8rem',
});

export const titleNavigationButtonClassName = style({
  width: '4rem',
  height: '4rem',
  padding: '0.8rem',
  color: atomic.neutral[90],
  fontSize: '2.4rem',
});

export const titleRemoveButtonClassName = style({
  borderColor: atomic.neutral[20],
  color: atomic.neutral[90],
});

export const fieldSectionsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  gap: '3.8rem',
});

export const fieldSectionClassName = style({
  display: 'grid',
  gridTemplateColumns: 'max-content minmax(0, 1fr)',
  columnGap: '14rem',
  alignItems: 'start',
});

export const sectionTitleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[80],
  whiteSpace: 'nowrap',
});

export const sectionBodyClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  minWidth: 0,
});

export const fieldLabelClassName = style({
  ...typography['body-3-medium'],
  color: atomic.neutral[70],
});

export const twoColumnRowClassName = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: '4.8rem',
  alignItems: 'start',
});

export const fieldGroupClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  minWidth: 0,
});

export const fieldErrorMessageClassName = style({
  ...typography['caption-1-medium'],
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  margin: 0,
  color: semantic.status.negative,
});

export const fieldErrorIconClassName = style({
  flexShrink: 0,
  width: '1.6rem',
  height: '1.6rem',
});

export const categoryWrapperClassName = style({
  position: 'relative',
  minWidth: '13.4rem',
});

export const categoryTriggerClassName = style({
  ...typography['body-3-medium'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  width: '13.4rem',
  height: '4rem',
  padding: '0.6rem 1.6rem',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: '0.4rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  cursor: 'pointer',
  transition: 'border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      borderColor: atomic.neutral[80],
    },
    '&[aria-expanded="true"]': {
      borderColor: atomic.neutral[80],
    },
    '&:focus-visible': {
      borderColor: atomic.neutral[80],
      outline: `0.3rem solid ${focusOutlineColor}`,
      outlineOffset: '0.2rem',
    },
  },
});

export const categoryPlaceholderClassName = style({
  color: atomic.neutral[60],
});

export const categoryTriggerErrorClassName = style({
  borderColor: semantic.status.negativeLight,
  selectors: {
    '&:hover': {
      borderColor: semantic.status.negativeLight,
    },
    '&[aria-expanded="true"]': {
      borderColor: semantic.status.negativeLight,
    },
    '&:focus-visible': {
      borderColor: semantic.status.negativeLight,
    },
  },
});

export const categoryDropdownOverlayClassName = style({
  position: 'absolute',
  top: 'calc(100% + 0.8rem)',
  left: 0,
  zIndex: 1,
});

export const categoryDropdownClassName = style({
  width: '20.6rem',
  maxHeight: 'var(--today-special-category-dropdown-max-height)',
  border: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
});

export const categoryDropdownItemClassName = style({
  width: '16.6rem',
});

export const dateSingleFieldClassName = style({
  width: 'calc((100% - 4.4rem) / 2)',
});

export const actionSectionClassName = style({
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'flex-end',
  gap: '1.4rem',
  width: '100%',
});

export const actionButtonClassName = style({
  width: '13.8rem',
  minWidth: '13.8rem',
  padding: '1.2rem 2.4rem',
});
