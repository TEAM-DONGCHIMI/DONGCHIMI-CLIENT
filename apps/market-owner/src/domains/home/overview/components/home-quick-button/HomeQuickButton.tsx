import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './HomeQuickButton.css';

export interface HomeQuickButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  description: string;
  label: string;
  visual?: ReactNode;
}

export const HomeQuickButton = ({
  className,
  description,
  label,
  type = 'button',
  visual,
  ...props
}: HomeQuickButtonProps) => {
  return (
    <button className={cn(S.buttonClassName, className)} type={type} {...props}>
      <span className={S.textClassName}>
        <strong className={S.labelClassName}>{label}</strong>
        <span className={S.descriptionClassName}>{description}</span>
      </span>
      <span aria-hidden='true' className={S.visualSlotClassName}>
        {visual}
      </span>
    </button>
  );
};
