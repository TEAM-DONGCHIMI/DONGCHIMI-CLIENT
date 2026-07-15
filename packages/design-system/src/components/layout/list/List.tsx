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

interface ListSharedProps {
  className?: string;
  gap?: LayoutGapTypes;
  marker?: ListMarkerTypes;
  markerPosition?: ListMarkerPositionTypes;
}

interface UnorderedListProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'className'> {
  as?: 'ul';
}

interface OrderedListProps extends Omit<ComponentPropsWithoutRef<'ol'>, 'className'> {
  as: 'ol';
}

export type ListProps = ListSharedProps & (UnorderedListProps | OrderedListProps);

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
