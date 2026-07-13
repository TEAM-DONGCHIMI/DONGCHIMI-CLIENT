import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const imageColumnClassName = style({
  width: '24rem',
  flexShrink: 0,
  gap: '1rem',
});

export const imageUploadInputClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const imageUploadButtonClassName = style({
  appearance: 'none',
  position: 'relative',
  display: 'flex',
  width: '24rem',
  height: '19rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  border: `0.1rem dashed ${atomic.neutral[40]}`,
  borderRadius: '1.2rem',
  backgroundColor: atomic.neutral[20],
  color: atomic.neutral[70],
  cursor: 'pointer',
  overflow: 'hidden',
  selectors: {
    [`${imageUploadInputClassName}:focus-visible + &`]: {
      outline: `0.3rem solid color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`,
      outlineOffset: '0.2rem',
    },
  },
});

export const imagePreviewClassName = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const imageUploadCameraButtonClassName = style({
  position: 'absolute',
  top: '1.2rem',
  right: '1.2rem',
  width: '4rem',
  minWidth: '4rem',
  height: '4rem',
  padding: '1rem',
  borderRadius: '100%',
});

export const imageUploadCameraIconClassName = style({
  display: 'block',
  width: '2rem',
  height: '2rem',
});

export const imageUploadIconClassName = style({
  width: '2.4rem',
  height: '2.4rem',
});

export const imageUploadTextGroupClassName = style({
  display: 'flex',
  width: '20.6rem',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.8rem',
});

export const imageUploadTitleClassName = style({
  color: atomic.neutral[70],
  textAlign: 'center',
  ...typography['body-2-semibold'],
});

export const imageUploadDescriptionClassName = style({
  color: atomic.neutral[60],
  textAlign: 'center',
  ...typography['caption-1-regular'],
});

export const imageGuideClassName = style({
  color: atomic.neutral[50],
  textAlign: 'center',
  ...typography['caption-1-regular'],
});
