import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const productEditCardWidth = '25.2rem';

export const sectionListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3.8rem',
});

export const categorySectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const categoryTitleClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[80],
});

export const productGridClassName = style({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${productEditCardWidth}, ${productEditCardWidth}))`,
  gap: '1.6rem 2rem',
});

export const loadingClassName = style({
  margin: 0,
  padding: '4rem 0',
  color: atomic.neutral[60],
  textAlign: 'center',
  ...typography['body-3-medium'],
});

export const loadMoreSentinelClassName = style({
  height: '1px',
});

export const loadMoreErrorClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.2rem',
  padding: '2rem 0',
});

export const loadMoreErrorMessageClassName = style({
  margin: 0,
  color: atomic.neutral[60],
  ...typography['body-3-medium'],
});

export const retryButtonClassName = style({
  border: 0,
  borderRadius: '0.8rem',
  padding: '0.8rem 1.6rem',
  background: semantic.primary.normal,
  color: atomic.common[0],
  cursor: 'pointer',
  ...typography['body-3-medium'],
});
