import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, typography } from '../../../tokens';

export const tooltip = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  boxSizing: 'border-box',
  minWidth: 164,
});

export const tooltipBubble = style({
  display: 'flex',
  alignItems: 'flex-start',
  minWidth: 164,
  padding: '0.8rem 1.2rem',
  backgroundColor: atomic.neutral[70],
  borderRadius: 8,
  overflow: 'clip',
  backdropFilter: 'blur(32px)',
});

export const tooltipLabel = style({
  ...typography['body-3-medium'],
  minWidth: 0,
  maxWidth: 256,
  color: atomic.common[0],
  wordBreak: 'break-word',
});

const tooltipArrowBase = {
  display: 'block',
  alignSelf: 'center',
  width: 20,
  height: 8,
  color: atomic.neutral[70],
};

export const tooltipArrow = styleVariants({
  top: tooltipArrowBase,
  bottom: { ...tooltipArrowBase, transform: 'rotate(180deg)' },
});
