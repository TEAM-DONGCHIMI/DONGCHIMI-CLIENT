import { forwardRef, type ReactNode } from 'react';

import { ChipBase, type NativeSpanProps } from './ChipBase';

export interface PointChipProps extends NativeSpanProps {
  children: ReactNode;
  rounded?: boolean;
  size?: 'desktop' | 'mobile';
}

const chipSizeByPointSize = {
  desktop: 'pointDesktop',
  mobile: 'pointMobile',
} as const;

export const PointChip = forwardRef<HTMLSpanElement, PointChipProps>(
  ({ children, className, rounded = true, size = 'desktop', ...nativeProps }, ref) => {
    return (
      <ChipBase
        ref={ref}
        className={className}
        rounded={rounded}
        size={chipSizeByPointSize[size]}
        variant='point'
        {...nativeProps}
      >
        {children}
      </ChipBase>
    );
  },
);

PointChip.displayName = 'PointChip';
