/* eslint-disable @next/next/no-img-element */
import { forwardRef, type ImgHTMLAttributes } from 'react';

interface StaticImageDataProps {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

type StorybookImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | StaticImageDataProps;
  fill?: boolean;
  loader?: unknown;
  priority?: boolean;
  quality?: number | `${number}`;
  unoptimized?: boolean;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty' | `data:image/${string}`;
  onLoadingComplete?: (image: HTMLImageElement) => void;
};

const Image = forwardRef<HTMLImageElement, StorybookImageProps>(function Image(
  {
    src,
    fill,
    loader,
    priority,
    quality,
    unoptimized,
    blurDataURL,
    placeholder,
    onLoadingComplete,
    style,
    alt = '',
    ...props
  },
  ref,
) {
  void loader;
  void priority;
  void quality;
  void unoptimized;
  void blurDataURL;
  void placeholder;

  const imageSrc = typeof src === 'string' ? src : src.src;
  const imageWidth = props.width ?? (typeof src === 'string' ? undefined : src.width);
  const imageHeight = props.height ?? (typeof src === 'string' ? undefined : src.height);

  return (
    <img
      {...props}
      ref={ref}
      src={imageSrc}
      alt={alt}
      width={fill ? undefined : imageWidth}
      height={fill ? undefined : imageHeight}
      style={{
        ...style,
        ...(fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }
          : undefined),
      }}
      onLoad={(event) => {
        props.onLoad?.(event);
        onLoadingComplete?.(event.currentTarget);
      }}
    />
  );
});

export default Image;
