import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import { cardText, cardTextLabel, cardTextMessage } from './CardText.css';

export interface CardTextProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  label: string;
  text: string;
}

export const CardText = forwardRef<HTMLDivElement, CardTextProps>(
  ({ text, label, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardText(), className)} {...props}>
        <p className={cardTextLabel()}>{label}</p>
        <p className={cardTextMessage()}>{text}</p>
      </div>
    );
  },
);

CardText.displayName = 'CardText';
