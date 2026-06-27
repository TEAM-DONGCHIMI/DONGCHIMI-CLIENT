import { globalStyle } from '@vanilla-extract/css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('*', {
  margin: 0,
});

globalStyle('html, body', {
  height: '100%',
});

globalStyle('body', {
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
});

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

globalStyle('input, button, textarea, select', {
  font: 'inherit',
});

globalStyle('button', {
  padding: 0,
  border: 'none',
  background: 'none',
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
  overflowWrap: 'break-word',
});
