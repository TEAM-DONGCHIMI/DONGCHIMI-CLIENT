import { forwardRef, type ReactNode } from 'react';

import { ChipBase, type NativeSpanProps } from './ChipBase';

export interface StatusChipProps extends NativeSpanProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rounded?: boolean;
  status: 'error' | 'success';
}

const colorByStatus = {
  error: 'negative',
  success: 'primary',
} as const;

const variantByStatus = {
  error: 'outlined',
  success: 'soft',
} as const;

export const StatusChip = forwardRef<HTMLSpanElement, StatusChipProps>(
  ({ children, className, leftIcon, rounded = true, status, ...nativeProps }, ref) => {
    return (
      <ChipBase
        ref={ref}
        className={className}
        color={colorByStatus[status]}
        leftIcon={leftIcon}
        rounded={rounded}
        size='status'
        variant={variantByStatus[status]}
        {...nativeProps}
      >
        {children}
      </ChipBase>
    );
  },
);

StatusChip.displayName = 'StatusChip';
