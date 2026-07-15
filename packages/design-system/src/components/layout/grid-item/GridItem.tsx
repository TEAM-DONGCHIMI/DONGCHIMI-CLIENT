import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import {
  gridItemBaseClassName,
  gridItemColumnSpanClassNames,
  gridItemColumnStartClassNames,
  gridItemRowSpanClassNames,
  type GridItemColumnSpanTypes,
  type GridItemColumnStartTypes,
  type GridItemRowSpanTypes,
} from '../layout.css';

export type GridItemProps = Omit<BoxProps, 'display'> & {
  colSpan?: GridItemColumnSpanTypes;
  colStart?: GridItemColumnStartTypes;
  rowSpan?: GridItemRowSpanTypes;
};

export const GridItem = ({ className, colSpan, colStart, rowSpan, ...props }: GridItemProps) => {
  return (
    <Box
      className={cn(
        gridItemBaseClassName,
        colSpan && gridItemColumnSpanClassNames[colSpan],
        colStart && gridItemColumnStartClassNames[colStart],
        rowSpan && gridItemRowSpanClassNames[rowSpan],
        className,
      )}
      {...props}
    />
  );
};
