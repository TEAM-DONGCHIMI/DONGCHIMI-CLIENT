import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { toast, toastIconClassName, toastMessageClassName } from './Toast.css';

type ToastStatusTypes = 'completed' | 'error';

type NativeToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'color'>;

export interface ToastProps extends NativeToastProps {
  children: ReactNode;
  icon?: ReactNode;
  status?: ToastStatusTypes;
}

const getDefaultRole = (status: ToastStatusTypes) => {
  return status === 'error' ? 'alert' : 'status';
};

const getDefaultAriaLive = (status: ToastStatusTypes) => {
  return status === 'error' ? 'assertive' : 'polite';
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { 'aria-live': ariaLive, children, className, icon, role, status = 'completed', ...props },
    ref,
  ) => {
    const resolvedRole = role ?? getDefaultRole(status);
    const resolvedAriaLive = ariaLive ?? (role == null ? getDefaultAriaLive(status) : undefined);

    return (
      <div
        ref={ref}
        aria-live={resolvedAriaLive}
        className={cn(toast({ status }), className)}
        role={resolvedRole}
        {...props}
      >
        {icon != null && (
          <span aria-hidden='true' className={toastIconClassName}>
            {icon}
          </span>
        )}
        <span className={toastMessageClassName}>{children}</span>
      </div>
    );
  },
);

Toast.displayName = 'Toast';
