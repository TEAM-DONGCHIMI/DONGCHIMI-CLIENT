import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

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
