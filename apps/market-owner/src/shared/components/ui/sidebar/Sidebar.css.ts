import { style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  width: 290,
  height: '100%',
  minHeight: 0,
  padding: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const sidebarBrand = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: 8,
  minHeight: 96,
  padding: '32px 24px',
  boxSizing: 'border-box',
  ...typography['heading-3-semibold'],
});

export const sidebarDivider = style({
  flexShrink: 0,
  width: 'calc(100% - 32px)',
  height: 1,
  margin: '0 16px',
  backgroundColor: atomic.neutral[10],
});

export const sidebarProfile = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  height: 85,
  boxSizing: 'border-box',
  gap: 12,
  padding: '23px 16px 22px',
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
  flexShrink: 0,
  gap: 28,
  padding: '0 16px',
});

export const sidebarSection = style({
  display: 'grid',
  gap: 12,
});

export const sidebarSectionTitle = style({
  margin: 0,
  padding: 0,
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
    gap: 10,
    border: 0,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
    color: atomic.neutral[50],
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
            color: atomic.neutral[50],
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
  flexShrink: 0,
  boxSizing: 'border-box',
  width: 'calc(100% - 32px)',
  gap: 6,
  margin: 'auto 16px 0',
  padding: '12px 0 26px',
  borderTop: `1px solid ${atomic.neutral[10]}`,
});

export const sidebarHelpCard = style({
  display: 'grid',
  boxSizing: 'border-box',
  gap: 10,
  borderRadius: 12,
  padding: 16,
  backgroundColor: atomic.neutral[10],
});
