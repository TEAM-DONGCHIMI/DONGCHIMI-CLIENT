# Styles

이 디렉터리는 `packages/design-system` 내부 vanilla-extract style authoring scaffold를 둡니다.

현재 범위는 빌드 통합과 style layer 골격입니다. 컬러, typography, spacing token과 theme contract는 별도 Jira에서 확정합니다.

## Public Utilities

style authoring helper는 `@dongchimi/design-system/styles`에서 가져옵니다.

```ts
import {
  cn,
  recipe,
  styleVariants,
  type RecipeClassNameTypes,
  type RecipeVariantProps,
  type RecipeVariantSelectionTypes,
  type StyleVariantClassNameTypes,
  type StyleVariantProps,
} from '@dongchimi/design-system/styles';
```

- `cn`: `clsx`를 감싼 className 조합 helper입니다.
- `recipe`: `@vanilla-extract/recipes`의 recipe factory re-export입니다.
- `styleVariants`: `@vanilla-extract/css`의 style variant factory re-export입니다.
- `RecipeVariantProps`: recipe variant를 public component props 타입으로 추출합니다.
- `RecipeVariantSelectionTypes`: recipe 호출에 넘길 optional variant selection 타입을 추출합니다.
- `RecipeClassNameTypes`: recipe 호출 결과 className 타입을 추출합니다.
- `StyleVariantProps`: `styleVariants` 결과 객체에서 variant key 타입을 추출합니다.
- `StyleVariantClassNameTypes`: `styleVariants` 결과 객체에서 className value 타입을 추출합니다.

`cn`은 Tailwind conflict merge를 수행하지 않습니다. Tailwind를 사용하지 않는 현재 구조에서는 `clsx` 기반 className 조합만 담당합니다.

## Usage

```ts
const buttonRecipe = recipe({
  base: 'baseClassName',
  variants: {
    size: {
      sm: 'smallClassName',
      md: 'mediumClassName',
    },
    tone: {
      primary: 'primaryClassName',
      neutral: 'neutralClassName',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'primary',
  },
});
```

`RecipeVariantProps`는 컴포넌트 props가 recipe variant를 그대로 받을 때 사용합니다.

```ts
type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;

interface ButtonProps extends ButtonVariantProps {
  className?: string;
}
```

`RecipeVariantSelectionTypes`는 컴포넌트 props가 아니라 recipe 호출 옵션을 변수나 helper로 분리할 때 사용합니다.

```ts
const defaultButtonVariants: RecipeVariantSelectionTypes<typeof buttonRecipe> = {
  size: 'md',
  tone: 'primary',
};
```

`RecipeClassNameTypes`는 recipe 결과 className을 별도 함수의 반환 타입으로 고정해야 할 때 사용합니다.

```ts
const getButtonClassName = (
  variants: RecipeVariantSelectionTypes<typeof buttonRecipe>,
): RecipeClassNameTypes<typeof buttonRecipe> => {
  return buttonRecipe(variants);
};
```

`StyleVariantProps`는 `styleVariants` 결과의 key를 props 타입으로 재사용할 때 사용합니다.

```ts
const sizeClassNames = styleVariants({
  sm: { minHeight: '2rem' },
  md: { minHeight: '2.5rem' },
});

type SizeTypes = StyleVariantProps<typeof sizeClassNames>;
```

`StyleVariantClassNameTypes`는 `styleVariants` 결과 className을 별도 helper 반환 타입으로 고정해야 할 때 사용합니다.

```ts
const getSizeClassName = (size: SizeTypes): StyleVariantClassNameTypes<typeof sizeClassNames> => {
  return sizeClassNames[size];
};
```

`cn`은 recipe 결과와 호출부 className을 합칠 때 사용합니다.

```ts
const className = cn(buttonRecipe({ size: 'sm' }), props.className, {
  'is-disabled': props.disabled,
});
```
