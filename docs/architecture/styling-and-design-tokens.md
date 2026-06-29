# Styling And Design Tokens

동치미 기본 styling authoring은 vanilla-extract를 사용합니다.

## Current Direction

- `packages/design-system`은 `@vanilla-extract/css`로 package-local style을 작성합니다.
- Next.js 앱은 `@vanilla-extract/next-plugin`을 `next.config.mjs`에 연결한 뒤 webpack 기반 dev/build script에서 디자인시스템의 `.css.ts` 파일을 소비합니다.
- 새 앱이 디자인시스템 style을 소비하려면 해당 앱의 bundler 설정에 vanilla-extract plugin을 먼저 연결합니다.
- Pretendard font asset은 `packages/design-system/src/assets`에 단일 원본으로 두고, 디자인시스템의 `fonts.css`에서 import해 `@font-face`와 app-level 기본 font-family를 정의합니다.
- `reset.css`는 root font-size를 `62.5%`로 설정해 기본 브라우저 설정 기준 `1rem = 10px` 계산식을 사용합니다.
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
- 전역 폰트는 각 앱 runtime entry에서 `@dongchimi/design-system/styles/fonts.css`를 명시적으로 import해 app-level로 적용합니다.
- `fonts.css`는 Pretendard asset을 직접 import하며, consumer bundler가 앱별 runtime URL을 생성합니다.
- 디자인시스템 컴포넌트의 책임 경계는 [Design System](./design-system.md)을 따릅니다.

## Unit Rules

- root font-size는 `html { font-size: 62.5%; }`를 사용합니다. 기본 브라우저 설정 16px 기준 `1rem = 10px`이며, 사용자가 브라우저 기본 글자 크기를 바꾸면 그 비율을 따릅니다.
- Figma px 값을 rem으로 옮길 때는 `px / 10 = rem`으로 계산합니다. 예: 16px은 `1.6rem`, 24px은 `2.4rem`, 56px은 `5.6rem`입니다.
- typography token의 `font-size`와 `letter-spacing`은 rem을 사용합니다. `line-height`는 글자 크기와 함께 비례하도록 unitless number를 사용합니다.
- border width, hairline, icon size, fixed control size, shadow offset처럼 글자 크기와 함께 커지면 안 되는 값은 px를 사용합니다.
- spacing은 텍스트 흐름과 함께 커져야 하는 값이면 rem, 아이콘 버튼 크기처럼 고정된 UI affordance이면 px를 사용합니다.
- vanilla-extract에서 숫자 값은 px로 컴파일됩니다. rem, %, calc 등 px가 아닌 단위가 필요하면 문자열로 작성합니다.
