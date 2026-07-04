import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  width: 290,
  height: '100%',
  padding: '32px 16px 16px',
  backgroundColor: atomic.common[0],
  boxShadow: '0 20px 64px rgba(25, 31, 40, 0.08)',
  color: atomic.neutral[90],
});

export const sidebarBrand = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 32,
  padding: '0 16px',
  ...typography['heading-3-semibold'],
});

export const sidebarDivider = style({
  width: '100%',
  height: 1,
  margin: '32px 0 24px',
  backgroundColor: atomic.neutral[20],
});

export const sidebarProfile = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0 16px 24px',
});

export const sidebarProfileAvatar = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  overflow: 'hidden',
  borderRadius: 999,
  backgroundColor: atomic.neutral[10],
});

export const sidebarProfileText = style({
  display: 'grid',
  minWidth: 0,
  gap: 2,
});

export const sidebarProfileTitle = style({
  overflow: 'hidden',
  color: atomic.neutral[90],
  ...typography['body-2-semibold'],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const sidebarProfileEmail = style({
  overflow: 'hidden',
  color: atomic.neutral[40],
  ...typography['caption-1-medium'],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const sidebarNav = style({
  display: 'grid',
  gap: 24,
});

export const sidebarSection = style({
  display: 'grid',
  gap: 8,
});

export const sidebarSectionTitle = style({
  margin: 0,
  padding: '0 16px 4px',
  color: atomic.neutral[80],
  ...typography['body-3-semibold'],
});

export const sidebarItem = recipe({
  base: {
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 48,
    boxSizing: 'border-box',
    gap: 12,
    border: 0,
    borderRadius: 12,
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: atomic.neutral[60],
    cursor: 'pointer',
    ...typography['body-2-medium'],
    textAlign: 'left',
    textDecoration: 'none',
    transition:
      'background-color 160ms ease, color 160ms ease, opacity 160ms ease, outline-color 160ms ease',
    selectors: {
      '&:hover': {
        backgroundColor: atomic.neutral[5],
        color: atomic.neutral[90],
      },
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
        outlineOffset: 2,
      },
    },
  },
  variants: {
    active: {
      false: {},
      true: {
        backgroundColor: semantic.primary.light,
        color: atomic.neutral[90],
        selectors: {
          '&:hover': {
            backgroundColor: semantic.primary.light,
          },
        },
      },
    },
    disabled: {
      false: {},
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
        selectors: {
          '&:hover': {
            backgroundColor: 'transparent',
            color: atomic.neutral[60],
          },
        },
      },
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
  },
});

export const sidebarItemIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  fontSize: 24,
  lineHeight: 0,
});

export const sidebarItemLabel = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const sidebarFooter = style({
  display: 'grid',
  gap: 12,
  marginTop: 'auto',
  paddingTop: 24,
  borderTop: `1px solid ${atomic.neutral[20]}`,
});

export const sidebarHelpCard = style({
  display: 'grid',
  gap: 10,
  borderRadius: 10,
  padding: '14px 16px 16px',
  backgroundColor: atomic.neutral[10],
});
