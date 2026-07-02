import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

import { cn } from '@dongchimi/design-system/styles';
import { IconButton, type IconButtonProps } from '@dongchimi/design-system';

import {
  backButtonClassName,
  logoClassName,
  mobileHeaderClassName,
  titleClassName,
} from './MobileHeader.css';

export type MobileHeaderProps = ComponentPropsWithoutRef<'header'>;

type MobileHeaderBackButtonProps = Omit<
  IconButtonProps,
  'aria-label' | 'aria-labelledby' | 'children' | 'color'
> & {
  'aria-label': string;
};

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

const MobileHeaderBackButton = ({
  'aria-label': ariaLabel,
  className,
  type = 'button',
  ...props
}: MobileHeaderBackButtonProps) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      color='assistive'
      className={cn(backButtonClassName, className)}
      type={type}
      variant='ghost'
      {...props}
    />
  );
};

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
MobileHeaderBackButton.displayName = 'MobileHeader.BackButton';
MobileHeaderLogo.displayName = 'MobileHeader.Logo';
MobileHeaderTitle.displayName = 'MobileHeader.Title';

export const MobileHeader = Object.assign(MobileHeaderRoot, {
  BackButton: MobileHeaderBackButton,
  Logo: MobileHeaderLogo,
  Title: MobileHeaderTitle,
}) satisfies typeof MobileHeaderRoot & MobileHeaderCompound;
