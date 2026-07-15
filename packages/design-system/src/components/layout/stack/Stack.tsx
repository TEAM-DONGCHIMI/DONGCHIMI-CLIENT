import { Flex, type FlexProps } from '../flex';
import { type FlexAlignTypes, type FlexJustifyTypes, type LayoutGapTypes } from '../layout.css';

export type StackProps = Omit<FlexProps, 'direction' | 'gap' | 'inline' | 'wrap'> & {
  align?: FlexAlignTypes;
  direction?: 'horizontal' | 'vertical';
  gap?: LayoutGapTypes;
  justify?: FlexJustifyTypes;
  wrap?: boolean;
};

export const Stack = ({
  align = 'stretch',
  direction = 'vertical',
  gap = 'md',
  justify = 'start',
  wrap = false,
  ...props
}: StackProps) => {
  return (
    <Flex
      align={align}
      direction={direction === 'vertical' ? 'column' : 'row'}
      gap={gap}
      justify={justify}
      wrap={wrap ? 'wrap' : 'nowrap'}
      {...props}
    />
  );
};
