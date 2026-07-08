import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const pageRootClassName = style({
  width: '100%',
  minWidth: 'max-content',
  minHeight: '100vh',
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
  fontSize: '2.4rem',
});

export const titleRemoveButtonClassName = style({
  borderColor: atomic.neutral[20],
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

export const imageFieldClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.9rem',
});

export const imageTextGroupClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const fieldLabelClassName = style({
  ...typography['body-3-medium'],
  color: atomic.neutral[70],
});

export const imageDescriptionClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: atomic.neutral[50],
});

export const imageUploadBoxClassName = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '11.2rem',
  height: '11.2rem',
  overflow: 'hidden',
  border: `1px dashed ${atomic.neutral[40]}`,
  borderRadius: '1.2rem',
  backgroundColor: atomic.neutral[20],
  color: atomic.neutral[60],
  cursor: 'pointer',
  transition: 'border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:focus-within': {
      outline: `0.3rem solid ${focusOutlineColor}`,
      outlineOffset: '0.2rem',
    },
  },
});

export const imageUploadBoxPreviewClassName = style({
  border: 0,
  selectors: {
    '&::after': {
      position: 'absolute',
      inset: 0,
      content: '',
      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)',
    },
  },
});

export const emptyUploadContentClassName = style({
  ...typography['body-3-medium'],
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.6rem',
  textAlign: 'center',
});

export const emptyUploadIconClassName = style({
  width: '2.4rem',
  height: '2.4rem',
});

export const imagePreviewContentClassName = style({
  width: '100%',
  height: '100%',
});

export const imagePreviewClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const cameraBadgeClassName = style({
  position: 'absolute',
  top: '0.8rem',
  right: '0.8rem',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.4rem',
  height: '2.4rem',
  color: atomic.common[100],
  fontSize: '2.4rem',
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

export const categoryDropdownClassName = style({
  position: 'absolute',
  zIndex: 1,
  top: '4.9rem',
  left: 0,
  width: '20.6rem',
});

export const categoryDropdownItemClassName = style({
  width: '16.6rem',
});

export const dateRowClassName = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1.6rem 1fr',
  gap: '1.4rem',
  alignItems: 'start',
  width: '100%',
});

export const dateFieldGroupClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  minWidth: 0,
});

export const dateFieldRootClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  minWidth: 0,
});

export const datePickerFieldClassName = style({
  ...typography['body-3-medium'],
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '4rem',
  minWidth: 0,
  padding: '1rem 1.6rem',
  overflow: 'hidden',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.4rem',
  backgroundColor: atomic.common[0],
  cursor: 'pointer',
  transition: 'border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      borderColor: atomic.neutral[80],
    },
    '&:focus-within': {
      borderColor: atomic.neutral[80],
    },
  },
});

export const datePickerFieldErrorClassName = style({
  borderColor: semantic.status.negativeLight,
  selectors: {
    '&:hover': {
      borderColor: semantic.status.negativeLight,
    },
    '&:focus-within': {
      borderColor: semantic.status.negativeLight,
    },
  },
});

export const dateValueClassName = style({
  color: atomic.neutral[90],
});

export const datePlaceholderClassName = style({
  color: atomic.neutral[60],
});

export const dateNativeInputClassName = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
});

export const dateSeparatorClassName = style({
  ...typography['heading-1-semibold'],
  color: atomic.neutral[40],
  textAlign: 'center',
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
