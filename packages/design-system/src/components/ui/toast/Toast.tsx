import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import {
  toast,
  toastDefaultIconClassName,
  toastIconClassName,
  toastMessageClassName,
} from './Toast.css';

type ToastStatusTypes = 'completed' | 'error';

type NativeToastProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'color'>;

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

export const Toast = ({
  'aria-live': ariaLive,
  children,
  className,
  icon,
  ref,
  role,
  status = 'completed',
  ...props
}: ToastProps) => {
  const resolvedRole = role ?? getDefaultRole(status);
  const resolvedAriaLive = ariaLive ?? (role == null ? getDefaultAriaLive(status) : undefined);
  const resolvedIcon = icon === undefined ? <span className={toastDefaultIconClassName} /> : icon;

  return (
    <div
      ref={ref}
      aria-live={resolvedAriaLive}
      className={cn(toast({ status }), className)}
      role={resolvedRole}
      {...props}
    >
      {resolvedIcon != null && resolvedIcon !== false && (
        <span aria-hidden='true' className={toastIconClassName}>
          {resolvedIcon}
        </span>
      )}
      <span className={toastMessageClassName}>{children}</span>
    </div>
  );
};

Toast.displayName = 'Toast';
