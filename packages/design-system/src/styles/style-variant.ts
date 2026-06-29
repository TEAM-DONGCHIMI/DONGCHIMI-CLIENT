export { styleVariants } from '@vanilla-extract/css';

type StyleVariantMapTypes = Record<string, string>;

export type StyleVariantProps<TStyleVariants extends StyleVariantMapTypes> = keyof TStyleVariants;

export type StyleVariantClassNameTypes<TStyleVariants extends StyleVariantMapTypes> =
  TStyleVariants[keyof TStyleVariants];
