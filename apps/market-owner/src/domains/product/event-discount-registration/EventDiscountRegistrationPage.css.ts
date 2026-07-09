import { globalStyle, style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

import * as uploadModalStyles from '@/shared/components/ui/upload-modal/UploadModal.css';

const toClassSelector = (classNames: string) => {
  return classNames
    .split(' ')
    .filter(Boolean)
    .map((className) => `.${className}`)
    .join('');
};

const uploadModalDefaultBodySelector = toClassSelector(
  uploadModalStyles.bodyRecipe({ state: 'default' }),
);
const uploadModalUploadBodySelector = toClassSelector(
  uploadModalStyles.bodyRecipe({ state: 'upload' }),
);

export const pageRootClassName = style({
  position: 'relative',
  display: 'flex',
  minHeight: '100dvh',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: 0,
  backgroundColor: atomic.neutral[10],
});

export const pageHeaderClassName = style({
  minHeight: '2rem',
  padding: 0,
  backgroundColor: 'transparent',
});

export const excelUploadModalClassName = style({
  '@media': {
    'screen and (max-width: 480px)': {
      maxWidth: 'calc(100vw - 1.6rem)',
    },
  },
});

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.containerClassName}`, {
  '@media': {
    'screen and (max-width: 640px)': {
      gap: '2.8rem',
      padding: '2.4rem 2rem',
    },
  },
});

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.titleClassName}`, {
  width: 'min(22.8rem, 100%)',
});

globalStyle(`${excelUploadModalClassName} ${uploadModalDefaultBodySelector}`, {
  minHeight: '16rem',
  padding: '3.2rem 2rem',
  '@media': {
    'screen and (max-width: 640px)': {
      minHeight: '14.8rem',
      padding: '2.8rem 1.6rem',
    },
  },
});

globalStyle(`${excelUploadModalClassName} ${uploadModalUploadBodySelector}`, {
  minHeight: '16rem',
  padding: '3.2rem 2rem',
  '@media': {
    'screen and (max-width: 640px)': {
      minHeight: '14.8rem',
      padding: '2.8rem 1.6rem',
    },
  },
});

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.fileSelectControlClassName}`, {
  position: 'relative',
  gap: 0,
});

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.fileSelectTooltipClassName}`, {
  position: 'absolute',
  top: 'calc(100% + 0.8rem)',
  left: '50%',
  zIndex: 1,
  minHeight: '3.6rem',
  maxWidth: 'calc(100vw - 6.4rem)',
  padding: '0 1.4rem',
  backgroundColor: atomic.neutral[70],
  fontSize: '1.4rem',
  fontWeight: 500,
  lineHeight: 1.4,
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
});

globalStyle(
  `${excelUploadModalClassName} .${uploadModalStyles.fileSelectTooltipClassName}::before`,
  {
    backgroundColor: atomic.neutral[70],
  },
);

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.footerClassName}`, {
  flexWrap: 'wrap',
});

globalStyle(`${excelUploadModalClassName} .${uploadModalStyles.footerButtonClassName}`, {
  maxWidth: '100%',
  flex: '1 1 16rem',
});
