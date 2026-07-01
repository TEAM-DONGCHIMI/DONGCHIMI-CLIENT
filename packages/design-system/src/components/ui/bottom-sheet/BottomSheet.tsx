'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import * as S from './BottomSheet.css';

const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'textarea:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type BottomSheetOpenProps =
  | {
      defaultOpen?: boolean;
      open?: never;
    }
  | {
      defaultOpen?: never;
      open: boolean;
    };

export type BottomSheetProps = BottomSheetOpenProps & {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type BottomSheetTriggerProps = ComponentPropsWithRef<'button'>;
export type BottomSheetContentProps = Omit<ComponentPropsWithRef<'dialog'>, 'open'>;
export type BottomSheetHandleProps = ComponentPropsWithRef<'div'>;
export type BottomSheetHeaderProps = ComponentPropsWithRef<'div'>;
export type BottomSheetTitleProps = ComponentPropsWithRef<'h2'>;
export type BottomSheetDescriptionProps = ComponentPropsWithRef<'p'>;
export type BottomSheetBodyProps = ComponentPropsWithRef<'div'>;
export type BottomSheetFooterProps = ComponentPropsWithRef<'div'>;
export type BottomSheetCloseProps = ComponentPropsWithRef<'button'>;

interface BottomSheetContextValues {
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

const BottomSheetContext = createContext<BottomSheetContextValues | null>(null);

const useBottomSheetContext = (componentName: string) => {
  const context = useContext(BottomSheetContext);

  if (context == null) {
    throw new Error(`${componentName} must be used within <BottomSheet>.`);
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

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

interface UseBottomSheetDialogEffectsOptions {
  contentRef: RefObject<HTMLDialogElement | null>;
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

const useBottomSheetDialogEffects = ({
  contentRef,
  open,
  triggerRef,
}: UseBottomSheetDialogEffectsOptions) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement = document.activeElement;
    const triggerElement = triggerRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      contentRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = originalOverflow;

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
        return;
      }

      triggerElement?.focus();
    };
  }, [contentRef, open, triggerRef]);
};

const BottomSheetRoot = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open,
}: BottomSheetProps) => {
  const generatedId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [descriptionElementId, registerDescriptionElement] =
    useRegisteredElementId<HTMLParagraphElement>();
  const [titleElementId, registerTitleElement] = useRegisteredElementId<HTMLHeadingElement>();
  const isControlled = open != null;
  const currentOpen = open ?? internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === currentOpen) {
        return;
      }

      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [currentOpen, isControlled, onOpenChange],
  );

  const contextValue = useMemo<BottomSheetContextValues>(
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

  return <BottomSheetContext.Provider value={contextValue}>{children}</BottomSheetContext.Provider>;
};

const BottomSheetTrigger = ({
  children,
  className,
  disabled,
  onClick,
  ref,
  type = 'button',
  ...props
}: BottomSheetTriggerProps) => {
  const { setOpen, triggerRef } = useBottomSheetContext('BottomSheet.Trigger');

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

const BottomSheetContent = ({
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  onKeyDown,
  ref,
  ...props
}: BottomSheetContentProps) => {
  const { descriptionElementId, open, setOpen, titleElementId, triggerRef } =
    useBottomSheetContext('BottomSheet.Content');
  const contentRef = useRef<HTMLDialogElement>(null);

  useBottomSheetDialogEffects({ contentRef, open, triggerRef });

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

  return createPortal(
    <div className={S.overlayClassName}>
      <button
        aria-label='바텀시트 닫기'
        className={S.backdropClassName}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        type='button'
      />
      <dialog
        {...props}
        ref={composeRefs(contentRef, ref)}
        aria-describedby={ariaDescribedBy ?? descriptionElementId}
        aria-labelledby={ariaLabelledBy ?? titleElementId}
        aria-modal='true'
        className={cn(S.contentClassName, className)}
        onKeyDown={handleKeyDown}
        open
        tabIndex={-1}
      >
        {children}
      </dialog>
    </div>,
    document.body,
  );
};

const BottomSheetHandle = ({ className, ref, ...props }: BottomSheetHandleProps) => {
  return (
    <div ref={ref} aria-hidden='true' className={cn(S.handleClassName, className)} {...props} />
  );
};

const BottomSheetHeader = ({ className, ref, ...props }: BottomSheetHeaderProps) => {
  return <div ref={ref} className={cn(S.headerClassName, className)} {...props} />;
};

const BottomSheetTitle = ({ children, className, ref, ...props }: BottomSheetTitleProps) => {
  const { registerTitleElement, titleId } = useBottomSheetContext('BottomSheet.Title');
  const composedRef = useMemo(
    () => composeRefs(registerTitleElement, ref),
    [registerTitleElement, ref],
  );

  return (
    <h2 ref={composedRef} className={cn(S.titleClassName, className)} id={titleId} {...props}>
      {children}
    </h2>
  );
};

const BottomSheetDescription = ({ className, ref, ...props }: BottomSheetDescriptionProps) => {
  const { descriptionId, registerDescriptionElement } =
    useBottomSheetContext('BottomSheet.Description');
  const composedRef = useMemo(
    () => composeRefs(registerDescriptionElement, ref),
    [registerDescriptionElement, ref],
  );

  return (
    <p
      ref={composedRef}
      className={cn(S.descriptionClassName, className)}
      id={descriptionId}
      {...props}
    />
  );
};

const BottomSheetBody = ({ className, ref, ...props }: BottomSheetBodyProps) => {
  return <div ref={ref} className={cn(S.bodyClassName, className)} {...props} />;
};

const BottomSheetFooter = ({ className, ref, ...props }: BottomSheetFooterProps) => {
  return <div ref={ref} className={cn(S.footerClassName, className)} {...props} />;
};

const BottomSheetClose = ({
  children,
  className,
  disabled,
  onClick,
  ref,
  type = 'button',
  ...props
}: BottomSheetCloseProps) => {
  const { setOpen } = useBottomSheetContext('BottomSheet.Close');

  return (
    <button
      {...props}
      ref={ref}
      className={cn(S.closeClassName, className)}
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

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Body: BottomSheetBody,
  Close: BottomSheetClose,
  Content: BottomSheetContent,
  Description: BottomSheetDescription,
  Footer: BottomSheetFooter,
  Handle: BottomSheetHandle,
  Header: BottomSheetHeader,
  Root: BottomSheetRoot,
  Title: BottomSheetTitle,
  Trigger: BottomSheetTrigger,
});
