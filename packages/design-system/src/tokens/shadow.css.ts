import { createGlobalTheme } from '@vanilla-extract/css';

export const shadow = createGlobalTheme(':root', {
  normal: {
    small: '0px 0px 30px rgba(23, 23, 23, 0.05)',
    medium: '0px 0px 60px rgba(23, 23, 23, 0.1)',
  },
});
