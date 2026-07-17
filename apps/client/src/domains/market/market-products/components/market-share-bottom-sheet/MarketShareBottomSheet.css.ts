import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const triggerClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '4rem',
  border: 0,
  borderRadius: 12,
  padding: '0.8rem 1.2rem',
  backgroundColor: semantic.primary.normal,
  color: atomic.common[0],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const sheetClassName = style({
  position: 'fixed',
  top: 'auto',
  right: 'auto',
  bottom: 0,
  left: '50%',
  width: '100%',
  maxWidth: 'var(--client-mobile-max-width)',
  minHeight: '43rem',
  margin: 0,
  borderRadius: '2.6rem 2.6rem 0 0',
  boxShadow: 'none',
  transform: 'translate3d(-50%, 0, 0)',
  selectors: {
    '&&': {
      width: '100%',
      maxWidth: 'var(--client-mobile-max-width)',
    },
  },
});

export const installSheetClassName = style([
  sheetClassName,
  {
    minHeight: '39.7rem',
  },
]);

export const bodyClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  overflow: 'visible',
  padding: '0 1.8rem 1.2rem',
});

export const linkFieldClassName = style({
  display: 'flex',
  minWidth: 0,
  minHeight: '5.2rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.6rem',
  borderRadius: 12,
  padding: '1.4rem 1.6rem',
  backgroundColor: atomic.neutral[10],
});

export const linkTextClassName = style({
  ...typography['body-3-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[60],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const linkCopyButtonClassName = style({
  ...typography['body-2-regular'],
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  lineHeight: 0,
  selectors: {
    '&:focus-visible': {
      borderRadius: 8,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const actionListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
});

export const actionButtonClassName = style({
  ...typography['body-2-semibold'],
  display: 'flex',
  width: '100%',
  minHeight: '5.6rem',
  alignItems: 'center',
  gap: '1.6rem',
  border: 0,
  borderRadius: 12,
  padding: '0.8rem 0',
  backgroundColor: 'transparent',
  color: atomic.neutral[80],
  cursor: 'pointer',
  textAlign: 'left',
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
});

export const actionIconClassName = style({
  ...typography['heading-3-regular'],
  display: 'inline-flex',
  width: '4rem',
  height: '4rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: `0.1rem solid ${atomic.neutral[40]}`,
  borderRadius: '999rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[80],
  lineHeight: 0,
});

export const shareCloseButtonClassName = style({
  selectors: {
    '&&:hover:not(:disabled)': {
      backgroundColor: atomic.common[0],
    },
  },
});

export const toastIconClassName = style({
  ...typography['heading-3-regular'],
  display: 'block',
  width: '2rem',
  height: '2rem',
});

export const visuallyHiddenClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  margin: -1,
  padding: 0,
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const installBodyClassName = style({
  flex: 1,
  selectors: {
    '&&': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      overflow: 'visible',
      padding: '1.5rem 2rem 0',
    },
  },
});

export const installImageClassName = style({
  display: 'block',
  width: 'min(26.3rem, 100%)',
  height: 'auto',
  borderRadius: 12,
});

export const installDescriptionClassName = style({
  width: 'min(26.3rem, 100%)',
  minHeight: '4.4rem',
  selectors: {
    '&&': {
      ...typography['body-2-medium'],
      margin: '0.8rem 0 0',
      color: atomic.neutral[90],
      textAlign: 'center',
      whiteSpace: 'pre-line',
      wordBreak: 'keep-all',
    },
  },
});

export const installButtonClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: 'min(26.3rem, 100%)',
  minHeight: '4.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2rem',
  border: 0,
  borderRadius: 8,
  padding: '1.2rem 2rem',
  backgroundColor: semantic.primary.normal,
  color: atomic.common[0],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'wait',
      opacity: 0.7,
    },
  },
});

export const installLaterButtonClassName = style({
  selectors: {
    '&&': {
      ...typography['body-3-semibold'],
      minHeight: '6.2rem',
      padding: '1.6rem 2rem 2.6rem',
      color: atomic.neutral[50],
    },
  },
});
