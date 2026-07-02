import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { textButton } from './TextButton.css';

type NativeButtonProps = ComponentPropsWithoutRef<'button'>;
type TextButtonVariantProps = RecipeVariantProps<typeof textButton>;

export type TextButtonProps = NativeButtonProps & TextButtonVariantProps;

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ children, className, tone = 'default', type = 'button', ...props }, ref) => {
    return (
      <button ref={ref} className={cn(textButton({ tone }), className)} type={type} {...props}>
        {children}
      </button>
    );
  },
);

TextButton.displayName = 'TextButton';
