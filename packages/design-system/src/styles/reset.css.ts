import { globalStyle } from '@vanilla-extract/css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('*', {
  margin: 0,
});

globalStyle('html', {
  WebkitTextSizeAdjust: '100%',
  tabSize: 4,
});

globalStyle('html, body', {
  height: '100%',
});

globalStyle('body', {
  lineHeight: 1.5,
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

globalStyle('input, button, textarea, select', {
  color: 'inherit',
  font: 'inherit',
});

globalStyle('input, textarea, select', {
  borderRadius: 0,
});

globalStyle('button', {
  padding: 0,
  border: 'none',
  background: 'none',
});

globalStyle('button:enabled', {
  cursor: 'pointer',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('ul, ol', {
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

globalStyle('p, h1, h2, h3, h4, h5, h6', {
  font: 'inherit',
});

globalStyle('p, h1, h2, h3, h4, h5, h6', {
  overflowWrap: 'break-word',
});

globalStyle('table', {
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

globalStyle('fieldset', {
  margin: 0,
  padding: 0,
  border: 0,
});

globalStyle('legend', {
  padding: 0,
});

globalStyle('dialog', {
  padding: 0,
  border: 'none',
});
