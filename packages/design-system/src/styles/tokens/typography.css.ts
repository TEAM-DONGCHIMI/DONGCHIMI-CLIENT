import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  fontFamily: '"Pretendard", sans-serif',
  fontStyle: 'normal',
});

export const text = styleVariants({
  'display-1-bold': [
    base,
    { fontSize: 56, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-1px' },
  ],
  'display-2-medium': [
    base,
    { fontSize: 40, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-1px' },
  ],

  'title-1-semibold': [
    base,
    { fontSize: 32, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-1px' },
  ],
  'title-1-medium': [
    base,
    { fontSize: 32, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-1px' },
  ],
  'title-2-bold': [base, { fontSize: 28, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-1px' }],
  'title-2-medium': [
    base,
    { fontSize: 28, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-1px' },
  ],

  'heading-1-semibold': [
    base,
    { fontSize: 24, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-1-medium': [
    base,
    { fontSize: 24, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-1-regular': [
    base,
    { fontSize: 24, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-2-semibold': [
    base,
    { fontSize: 22, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-2-medium': [
    base,
    { fontSize: 22, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-2-regular': [
    base,
    { fontSize: 22, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-3-semibold': [
    base,
    { fontSize: 20, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-3-medium': [
    base,
    { fontSize: 20, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'heading-3-regular': [
    base,
    { fontSize: 20, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],

  'body-1-semibold': [
    base,
    { fontSize: 16, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'body-1-medium': [
    base,
    { fontSize: 16, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'body-1-regular': [
    base,
    { fontSize: 16, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'body-2-semibold': [
    base,
    { fontSize: 14, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'body-2-medium': [
    base,
    { fontSize: 14, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'body-2-regular': [
    base,
    { fontSize: 14, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],

  'caption-1-regular': [
    base,
    { fontSize: 12, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'caption-1-light': [
    base,
    { fontSize: 12, fontWeight: 300, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'caption-2-regular': [
    base,
    { fontSize: 10, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
  'caption-2-light': [
    base,
    { fontSize: 10, fontWeight: 300, lineHeight: 1.4, letterSpacing: '-2px' },
  ],
});
