'use client';

import { Toast, type ToastProps } from '@dongchimi/design-system';
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import * as S from './ToastViewport.css';

export type ToastStatusTypes = NonNullable<ToastProps['status']>;
export type ToastPlacementTypes = keyof typeof S.toastViewportPlacementClassNameMap;
export type ToastIdTypes = string;

export type ToastViewportOffsetTypes =
  | string
  | Readonly<{
      x?: string;
      y?: string;
    }>;

export interface ToastShowOptions {
  durationMs?: number | null;
  icon?: ReactNode;
  id?: ToastIdTypes;
  message: ReactNode;
  status?: ToastStatusTypes;
}

export type ToastShortcutOptionTypes = Omit<ToastShowOptions, 'message' | 'status'>;

export interface ToastActions {
  clear: () => void;
  completed: (message: ReactNode, options?: ToastShortcutOptionTypes) => ToastIdTypes;
  dismiss: (id: ToastIdTypes) => void;
  error: (message: ReactNode, options?: ToastShortcutOptionTypes) => ToastIdTypes;
  show: (options: ToastShowOptions) => ToastIdTypes;
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultDurationMs?: number | null;
  maxVisibleCount?: number;
  offset?: ToastViewportOffsetTypes;
  placement?: ToastPlacementTypes;
}

interface ToastEntry {
  durationMs: number | null;
  icon?: ReactNode;
  id: ToastIdTypes;
  message: ReactNode;
  phase: ToastPhaseTypes;
  revision: number;
  status: ToastStatusTypes;
}

type ToastPhaseTypes = 'dismissing' | 'visible';

type ToastActionTypes =
  | Readonly<{
      maxVisibleCount: number;
      toast: ToastEntry;
      type: 'add';
    }>
  | Readonly<{
      id: ToastIdTypes;
      type: 'dismiss';
    }>
  | Readonly<{
      id: ToastIdTypes;
      type: 'remove';
    }>
  | Readonly<{
      type: 'clear';
    }>;

type ToastViewportStyleTypes = CSSProperties & {
  '--toast-viewport-center-offset-x'?: string;
  '--toast-viewport-offset-x'?: string;
  '--toast-viewport-offset-y'?: string;
};

const TOAST_DEFAULT_DURATION_MS = 3000;
const TOAST_DEFAULT_MAX_VISIBLE_COUNT = 3;

const ToastContext = createContext<ToastActions | null>(null);

const getVisibleToasts = (toasts: ToastEntry[], maxVisibleCount: number) => {
  return toasts.slice(-maxVisibleCount);
};

const addToast = (toasts: ToastEntry[], toast: ToastEntry, maxVisibleCount: number) => {
  const hasSameToast = toasts.some(({ id }) => id === toast.id);

  if (!hasSameToast) {
    return getVisibleToasts([...toasts, toast], maxVisibleCount);
  }

  const nextToasts = toasts.map((currentToast) => {
    if (currentToast.id !== toast.id) {
      return currentToast;
    }

    return toast;
  });

  return getVisibleToasts(nextToasts, maxVisibleCount);
};

const dismissToast = (toasts: ToastEntry[], id: ToastIdTypes) => {
  return toasts.map((toast) => {
    if (toast.id !== id || toast.phase === 'dismissing') {
      return toast;
    }

    return {
      ...toast,
      phase: 'dismissing' as const,
    };
  });
};

const toastReducer = (toasts: ToastEntry[], action: ToastActionTypes) => {
  if (action.type === 'add') {
    return addToast(toasts, action.toast, action.maxVisibleCount);
  }

  if (action.type === 'dismiss') {
    return dismissToast(toasts, action.id);
  }

  if (action.type === 'remove') {
    return toasts.filter(({ id }) => id !== action.id);
  }

  if (action.type === 'clear') {
    return [];
  }

  return toasts;
};

const getSafeMaxVisibleCount = (maxVisibleCount: number) => {
  const flooredMaxVisibleCount = Math.floor(maxVisibleCount);

  if (!Number.isFinite(flooredMaxVisibleCount)) {
    return 1;
  }

  return Math.max(1, flooredMaxVisibleCount);
};

const resolveDurationMs = (
  durationMs: number | null | undefined,
  defaultDurationMs: number | null,
) => {
  if (durationMs !== undefined) {
    return durationMs;
  }

  return defaultDurationMs;
};

const getToastViewportStyle = (offset: ToastViewportOffsetTypes | undefined) => {
  if (offset === undefined) {
    return undefined;
  }

  const style: ToastViewportStyleTypes = {};

  if (typeof offset === 'string') {
    style['--toast-viewport-offset-x'] = offset;
    style['--toast-viewport-offset-y'] = offset;

    return style;
  }

  if (offset.x !== undefined) {
    style['--toast-viewport-center-offset-x'] = offset.x;
    style['--toast-viewport-offset-x'] = offset.x;
  }

  if (offset.y !== undefined) {
    style['--toast-viewport-offset-y'] = offset.y;
  }

  return style;
};

const getPortalContainer = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.body;
};

interface ToastViewportItemProps {
  onDismiss: (id: ToastIdTypes) => void;
  onRemove: (id: ToastIdTypes) => void;
  placement: ToastPlacementTypes;
  toast: ToastEntry;
}

const ToastViewportItem = ({ onDismiss, onRemove, placement, toast }: ToastViewportItemProps) => {
  useEffect(() => {
    if (toast.durationMs === null || toast.phase === 'dismissing') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onDismiss, toast.durationMs, toast.id, toast.phase, toast.revision]);

  useEffect(() => {
    if (toast.phase !== 'dismissing') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onRemove(toast.id);
    }, S.toastExitAnimationDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onRemove, toast.id, toast.phase]);

  return (
    <div
      className={S.toastViewportItemPhaseClassNameMap[placement][toast.phase]}
      data-toast-id={toast.id}
    >
      <Toast icon={toast.icon} status={toast.status}>
        {toast.message}
      </Toast>
    </div>
  );
};

export const ToastProvider = ({
  children,
  defaultDurationMs = TOAST_DEFAULT_DURATION_MS,
  maxVisibleCount = TOAST_DEFAULT_MAX_VISIBLE_COUNT,
  offset,
  placement = 'bottom-center',
}: ToastProviderProps) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const nextToastIdRef = useRef(0);
  const nextToastRevisionRef = useRef(0);
  const portalContainer = getPortalContainer();

  const dismiss = useCallback((id: ToastIdTypes) => {
    dispatch({ id, type: 'dismiss' });
  }, []);

  const remove = useCallback((id: ToastIdTypes) => {
    dispatch({ id, type: 'remove' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  const show = useCallback(
    ({ durationMs, icon, id, message, status = 'completed' }: ToastShowOptions) => {
      nextToastIdRef.current += 1;
      nextToastRevisionRef.current += 1;

      const toastId = id ?? `toast-${nextToastIdRef.current}`;

      dispatch({
        toast: {
          durationMs: resolveDurationMs(durationMs, defaultDurationMs),
          icon,
          id: toastId,
          message,
          phase: 'visible',
          revision: nextToastRevisionRef.current,
          status,
        },
        maxVisibleCount: getSafeMaxVisibleCount(maxVisibleCount),
        type: 'add',
      });

      return toastId;
    },
    [defaultDurationMs, maxVisibleCount],
  );

  const completed = useCallback(
    (message: ReactNode, options: ToastShortcutOptionTypes = {}) => {
      return show({ ...options, message, status: 'completed' });
    },
    [show],
  );

  const error = useCallback(
    (message: ReactNode, options: ToastShortcutOptionTypes = {}) => {
      return show({ ...options, message, status: 'error' });
    },
    [show],
  );

  const toastActions = useMemo<ToastActions>(
    () => ({
      clear,
      completed,
      dismiss,
      error,
      show,
    }),
    [clear, completed, dismiss, error, show],
  );

  const safeMaxVisibleCount = getSafeMaxVisibleCount(maxVisibleCount);
  const visibleToasts = getVisibleToasts(toasts, safeMaxVisibleCount);
  const viewportStyle = getToastViewportStyle(offset);
  const viewportClassName = S.toastViewportPlacementClassNameMap[placement];

  return (
    <ToastContext.Provider value={toastActions}>
      {children}
      {portalContainer !== null &&
        visibleToasts.length > 0 &&
        createPortal(
          <div
            aria-label='토스트 알림'
            className={viewportClassName}
            role='region'
            style={viewportStyle}
          >
            {visibleToasts.map((toast) => (
              <ToastViewportItem
                key={toast.id}
                onDismiss={dismiss}
                onRemove={remove}
                placement={placement}
                toast={toast}
              />
            ))}
          </div>,
          portalContainer,
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
};
