import { style } from '@vanilla-extract/css';

import { atomic, shadow } from '@dongchimi/design-system/tokens';

export const authLayoutRootClassName = style({
  display: 'flex',
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'hidden',
  backgroundColor: atomic.neutral[5],
});

export const onboardingPanelClassName = style({
  flexShrink: 0,
  width: '36.5rem',
  backgroundColor: atomic.common[0],
  backgroundImage:
    'linear-gradient(45deg, #d8dde3 25%, transparent 25%), linear-gradient(-45deg, #d8dde3 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d8dde3 75%), linear-gradient(-45deg, transparent 75%, #d8dde3 75%)',
  backgroundPosition: '0 0, 0 0.6rem, 0.6rem -0.6rem, -0.6rem 0',
  backgroundSize: '1.2rem 1.2rem',
});

export const authLayoutContentWrapperClassName = style({
  display: 'flex',
  flex: '1 1 0%',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem',
});

export const authLayoutContentClassName = style({
  width: 'fit-content',
  maxWidth: '100%',
  overflow: 'hidden',
  borderRadius: '1.6rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});
