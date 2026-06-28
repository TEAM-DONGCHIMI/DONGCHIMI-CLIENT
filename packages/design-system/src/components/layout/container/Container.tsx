import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import {
  containerBaseClassName,
  containerCenteredClassName,
  containerGutterClassNames,
  containerSizeClassNames,
  type ContainerGutterTypes,
  type ContainerSizeTypes,
} from '../layout.css';

export type ContainerProps = Omit<BoxProps, 'display'> & {
  centered?: boolean;
  gutter?: ContainerGutterTypes;
  size?: ContainerSizeTypes;
};

export const Container = ({
  centered = true,
  className,
  gutter = 'md',
  size = 'lg',
  ...props
}: ContainerProps) => {
  return (
    <Box
      className={cn(
        containerBaseClassName,
        centered && containerCenteredClassName,
        containerSizeClassNames[size],
        containerGutterClassNames[gutter],
        className,
      )}
      {...props}
    />
  );
};
