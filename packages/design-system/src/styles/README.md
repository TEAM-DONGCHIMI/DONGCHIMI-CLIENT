# Styles

이 디렉터리는 `packages/design-system` 내부 vanilla-extract style authoring scaffold를 둡니다.

현재 범위는 빌드 통합과 style layer 골격입니다. 컬러, typography, spacing token과 theme contract는 별도 Jira에서 확정합니다.

## Public Utilities

style authoring helper는 `@dongchimi/design-system/styles`에서 가져옵니다.

```ts
import { cn, recipe, type RecipeVariantProps } from '@dongchimi/design-system/styles';
```

- `cn`: `clsx`를 감싼 className 조합 helper입니다.
- `recipe`: `@vanilla-extract/recipes`의 recipe factory re-export입니다.
- `RecipeVariantProps`: recipe variant를 public component props 타입으로 추출합니다.

`cn`은 Tailwind conflict merge를 수행하지 않습니다. Tailwind를 사용하지 않는 현재 구조에서는 `clsx` 기반 className 조합만 담당합니다.
