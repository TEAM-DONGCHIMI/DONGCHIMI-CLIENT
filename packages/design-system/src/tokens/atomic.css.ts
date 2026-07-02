import { createGlobalTheme } from '@vanilla-extract/css';

export const atomic = createGlobalTheme(':root', {
  common: {
    0: '#FFFFFF',
    100: '#000000',
  },
  neutral: {
    5: '#F9FAFB',
    10: '#F2F4F6',
    20: '#E5E8EB',
    30: '#D1D6DB',
    40: '#B0B8C1',
    50: '#8B95A1',
    60: '#6B7684',
    70: '#4E5968',
    80: '#333D4B',
    90: '#191F28',
  },
});
