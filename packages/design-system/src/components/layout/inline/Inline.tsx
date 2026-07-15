import { Flex, type FlexProps } from '../flex';
import { type FlexAlignTypes, type FlexJustifyTypes, type LayoutGapTypes } from '../layout.css';

export type InlineProps = Omit<FlexProps, 'direction' | 'gap' | 'inline' | 'wrap'> & {
  align?: FlexAlignTypes;
  gap?: LayoutGapTypes;
  justify?: FlexJustifyTypes;
  wrap?: boolean;
};

export const Inline = ({
  align = 'center',
  gap = 'sm',
  justify = 'start',
  wrap = true,
  ...props
}: InlineProps) => {
  return (
    <Flex
      align={align}
      direction='row'
      gap={gap}
      justify={justify}
      wrap={wrap ? 'wrap' : 'nowrap'}
      {...props}
    />
  );
};
