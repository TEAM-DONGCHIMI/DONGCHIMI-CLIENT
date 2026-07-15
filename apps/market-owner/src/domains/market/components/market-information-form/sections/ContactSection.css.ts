import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

const contactLabelColumnWidth = '10.8rem';

export const sectionGridClassName = style({
  display: 'grid',
  gridRow: 'span 2',
  gridTemplateRows: 'subgrid',
  rowGap: '3.2rem',
  '@media': {
    'screen and (max-width: 860px)': {
      gridRow: 'auto',
      gridTemplateRows: 'none',
    },
  },
});

export const inlineFieldClassName = style({
  display: 'grid',
  gridTemplateColumns: `${contactLabelColumnWidth} minmax(0, 1fr)`,
  gap: '1.2rem',
  alignItems: 'start',
});

export const inlineLabelClassName = style({
  display: 'inline-flex',
  minHeight: '4.8rem',
  alignItems: 'center',
  gap: '0.4rem',
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
  ...typography['body-3-semibold'],
});

export const phoneLabelClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const requiredLabelGroupClassName = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
});

export const addableFieldClassName = style({
  minWidth: 0,
});

export const fieldSlotClassName = style({
  height: '7rem',
  overflow: 'hidden',
});

export const marketPhoneRowsClassName = style({
  display: 'grid',
  alignContent: 'start',
  gap: '1.2rem',
});

export const ownerPhoneRowsClassName = style({
  display: 'grid',
  minWidth: 0,
  height: '7rem',
  overflow: 'hidden',
  gap: '1.2rem',
});
