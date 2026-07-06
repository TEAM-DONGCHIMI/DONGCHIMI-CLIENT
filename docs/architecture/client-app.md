# Client App

`apps/client`는 사용자 모바일 웹을 위한 Next.js App Router workspace입니다.

## Identity

- Jira key: `DCMCL-*`
- Workspace path: `apps/client`
- Package name: `client`
- App type: Next.js App Router
- Primary viewport: mobile web

## Layout Start Criteria

사용자 앱의 page publishing 또는 route layout 작업을 시작하기 전에 아래 항목을 먼저 고정합니다.

- 기준 viewport는 모바일 웹입니다. Figma frame, target width, safe area, 스크롤 방향, sticky/fixed 영역을 spec에 적습니다.
- `src/app`에는 route entry, route group, layout, loading, error, not-found, metadata, route handler만 둡니다.
- 화면 조립은 `src/domains/{domain}/{page}`에서 담당하고, route entry는 params/search params 파싱과 layout 연결만 담당합니다.
- 모바일 header, bottom navigation, bottom sheet, modal처럼 앱 여러 page가 공유하는 shell은 `src/shared/components/{ui|layout}` 후보로 검토합니다.
- 한 page에서만 쓰는 섹션, 카드, CTA, empty view는 page-local `components` 또는 `sections`에 둡니다.
- 여러 앱에서 동일한 API와 동작으로 재사용되는 것이 확인되기 전에는 `packages/shared` 또는 `packages/design-system`으로 승격하지 않습니다.

## Route And Layout Groups

Next route group은 URL을 바꾸지 않고 layout boundary를 나눌 때만 사용합니다.

```text
src/app/
  (public)/      공개/랜딩성 화면
  (auth)/        로그인, 인증 진입
  (main)/        로그인 이후 주요 제품 화면
```

- route group 이름은 URL에 포함되지 않으므로 제품 domain 이름과 억지로 맞추지 않습니다.
- root `layout.tsx`는 Server Component로 유지하고, provider 조립은 `providers.tsx` 같은 얇은 Client Component로 모읍니다.
- auth/session 정책이 필요한 page는 route layout 또는 domain page spec에 redirect, fallback, loading 기준을 적습니다.
- mobile header나 bottom navigation의 active state는 route constant 또는 navigation config와 동기화합니다.

## Page Publishing Evidence

page publishing PR은 아래 근거를 spec과 PR 본문에 남깁니다.

- Figma URL, frame name 또는 Screen ID
- 확인한 browser route와 viewport
- 사용한 design-system `ui`, `layout`, icon component
- 새로 만든 app-shared 또는 page-local component와 그 위치를 택한 이유
- 디자인과 다르게 구현한 부분과 이유
- mobile overflow, sticky/fixed 영역, focus-visible, accessible name 확인 결과

## Verification

```bash
pnpm --filter client lint
pnpm --filter client typecheck
pnpm --filter client test
pnpm --filter client build
```

route, navigation, mobile shell이 바뀌면 필요한 범위에서 browser route 확인과 `pnpm e2e:smoke`를 추가합니다.
