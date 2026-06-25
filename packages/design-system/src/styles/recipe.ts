export { recipe } from '@vanilla-extract/recipes';
export type { RecipeVariants, RuntimeFn } from '@vanilla-extract/recipes';

type RecipeOptionsTypes<TRecipe> = TRecipe extends (options?: infer TVariants) => string
  ? TVariants
  : never;

export type RecipeVariantProps<TRecipe> = NonNullable<RecipeOptionsTypes<TRecipe>>;

export type RecipeVariantSelectionTypes<TRecipe> = RecipeOptionsTypes<TRecipe>;

export type RecipeClassNameTypes<TRecipe> = TRecipe extends (...args: never[]) => infer TResult
  ? TResult
  : never;
