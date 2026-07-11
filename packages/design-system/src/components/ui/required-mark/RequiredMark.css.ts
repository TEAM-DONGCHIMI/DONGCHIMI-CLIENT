import { globalStyle, style } from '@vanilla-extract/css';

import { semantic, typography } from '../../../tokens';

export const rootClassName = style({
  alignItems: 'center',
  cursor: 'help',
  display: 'inline-flex',
  flexShrink: 0,
  position: 'relative',
});

export const markClassName = style({
  ...typography['body-2-regular'],
  color: semantic.status.negative,
});

export const tooltipClassName = style({
  bottom: 'calc(100% + 4px)',
  left: '50%',
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
  transform: 'translateX(-50%)',
  transition: 'opacity 120ms ease',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  width: 'max-content',
  zIndex: 1,
  selectors: {
    [`${rootClassName}:hover &`]: {
      opacity: 1,
      visibility: 'visible',
    },
  },
});

globalStyle(`.${tooltipClassName} span`, {
  maxWidth: 'none',
});
