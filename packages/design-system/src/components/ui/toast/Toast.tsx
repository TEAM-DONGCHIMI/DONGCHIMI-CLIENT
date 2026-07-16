import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { IcCircleCheckFill, IcCircleExclamation } from '../../../icons';
import { cn } from '../../../styles/class-name';
import * as S from './Toast.css';

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

const getDefaultIcon = (status: ToastStatusTypes) => {
  return status === 'error' ? (
    <IcCircleExclamation className={S.toastErrorIconClassName} data-testid='toast-error-icon' />
  ) : (
    <IcCircleCheckFill data-testid='toast-completed-icon' />
  );
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
  const resolvedAriaLive = ariaLive ?? getDefaultAriaLive(status);
  const resolvedIcon = icon === undefined ? getDefaultIcon(status) : icon;

  return (
    <div
      ref={ref}
      aria-live={resolvedAriaLive}
      className={cn(S.toast({ status }), className)}
      role={resolvedRole}
      {...props}
    >
      {resolvedIcon != null && resolvedIcon !== false && (
        <span aria-hidden='true' className={S.toastIconClassName}>
          {resolvedIcon}
        </span>
      )}
      <span className={S.toastMessageClassName}>{children}</span>
    </div>
  );
};

Toast.displayName = 'Toast';
