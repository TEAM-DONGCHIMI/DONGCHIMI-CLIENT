import type { ComponentPropsWithRef } from 'react';

import { IcChevronDownSizeSmallColor50 } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './ProductCategoryTrigger.css';

interface ProductCategoryTriggerProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  label: string;
  placeholder?: boolean;
}

export const ProductCategoryTrigger = ({
  className,
  label,
  placeholder = false,
  type = 'button',
  ...props
}: ProductCategoryTriggerProps) => {
  return (
    <button className={cn(S.triggerClassName, className)} type={type} {...props}>
      <span className={placeholder ? S.placeholderClassName : undefined}>{label}</span>
      <IcChevronDownSizeSmallColor50 aria-hidden='true' />
    </button>
  );
};
