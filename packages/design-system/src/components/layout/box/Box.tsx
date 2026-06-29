import { type ComponentPropsWithoutRef, type ElementType } from 'react';

import { cn } from '../../../styles';
import { boxDisplayClassNames, type BoxDisplayTypes } from '../layout.css';

export type BoxProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType;
  display?: BoxDisplayTypes;
};

export const Box = ({ as: Component = 'div', className, display, ...props }: BoxProps) => {
  return (
    <Component className={cn(display && boxDisplayClassNames[display], className)} {...props} />
  );
};
