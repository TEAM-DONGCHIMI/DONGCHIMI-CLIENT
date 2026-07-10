import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const buttonClassName = style({
  ...typography['body-3-semibold'],
  display: 'inline-flex',
  width: '100%',
  maxWidth: '33.5rem',
  minWidth: 0,
  height: '5rem',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '1.2rem 7.8rem',
  border: 0,
  borderRadius: '1.2rem',
  backgroundColor: semantic.status.kakaoYellow,
  color: atomic.neutral[90],
  transition:
    'background-color 160ms ease, border-color 160ms ease, color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:focus-visible': {
      outline: `0.3rem solid ${focusOutlineColor}`,
      outlineOffset: '0.2rem',
    },
    '&:disabled': {
      backgroundColor: atomic.neutral[30],
      color: atomic.common[0],
      cursor: 'not-allowed',
    },
  },
});

export const iconClassName = style({
  width: '2rem',
  height: '2rem',
  flexShrink: 0,
});
