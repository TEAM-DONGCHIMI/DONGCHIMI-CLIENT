// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- keep package asset declarations visible to consumer tsconfigs.
/// <reference path="../types/assets.d.ts" />

import { globalFontFace, globalStyle } from '@vanilla-extract/css';

import pretendardVariableFontUrl from '../assets/fonts/pretendard/PretendardVariable.woff2';

const pretendardFontFamily =
  '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

globalFontFace('Pretendard', {
  src: `url("${pretendardVariableFontUrl}") format("woff2-variations")`,
  fontDisplay: 'swap',
  fontStyle: 'normal',
  fontWeight: '100 900',
});

globalStyle('html, body', {
  fontFamily: pretendardFontFamily,
});
