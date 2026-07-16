import { style } from '@vanilla-extract/css';

import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

const PANEL_WIDTH = '25.4rem';
const VISIBLE_RESULT_COUNT = 4;
const RESULT_ITEM_HEIGHT_REM = 4;
const RESULT_LIST_GAP_REM = 0.4;
const RESULT_LIST_VERTICAL_PADDING_REM = 1.6;
const RESULT_LIST_MAX_HEIGHT = `${
  RESULT_ITEM_HEIGHT_REM * VISIBLE_RESULT_COUNT +
  RESULT_LIST_GAP_REM * (VISIBLE_RESULT_COUNT - 1) +
  RESULT_LIST_VERTICAL_PADDING_REM
}rem`;
const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  position: 'relative',
  display: 'grid',
  width: PANEL_WIDTH,
  minWidth: 0,
  gap: '0.4rem',
});

export const searchIconClassName = style({
  display: 'block',
  width: '1.6rem',
  height: '1.6rem',
});

export const dropdownClassName = style({
  position: 'absolute',
  zIndex: 10,
  top: 'calc(100% + 0.4rem)',
  left: 0,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
  border: `0.1rem solid ${atomic.neutral[10]}`,
  borderRadius: '1.2rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.small,
});

export const resultListClassName = style({
  display: 'grid',
  gap: `${RESULT_LIST_GAP_REM}rem`,
  margin: 0,
  overflowY: 'hidden',
  padding: '0.8rem 2rem',
  listStyle: 'none',
  selectors: {
    '&[data-scrollable="true"]': {
      maxHeight: RESULT_LIST_MAX_HEIGHT,
      overflowY: 'auto',
    },
  },
});

export const resultItemClassName = style({
  minWidth: 0,
});

export const resultButtonClassName = style({
  appearance: 'none',
  display: 'grid',
  width: 'calc(100% + 2.4rem)',
  minWidth: 0,
  height: `${RESULT_ITEM_HEIGHT_REM}rem`,
  boxSizing: 'border-box',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'center',
  gap: '0.8rem',
  marginLeft: '-1.2rem',
  border: 0,
  borderRadius: '0.8rem',
  padding: '0 1.2rem',
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      backgroundColor: atomic.neutral[10],
    },
    '&:focus': {
      outline: 0,
    },
    '&:focus-visible': {
      backgroundColor: atomic.neutral[10],
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 1,
    },
  },
});

export const resultNameClassName = style({
  ...typography['body-2-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const resultLabelChipClassName = style({
  ...typography['caption-1-regular'],
  minHeight: '2rem',
  padding: '0.2rem 0.8rem',
});

export const emptyStateClassName = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '1.6rem 1.2rem',
});

export const emptyMessageChipClassName = style([
  resultLabelChipClassName,
  {
    maxWidth: '100%',
  },
]);

export const errorToastClassName = style({
  width: 'fit-content',
  maxWidth: 'calc(100% - 2.4rem)',
  margin: '1.2rem auto',
});
