import { createGlobalTheme } from '@vanilla-extract/css';

export const semantic = createGlobalTheme(':root', {
  primary: {
    normal: '#15C47E',
    strong: '#028450',
    light: '#E6FAF2',
  },
  status: {
    positive: '#0066FF',
    cautionary: '#FF9200',
    negative: '#FF4242',
  },
  overlay: {
    dimmer: 'rgba(25, 31, 40, 0.55)',
  },
});
