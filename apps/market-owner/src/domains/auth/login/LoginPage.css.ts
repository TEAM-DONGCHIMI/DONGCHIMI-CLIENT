import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const cardClassName = style({
  boxSizing: 'border-box',
  width: 'min(78.5rem, calc(100vw - min(3.2rem, 10vw)))',
  maxWidth: '100%',
  minHeight: 'min(60.3rem, calc(100vh - 8rem))',
  minWidth: 0,
  gap: '3rem',
  paddingBlock: 'clamp(2rem, 5vw, 4rem)',
  paddingInline: 'clamp(2rem, 4vw, 3.1rem)',
});

export const headerClassName = style({
  width: 'min(33.5rem, 100%)',
  gap: '1.2rem',
  textAlign: 'center',
});

export const logoSlotClassName = style({
  width: '15.7rem',
  maxWidth: '100%',
  height: '6rem',
  borderRadius: '0.4rem',
  backgroundColor: atomic.common[0],
  backgroundImage:
    'linear-gradient(45deg, #d8dde3 25%, transparent 25%), linear-gradient(-45deg, #d8dde3 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d8dde3 75%), linear-gradient(-45deg, transparent 75%, #d8dde3 75%)',
  backgroundPosition: '0 0, 0 0.6rem, 0.6rem -0.6rem, -0.6rem 0',
  backgroundSize: '1.2rem 1.2rem',
});

export const titleClassName = style({
  ...typography['title-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const contentClassName = style({
  width: '100%',
  gap: '2rem',
});
