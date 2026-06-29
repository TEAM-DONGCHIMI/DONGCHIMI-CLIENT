# Styles

이 디렉터리는 `packages/design-system` 내부 vanilla-extract style authoring scaffold를 둡니다.

현재 범위는 빌드 통합과 style layer 골격입니다. 컬러, typography, spacing token과 theme contract는 별도 Jira에서 확정합니다.

## Public Utilities

style authoring helper는 `@dongchimi/design-system/styles`에서 가져옵니다.

```ts
import {
  cn,
  recipe,
  type RecipeClassNameTypes,
  type RecipeVariantProps,
  type RecipeVariantSelectionTypes,
} from '@dongchimi/design-system/styles';
```

- `cn`: `clsx`를 감싼 className 조합 helper입니다.
- `recipe`: `@vanilla-extract/recipes`의 recipe factory re-export입니다.
- `RecipeVariantProps`: recipe variant를 public component props 타입으로 추출합니다.
- `RecipeVariantSelectionTypes`: recipe 호출에 넘길 optional variant selection 타입을 추출합니다.
- `RecipeClassNameTypes`: recipe 호출 결과 className 타입을 추출합니다.

`cn`은 Tailwind conflict merge를 수행하지 않습니다. Tailwind를 사용하지 않는 현재 구조에서는 `clsx` 기반 className 조합만 담당합니다.

## Global Styles

전역 CSS side effect는 필요한 runtime entry에서 명시적으로 import합니다.

```ts
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';
```

- `reset.css`: 공통 reset과 기본 element 스타일을 적용합니다.
- `fonts.css`: Pretendard `@font-face`와 `html, body` 기본 font-family를 적용합니다.

`reset.css`는 브라우저 기본 margin, heading typography, list, link, form control, table, fieldset/dialog 기본 스타일을 초기화합니다.
제품별 시각 스타일과 typography scale은 reset이 아니라 token 또는 component style에서 명시합니다.
root font-size는 `62.5%`로 설정합니다. 기본 브라우저 설정 16px 기준 `1rem = 10px`이므로 디자인 px 값을 rem으로 옮길 때 `px / 10 = rem`을 사용합니다.

`fonts.css`는 `packages/design-system/src/assets/fonts/pretendard/PretendardVariable.woff2`를 직접 import합니다.
각 앱과 Storybook의 bundler가 해당 asset을 자체 build output으로 내보내므로 앱별 `public` 디렉터리에 같은 폰트 파일을 복사하지 않습니다.

## Unit Rules

- typography token의 `font-size`와 `letter-spacing`은 rem을 사용합니다.
- `line-height`는 unitless number를 사용합니다.
- vanilla-extract 숫자 값은 px로 컴파일됩니다. rem, %, calc 등 px가 아닌 단위는 문자열로 작성합니다.
- border width, hairline, icon size, fixed control size, shadow offset처럼 글자 크기와 함께 커지면 안 되는 값은 px를 사용합니다.
- spacing은 텍스트 흐름과 함께 커져야 하면 rem, 고정된 UI affordance이면 px를 사용합니다.

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

`cn`은 recipe 결과와 호출부 className을 합칠 때 사용합니다.

```ts
const className = cn(buttonRecipe({ size: 'sm' }), props.className, {
  'is-disabled': props.disabled,
});
```
