'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../../styles';
import * as S from './Dialog.css';

const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'textarea:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let bodyScrollLockCount = 0;
let originalBodyOverflow = '';

type DialogOpenProps =
  | {
      defaultOpen?: boolean;
      open?: never;
    }
  | {
      defaultOpen?: never;
      open: boolean;
    };

export type DialogProps = DialogOpenProps & {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type DialogTriggerProps = ComponentPropsWithRef<'button'>;
export type DialogContentProps = Omit<ComponentPropsWithRef<'dialog'>, 'open'>;
export type DialogTitleProps = ComponentPropsWithRef<'h2'>;
export type DialogDescriptionProps = ComponentPropsWithRef<'p'>;
export type DialogCloseProps = ComponentPropsWithRef<'button'>;

interface DialogContextValues {
  descriptionId: string;
  descriptionElementId?: string;
  open: boolean;
  registerDescriptionElement: (element: HTMLParagraphElement | null) => void;
  registerTitleElement: (element: HTMLHeadingElement | null) => void;
  setOpen: (open: boolean) => void;
  titleId: string;
  titleElementId?: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const DialogContext = createContext<DialogContextValues | null>(null);

const useDialogContext = (componentName: string) => {
  const context = useContext(DialogContext);

  if (context == null) {
    throw new Error(`${componentName} must be used within <Dialog>.`);
  }

  return context;
};

const setRef = <ElementTypes,>(ref: Ref<ElementTypes> | undefined, value: ElementTypes | null) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref != null) {
    ref.current = value;
  }
};

const composeRefs = <ElementTypes,>(...refs: (Ref<ElementTypes> | undefined)[]) => {
  return (value: ElementTypes | null) => {
    refs.forEach((ref) => setRef(ref, value));
  };
};

const getFocusableElements = (element: HTMLElement) => {
  return Array.from(element.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (candidate) => {
      return (
        !candidate.hasAttribute('disabled') && candidate.getAttribute('aria-hidden') !== 'true'
      );
    },
  );
};

const lockBodyScroll = () => {
  if (bodyScrollLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  bodyScrollLockCount += 1;

  return () => {
    bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

    if (bodyScrollLockCount === 0) {
      document.body.style.overflow = originalBodyOverflow;
      originalBodyOverflow = '';
    }
  };
};

const showModalDialog = (dialog: HTMLDialogElement) => {
  if (dialog.open || !dialog.isConnected) {
    return;
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    return;
  }

  dialog.setAttribute('open', '');
};

const closeModalDialog = (dialog: HTMLDialogElement) => {
  if (!dialog.open) {
    return;
  }

  if (typeof dialog.close === 'function') {
    dialog.close();
    return;
  }

  dialog.removeAttribute('open');
};

const isOutsideDialogRect = (dialog: HTMLDialogElement, clientX: number, clientY: number) => {
  const { bottom, left, right, top } = dialog.getBoundingClientRect();

  return clientX < left || clientX > right || clientY < top || clientY > bottom;
};

const keepFocusInside = (event: KeyboardEvent<HTMLDialogElement>) => {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getFocusableElements(event.currentTarget);

  if (focusableElements.length === 0) {
    event.preventDefault();
    event.currentTarget.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const isOnContainerOrFirst =
    document.activeElement === event.currentTarget || document.activeElement === firstElement;

  if (event.shiftKey && isOnContainerOrFirst) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

interface UseDialogEffectsOptions {
  contentRef: RefObject<HTMLDialogElement | null>;
  onBackdropMouseDown: () => void;
  open: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const useRegisteredElementId = <ElementTypes extends HTMLElement>() => {
  const [elementId, setElementId] = useState<string>();

  const registerElement = useCallback((element: ElementTypes | null) => {
    const nextElementId = element?.id;
    setElementId((currentElementId) => {
      return currentElementId === nextElementId ? currentElementId : nextElementId;
    });
  }, []);

  return [elementId, registerElement] as const;
};

const useDialogEffects = ({
  contentRef,
  onBackdropMouseDown,
  open,
  triggerRef,
}: UseDialogEffectsOptions) => {
  const handleBackdropMouseDown = useEffectEvent(onBackdropMouseDown);

  useEffect(() => {
    if (!open) {
      return;
    }

    const dialog = contentRef.current;

    if (dialog == null) {
      return;
    }

    const previousActiveElement = document.activeElement;
    const triggerElement = triggerRef.current;
    const unlockBodyScroll = lockBodyScroll();
    const handleDialogMouseDown = (event: globalThis.MouseEvent) => {
      if (isOutsideDialogRect(dialog, event.clientX, event.clientY)) {
        handleBackdropMouseDown();
      }
    };

    showModalDialog(dialog);
    dialog.addEventListener('mousedown', handleDialogMouseDown);
    window.requestAnimationFrame(() => {
      const currentDialog = contentRef.current;

      if (currentDialog == null) {
        return;
      }

      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLElement && currentDialog.contains(activeElement)) {
        return;
      }

      const [firstFocusableElement] = getFocusableElements(currentDialog);
      firstFocusableElement?.focus();

      if (firstFocusableElement == null) {
        currentDialog.focus();
      }
    });

    return () => {
      dialog.removeEventListener('mousedown', handleDialogMouseDown);
      unlockBodyScroll();
      closeModalDialog(dialog);

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
        return;
      }

      triggerElement?.focus();
    };
  }, [contentRef, open, triggerRef]);
};

const DialogRoot = ({ children, defaultOpen = false, onOpenChange, open }: DialogProps) => {
  const generatedId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [descriptionElementId, registerDescriptionElement] =
    useRegisteredElementId<HTMLParagraphElement>();
  const [titleElementId, registerTitleElement] = useRegisteredElementId<HTMLHeadingElement>();
  const isControlled = open != null;
  const currentOpen = open ?? internalOpen;
  const currentOpenRef = useRef(currentOpen);

  useEffect(() => {
    currentOpenRef.current = currentOpen;
  }, [currentOpen]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === currentOpenRef.current) {
        return;
      }

      currentOpenRef.current = nextOpen;

      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const contextValue = useMemo<DialogContextValues>(
    () => ({
      descriptionId: `${generatedId}-description`,
      descriptionElementId,
      open: currentOpen,
      registerDescriptionElement,
      registerTitleElement,
      setOpen,
      titleId: `${generatedId}-title`,
      titleElementId,
      triggerRef,
    }),
    [
      currentOpen,
      descriptionElementId,
      generatedId,
      registerDescriptionElement,
      registerTitleElement,
      setOpen,
      titleElementId,
    ],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

const DialogTrigger = ({
  children,
  className,
  disabled,
  onClick,
  ref,
  type = 'button',
  ...props
}: DialogTriggerProps) => {
  const { setOpen, triggerRef } = useDialogContext('Dialog.Trigger');

  return (
    <button
      {...props}
      ref={composeRefs(triggerRef, ref)}
      className={cn(className)}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !disabled) {
          setOpen(true);
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
};

const DialogContent = ({
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  onCancel,
  onClose,
  onKeyDown,
  ref,
  ...props
}: DialogContentProps) => {
  const { descriptionElementId, open, setOpen, titleElementId, triggerRef } =
    useDialogContext('Dialog.Content');
  const contentRef = useRef<HTMLDialogElement>(null);
  const handleBackdropMouseDown = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useDialogEffects({
    contentRef,
    onBackdropMouseDown: handleBackdropMouseDown,
    open,
    triggerRef,
  });

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    keepFocusInside(event);
  };

  const handleCancel: DialogContentProps['onCancel'] = (event) => {
    onCancel?.(event);

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    setOpen(false);
  };

  const handleClose: DialogContentProps['onClose'] = (event) => {
    onClose?.(event);

    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  return createPortal(
    <dialog
      {...props}
      ref={composeRefs(contentRef, ref)}
      aria-describedby={ariaDescribedBy ?? descriptionElementId}
      aria-labelledby={ariaLabelledBy ?? titleElementId}
      aria-modal='true'
      className={cn(S.contentClassName, className)}
      onCancel={handleCancel}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {children}
    </dialog>,
    document.body,
  );
};

const DialogTitle = ({ children, className, ref, ...props }: DialogTitleProps) => {
  const { registerTitleElement, titleId } = useDialogContext('Dialog.Title');
  const composedRef = useMemo(
    () => composeRefs(registerTitleElement, ref),
    [registerTitleElement, ref],
  );

  return (
    <h2 ref={composedRef} className={cn(className)} id={titleId} {...props}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ className, ref, ...props }: DialogDescriptionProps) => {
  const { descriptionId, registerDescriptionElement } = useDialogContext('Dialog.Description');
  const composedRef = useMemo(
    () => composeRefs(registerDescriptionElement, ref),
    [registerDescriptionElement, ref],
  );

  return <p ref={composedRef} className={cn(className)} id={descriptionId} {...props} />;
};

const DialogClose = ({
  children,
  className,
  disabled,
  onClick,
  ref,
  type = 'button',
  ...props
}: DialogCloseProps) => {
  const { setOpen } = useDialogContext('Dialog.Close');

  return (
    <button
      {...props}
      ref={ref}
      className={cn(className)}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !disabled) {
          setOpen(false);
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
};

export const Dialog = Object.assign(DialogRoot, {
  Close: DialogClose,
  Content: DialogContent,
  Description: DialogDescription,
  Root: DialogRoot,
  Title: DialogTitle,
  Trigger: DialogTrigger,
});
