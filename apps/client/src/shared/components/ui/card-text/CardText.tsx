import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import { cardText, cardTextLabel, cardTextMessage } from './CardText.css';

const DEFAULT_LABEL = '점장 한마디';

export interface CardTextOwnProps {
  text: string;
  label?: string;
}

export type CardTextProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & CardTextOwnProps;

export const CardText = forwardRef<HTMLDivElement, CardTextProps>(
  ({ text, label = DEFAULT_LABEL, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardText(), className)} {...props}>
        {label ? <p className={cardTextLabel()}>{label}</p> : null}
        <p className={cardTextMessage()}>{text}</p>
      </div>
    );
  },
);

CardText.displayName = 'CardText';
