# Styling And Design Tokens

동치미 기본 styling authoring은 vanilla-extract를 사용합니다.

## Current Direction

- `packages/design-system`은 `@vanilla-extract/css`로 package-local style을 작성합니다.
- Next.js 앱은 `@vanilla-extract/next-plugin`을 `next.config.mjs`에 연결한 뒤 webpack 기반 dev/build script에서 디자인시스템의 `.css.ts` 파일을 소비합니다.
- 새 앱이 디자인시스템 style을 소비하려면 해당 앱의 bundler 설정에 vanilla-extract plugin을 먼저 연결합니다.
- Pretendard font asset은 `packages/design-system/src/assets`에 단일 원본으로 두고, 디자인시스템의 `fonts.css`에서 import해 `@font-face`와 페이지 적용용 class를 정의합니다.
- color token, theme contract는 아직 확정하지 않습니다.

## Package Structure

```text
packages/design-system/src/
  assets/
    fonts/
      pretendard/
        PretendardVariable.woff2
  styles/
    index.ts
    class-name.ts
    fonts.css.ts
    layers.css.ts
    recipe.ts
    reset.css.ts
```

## Token Rules

- 이 문서는 vanilla-extract 빌드 통합과 style authoring 위치만 확정합니다.
- style authoring helper는 `@dongchimi/design-system/styles` subpath에서 명시적으로 export합니다.
- `cn`은 `clsx` 기반 className 조합만 담당하며 Tailwind conflict merge를 수행하지 않습니다.
- recipe variant props 타입은 `RecipeVariantProps<typeof recipeName>` 형태로 추출합니다.
- 컬러, typography, spacing token과 theme contract는 별도 Jira에서 확정합니다.
- token 또는 CSS variable이 확정되기 전에는 product palette나 semantic token을 임의로 만들지 않습니다.
- 외부 CDN font는 기본으로 추가하지 않습니다.
- 앱 전역 `html, body` font-family는 설정하지 않습니다.
- Pretendard 적용이 필요한 페이지나 shell에서 `pretendardFontClass`를 명시적으로 적용합니다.
- `fonts.css`는 Pretendard asset을 직접 import하며, consumer bundler가 앱별 runtime URL을 생성합니다.
- 디자인시스템 컴포넌트의 책임 경계는 [Design System](./design-system.md)을 따릅니다.
