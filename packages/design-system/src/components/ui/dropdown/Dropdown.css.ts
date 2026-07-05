import { style } from '@vanilla-extract/css';

import { atomic, shadow } from '../../../tokens';

export const dropdown = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.4rem',
  boxSizing: 'border-box',
  width: 'fit-content',
  padding: '0.8rem 2rem',
  backgroundColor: atomic.common[0],
  border: `1px solid ${atomic.neutral[10]}`,
  borderRadius: 12,
  overflow: 'clip',
  boxShadow: shadow.normal.small,
});
