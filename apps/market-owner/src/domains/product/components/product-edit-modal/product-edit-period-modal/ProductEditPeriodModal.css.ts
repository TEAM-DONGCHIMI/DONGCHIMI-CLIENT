import { style } from '@vanilla-extract/css';

import * as Content from '../ProductEditModalContent.css';

export const contentClassName = Content.contentClassName;
export const containerClassName = Content.containerClassName;
export const titleClassName = Content.titleClassName;

export const sectionClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gridTemplateColumns: '17.2rem 1fr',
  columnGap: '7rem',
});

export const sectionTitleClassName = Content.sectionTitleClassName;

export const fieldGroupClassName = Content.fieldGroupClassName;
export const fieldLabelClassName = Content.fieldLabelClassName;

export const dateRowClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gridTemplateColumns: 'minmax(0, 1fr) max-content',
  columnGap: '0.8rem',
});

export const dateRangeClassName = Content.dateRangeClassName;
export const dateDividerClassName = Content.dateDividerClassName;

export const dateFieldClassName = style([
  Content.dateFieldLabelClassName,
  {
    width: '100%',
    minWidth: 0,
  },
]);

export const periodToggleButtonClassName = Content.periodToggleButtonClassName;
export const footerClassName = Content.footerClassName;
export const footerButtonClassName = Content.footerButtonClassName;
