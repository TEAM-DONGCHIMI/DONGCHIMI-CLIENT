import { style } from '@vanilla-extract/css';

import { atomic, shadow } from '@dongchimi/design-system/tokens';

export const authLayoutRootClassName = style({
  display: 'flex',
  height: '100dvh',
  boxSizing: 'border-box',
  overflow: 'hidden',
  backgroundColor: atomic.neutral[5],
});

export const onboardingPanelClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '100%',
  overflow: 'hidden',
  backgroundColor: atomic.common[0],
});

export const onboardingImageClassName = style({
  display: 'block',
  width: 'auto',
  height: '100%',
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
