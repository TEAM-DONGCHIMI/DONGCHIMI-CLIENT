import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../styles';
import {
  listBaseClassName,
  listGapClassNames,
  listItemClassName,
  listMarkerClassNames,
  listMarkerPositionClassNames,
  type LayoutGapTypes,
  type ListMarkerPositionTypes,
  type ListMarkerTypes,
} from '../layout.css';

type NativeListProps = Omit<
  ComponentPropsWithoutRef<'ul'> & ComponentPropsWithoutRef<'ol'>,
  'className'
>;

export type ListProps = NativeListProps & {
  as?: 'ul' | 'ol';
  className?: string;
  gap?: LayoutGapTypes;
  marker?: ListMarkerTypes;
  markerPosition?: ListMarkerPositionTypes;
};

export type ListItemProps = ComponentPropsWithoutRef<'li'>;

const ListItem = ({ className, ...props }: ListItemProps) => {
  return <li className={cn(listItemClassName, className)} {...props} />;
};

const ListRoot = ({
  as: Component = 'ul',
  className,
  gap = 'sm',
  marker = 'none',
  markerPosition = 'outside',
  ...props
}: ListProps) => {
  return (
    <Component
      className={cn(
        listBaseClassName,
        listGapClassNames[gap],
        listMarkerClassNames[marker],
        marker !== 'none' && listMarkerPositionClassNames[markerPosition],
        className,
      )}
      {...props}
    />
  );
};

export const List = Object.assign(ListRoot, {
  Item: ListItem,
});
