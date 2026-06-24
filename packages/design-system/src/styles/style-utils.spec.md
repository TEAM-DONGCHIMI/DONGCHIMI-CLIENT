# Style Utilities Spec

## Metadata

- Jira: DCMFE-29
- Surface: `@dongchimi/design-system/styles`
- Owner: Frontend
- Status: Implemented

## Purpose

`packages/design-system`에서 vanilla-extract 기반 컴포넌트를 만들 때 반복되는 className 조합과 recipe variant type 추출을 표준화합니다.

## Source Of Truth

- Styling policy: `docs/architecture/styling-and-design-tokens.md`
- Design system boundary: `docs/architecture/design-system.md`
- vanilla-extract recipes: `@vanilla-extract/recipes`

## Scope

- `cn`으로 `clsx` 기반 className을 조합합니다.
- `recipe`와 관련 타입을 styles subpath에서 명시적으로 export합니다.
- `RecipeVariantProps`로 recipe variant props 타입을 컴포넌트 props에 재사용합니다.
- `RecipeVariantSelectionTypes`로 optional variant selection 타입을 유지합니다.
- `RecipeClassNameTypes`로 recipe runtime return type을 추출합니다.

## Out Of Scope

- 컬러, spacing, typography token 정의
- theme contract 또는 CSS variable 체계
- 실제 public component 구현
- Tailwind class merge 정책

## Public API

```ts
import {
  cn,
  recipe,
  type RecipeClassNameTypes,
  type RecipeVariantProps,
  type RecipeVariantSelectionTypes,
} from '@dongchimi/design-system/styles';
```

- `cn(...values)`: `clsx` 기반으로 className 값을 공백 기준 문자열로 조합합니다.
- `ClassValueTypes`: `clsx`의 `ClassValue`를 재사용한 `cn` 입력 타입입니다.
- `recipe`: vanilla-extract recipe factory re-export입니다.
- `RecipeVariantProps<TRecipe>`: 컴포넌트 props에 사용하는 non-nullable variant 타입입니다.
- `RecipeVariantSelectionTypes<TRecipe>`: recipe call에 넘기는 optional variant selection 타입입니다.
- `RecipeClassNameTypes<TRecipe>`: recipe className return 타입입니다.

## Behavior

- falsy 값은 className에 포함하지 않습니다.
- string, number, bigint는 문자열로 포함합니다.
- 배열은 중첩 값을 순서대로 펼칩니다.
- object는 value가 truthy인 key만 포함합니다.
- `cn`은 중복 className을 제거하지 않습니다.
- `cn`은 Tailwind conflict resolution을 수행하지 않습니다.

## Usage

공통 recipe는 컴포넌트 style 파일에서 선언합니다.

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

### `cn`

`cn`은 recipe가 만든 className과 호출부에서 받은 className, 조건부 className을 한 번에 조합하기 위해 추가했습니다. 디자인시스템 컴포넌트가 `className` override를 받을 때 같은 조합 방식을 사용하게 만드는 것이 목적입니다.

```ts
const className = cn(buttonRecipe({ size: 'sm' }), props.className, {
  'is-disabled': props.disabled,
});
```

### `RecipeVariantProps`

`RecipeVariantProps`는 recipe variants를 컴포넌트 public props에 그대로 노출하기 위해 추가했습니다. variant 이름과 값이 recipe와 props에서 따로 정의되면 둘 중 하나가 바뀌었을 때 타입이 쉽게 어긋나기 때문에, recipe 정의에서 props 타입을 추출합니다.

```ts
type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;

interface ButtonProps extends ButtonVariantProps {
  className?: string;
  disabled?: boolean;
}
```

### `RecipeVariantSelectionTypes`

`RecipeVariantSelectionTypes`는 컴포넌트 props가 아니라 recipe 호출 옵션을 변수, mapper, helper에 넘길 때 사용합니다. recipe 자체는 options 없이 호출될 수 있으므로 optional selection 타입을 유지합니다.

```ts
const defaultButtonVariants: RecipeVariantSelectionTypes<typeof buttonRecipe> = {
  size: 'md',
  tone: 'primary',
};
```

### `RecipeClassNameTypes`

`RecipeClassNameTypes`는 recipe 호출 결과를 반환하는 helper의 반환 타입을 recipe와 동기화하기 위해 추가했습니다. 현재 recipe 결과는 string이지만, helper에서 반환 타입을 직접 `string`으로 반복하지 않고 recipe 정의와 연결해 둡니다.

```ts
const getButtonClassName = (
  variants: RecipeVariantSelectionTypes<typeof buttonRecipe>,
): RecipeClassNameTypes<typeof buttonRecipe> => {
  return buttonRecipe(variants);
};
```

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`

## Open Questions

- token/theme contract가 확정되면 recipe 사용 예시를 실제 token 기반 component spec으로 이동합니다.
