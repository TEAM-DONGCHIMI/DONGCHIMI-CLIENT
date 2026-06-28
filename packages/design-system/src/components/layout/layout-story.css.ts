import { style } from '@vanilla-extract/css';

export const storyCanvasClassName = style({
  width: 'min(100%, 48rem)',
});

export const storyPanelClassName = style({
  width: 'min(100%, 40rem)',
  minHeight: '12rem',
  border: '1px solid #d8dee8',
  borderRadius: '0.5rem',
  padding: '1rem',
  background: '#f8fafc',
});

export const storyNarrowPanelClassName = style({
  width: '18rem',
  border: '1px solid #d8dee8',
  borderRadius: '0.5rem',
  padding: '1rem',
  background: '#f8fafc',
});

export const storyBlockClassName = style({
  minWidth: '4rem',
  minHeight: '3rem',
  border: '1px solid #b8c3d6',
  borderRadius: '0.375rem',
  padding: '0.75rem',
  background: '#ffffff',
  color: '#1f2937',
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const storyAccentBlockClassName = style({
  minWidth: '4rem',
  minHeight: '3rem',
  border: '1px solid #8bb8a8',
  borderRadius: '0.375rem',
  padding: '0.75rem',
  background: '#ecfdf5',
  color: '#134e4a',
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const storyChipClassName = style({
  border: '1px solid #b8c3d6',
  borderRadius: '999px',
  padding: '0.375rem 0.75rem',
  background: '#ffffff',
  color: '#1f2937',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
});

export const storySurfaceClassName = style({
  border: '1px dashed #94a3b8',
  borderRadius: '0.5rem',
  padding: '1rem',
  background: '#ffffff',
});
