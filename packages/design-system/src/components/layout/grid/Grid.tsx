import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import {
  gapClassNames,
  gridAlignClassNames,
  gridAutoFitClassNames,
  gridColumnClassNames,
  gridDisplayClassNames,
  gridJustifyClassNames,
  type GridAlignTypes,
  type GridAutoFitTypes,
  type GridColumnsTypes,
  type GridJustifyTypes,
  type LayoutGapTypes,
} from '../layout.css';

export type GridProps = Omit<BoxProps, 'display'> & {
  align?: GridAlignTypes;
  autoFit?: GridAutoFitTypes;
  columns?: GridColumnsTypes;
  gap?: LayoutGapTypes;
  inline?: boolean;
  justify?: GridJustifyTypes;
};

export const Grid = ({
  align = 'stretch',
  autoFit,
  className,
  columns = 1,
  gap,
  inline = false,
  justify = 'stretch',
  ...props
}: GridProps) => {
  return (
    <Box
      className={cn(
        gridDisplayClassNames[inline ? 'inline' : 'block'],
        autoFit ? gridAutoFitClassNames[autoFit] : gridColumnClassNames[columns],
        gridAlignClassNames[align],
        gridJustifyClassNames[justify],
        gap && gapClassNames[gap],
        className,
      )}
      {...props}
    />
  );
};
