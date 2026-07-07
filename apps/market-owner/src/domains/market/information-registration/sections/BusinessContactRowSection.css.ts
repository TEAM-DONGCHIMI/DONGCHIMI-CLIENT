import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const businessContactRowClassName = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 39.4rem) minmax(0, 43.7rem)',
  gap: '3.5rem',
});

export const inlineFieldClassName = style({
  display: 'grid',
  gridTemplateColumns: 'max-content minmax(0, 1fr)',
  gap: '1.2rem',
  alignItems: 'start',
});

export const businessTimeFieldWrapperClassName = style({
  display: 'grid',
  gridTemplateColumns: '7.6rem minmax(0, 1fr)',
  gap: '1.2rem',
  alignItems: 'start',
});

export const inlineLabelClassName = style({
  display: 'inline-flex',
  minHeight: '4.8rem',
  alignItems: 'center',
  gap: '0.4rem',
  whiteSpace: 'nowrap',
});

export const businessHourControlClassName = style({
  display: 'grid',
  gridTemplateColumns: '13rem minmax(0, 18.8rem)',
  gap: '0.4rem',
});

export const dropdownFieldClassName = style({
  position: 'relative',
});

export const dropdownTriggerClassName = style({
  display: 'inline-flex',
  width: '100%',
  height: '4.8rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.8rem',
  padding: '1rem 1.4rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  ...typography['body-3-medium'],
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});

export const dropdownTriggerContentClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.8rem',
});

export const dropdownTriggerIconClassName = style({
  width: '2rem',
  height: '2rem',
  flexShrink: 0,
  color: atomic.neutral[70],
});

export const dropdownPopoverClassName = style({
  position: 'absolute',
  zIndex: 10,
  top: 'calc(100% + 0.8rem)',
  left: 0,
  maxHeight: '20.4rem',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const marketPhoneLabelClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const addableFieldClassName = style({
  minWidth: 0,
});
