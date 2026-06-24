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

- `cn`으로 문자열, 조건부 object, 배열 기반 className을 조합합니다.
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
import { cn, recipe, type RecipeVariantProps } from '@dongchimi/design-system/styles';
```

- `cn(...values)`: className 값을 공백 기준 문자열로 조합합니다.
- `ClassValueTypes`: `cn` 입력 타입입니다.
- `recipe`: vanilla-extract recipe factory re-export입니다.
- `RecipeVariantProps<TRecipe>`: 컴포넌트 props에 사용하는 non-nullable variant 타입입니다.
- `RecipeVariantSelectionTypes<TRecipe>`: recipe call에 넘기는 optional variant selection 타입입니다.
- `RecipeClassNameTypes<TRecipe>`: recipe className return 타입입니다.

## Behavior

- falsy 값은 className에 포함하지 않습니다.
- string과 number는 문자열로 포함합니다.
- 배열은 중첩 값을 순서대로 펼칩니다.
- object는 value가 truthy인 key만 포함합니다.
- `cn`은 중복 className을 제거하지 않습니다.
- `cn`은 Tailwind conflict resolution을 수행하지 않습니다.

## Usage

```ts
const buttonRecipe = recipe({
  variants: {
    size: {
      sm: {},
      md: {},
    },
  },
});

type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;

const className = cn(buttonRecipe({ size: 'sm' }), {
  'is-disabled': false,
});
```

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`

## Open Questions

- token/theme contract가 확정되면 recipe 사용 예시를 실제 token 기반 component spec으로 이동합니다.
