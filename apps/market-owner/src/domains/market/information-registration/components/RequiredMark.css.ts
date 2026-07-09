import { style } from '@vanilla-extract/css';

import { semantic, typography } from '@dongchimi/design-system/tokens';

export const requiredMarkClassName = style({
  color: semantic.primary.strong,
  ...typography['body-2-regular'],
});
