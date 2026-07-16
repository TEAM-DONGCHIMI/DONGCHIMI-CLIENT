import type { ImageProps } from 'next/image';

export const hasDisplayableImageSrc = (
  imageSrc: ImageProps['src'] | null | undefined,
): imageSrc is ImageProps['src'] => {
  return imageSrc != null && (typeof imageSrc !== 'string' || imageSrc.length > 0);
};
