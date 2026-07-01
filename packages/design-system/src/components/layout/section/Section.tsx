import { cn } from '../../../styles';
import { Box, type BoxProps } from '../box';
import { sectionSpacingClassNames, type SectionSpacingTypes } from '../layout.css';

export type SectionProps = Omit<BoxProps, 'display'> & {
  spacing?: SectionSpacingTypes;
};

export const Section = ({ as = 'section', className, spacing = 'md', ...props }: SectionProps) => {
  return <Box as={as} className={cn(sectionSpacingClassNames[spacing], className)} {...props} />;
};
