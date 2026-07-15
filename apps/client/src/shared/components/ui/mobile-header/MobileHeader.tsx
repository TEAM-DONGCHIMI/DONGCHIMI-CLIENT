import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import { logoClassName, mobileHeaderClassName, titleClassName } from './MobileHeader.css';
import { MobileHeaderBackButton, type MobileHeaderBackButtonProps } from './MobileHeaderBackButton';

export type MobileHeaderProps = ComponentPropsWithoutRef<'header'>;

type MobileHeaderTitleProps<TElement extends ElementType = 'h1'> = {
  as?: TElement;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children'>;

type MobileHeaderLogoProps = ComponentPropsWithoutRef<'div'>;

interface MobileHeaderCompound {
  BackButton: (props: MobileHeaderBackButtonProps) => ReactNode;
  Logo: typeof MobileHeaderLogo;
  Title: typeof MobileHeaderTitle;
}

const MobileHeaderRoot = forwardRef<HTMLElement, MobileHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <header ref={ref} className={cn(mobileHeaderClassName, className)} {...props}>
        {children}
      </header>
    );
  },
);

const MobileHeaderTitle = <TElement extends ElementType = 'h1'>({
  as,
  children,
  className,
  ...props
}: MobileHeaderTitleProps<TElement>) => {
  const Component = as ?? 'h1';

  return (
    <Component className={cn(titleClassName, className)} {...props}>
      {children}
    </Component>
  );
};

const MobileHeaderLogo = ({ children, className, ...props }: MobileHeaderLogoProps) => {
  return (
    <div className={cn(logoClassName, className)} {...props}>
      {children}
    </div>
  );
};

MobileHeaderRoot.displayName = 'MobileHeader';
MobileHeaderLogo.displayName = 'MobileHeader.Logo';
MobileHeaderTitle.displayName = 'MobileHeader.Title';

export const MobileHeader = Object.assign(MobileHeaderRoot, {
  BackButton: MobileHeaderBackButton,
  Logo: MobileHeaderLogo,
  Title: MobileHeaderTitle,
}) satisfies typeof MobileHeaderRoot & MobileHeaderCompound;
