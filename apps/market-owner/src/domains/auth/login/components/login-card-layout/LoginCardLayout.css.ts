import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const rootClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: 'min(78.5rem, calc(100vw - min(3.2rem, 10vw)))',
  maxWidth: '100%',
  minHeight: 'min(60.3rem, calc(100vh - min(3.2rem, 10vh)))',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 'clamp(2rem, 4vw, 3rem)',
  borderRadius: '1.47rem',
  padding: 'clamp(2rem, 5vw, 4rem)',
  backgroundColor: atomic.common[0],
  boxShadow: '0 0 3rem rgb(23 23 23 / 5%)',
});

export const headerClassName = style({
  display: 'flex',
  width: 'min(33.5rem, 100%)',
  flexDirection: 'column',
  alignItems: 'center',
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
