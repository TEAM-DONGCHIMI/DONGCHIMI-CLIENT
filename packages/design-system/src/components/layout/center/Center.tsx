import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import {
  centerClassName,
  centerMinHeightClassNames,
  gridDisplayClassNames,
  type CenterMinHeightTypes,
} from '../layout.css';

export type CenterProps = Omit<BoxProps, 'display'> & {
  inline?: boolean;
  minHeight?: CenterMinHeightTypes;
};

export const Center = ({ className, inline = false, minHeight, ...props }: CenterProps) => {
  return (
    <Box
      className={cn(
        gridDisplayClassNames[inline ? 'inline' : 'block'],
        centerClassName,
        minHeight && centerMinHeightClassNames[minHeight],
        className,
      )}
      {...props}
    />
  );
};
