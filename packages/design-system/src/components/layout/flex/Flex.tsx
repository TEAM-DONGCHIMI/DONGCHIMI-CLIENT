import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import {
  flexAlignClassNames,
  flexDirectionClassNames,
  flexDisplayClassNames,
  flexJustifyClassNames,
  flexWrapClassNames,
  gapClassNames,
  type FlexAlignTypes,
  type FlexDirectionTypes,
  type FlexJustifyTypes,
  type FlexWrapTypes,
  type LayoutGapTypes,
} from '../layout.css';

export type FlexProps = Omit<BoxProps, 'display'> & {
  align?: FlexAlignTypes;
  direction?: FlexDirectionTypes;
  gap?: LayoutGapTypes;
  inline?: boolean;
  justify?: FlexJustifyTypes;
  wrap?: FlexWrapTypes;
};

export const Flex = ({
  align = 'stretch',
  className,
  direction = 'row',
  gap,
  inline = false,
  justify = 'start',
  wrap = 'nowrap',
  ...props
}: FlexProps) => {
  return (
    <Box
      className={cn(
        flexDisplayClassNames[inline ? 'inline' : 'block'],
        flexDirectionClassNames[direction],
        flexAlignClassNames[align],
        flexJustifyClassNames[justify],
        flexWrapClassNames[wrap],
        gap && gapClassNames[gap],
        className,
      )}
      {...props}
    />
  );
};
