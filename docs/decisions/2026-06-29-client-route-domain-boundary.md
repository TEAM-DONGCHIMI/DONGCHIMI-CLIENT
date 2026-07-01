# Decision: Client route entry and domain page boundary

## Status

- Accepted

## Date

- 2026-06-29

## Context

- Jira: [DCMCL-2](https://dongchimi.atlassian.net/browse/DCMCL-2)
- PR: [#28](https://github.com/TEAM-DONGCHIMI/DONGCHIMI-CLIENT/pull/28)
- Source architecture: [App Structure](../architecture/app-structure.md)
- Source workflow: [Spec Writing](../workflows/spec-writing.md)

모바일 웹 사용자측 와이어프레임은 로그인, 주변 마트 지도/목록, 마트 전단 상품 목록, 상품 상세로 이어지는 route 흐름을 요구합니다.
이 흐름은 이후 social login, geolocation, map SDK, flyer/product API, phone/share action의 연결 기준이 되므로 route entry와 실제 화면 구현 위치를 먼저 고정해야 합니다.

Next App Router는 `apps/client/src/app` 하위의 segment와 `page.tsx`, `layout.tsx`, `route.ts` 같은 convention file을 route boundary로 해석합니다.
따라서 route와 무관한 page-local `hooks`, `components`, `sections`, `utils`를 어디에 둘지 결정하지 않으면 `app` 하위 private folder convention과 domain folder convention이 섞일 수 있습니다.

## Options

- Option A: `src/app` 하위 route folder에 `_components`, `_hooks`, `_sections`를 함께 둡니다.
  - 장점: 특정 route에만 쓰는 파일을 route entry 가까이에 둘 수 있습니다.
  - 단점: 같은 domain이 여러 route에 걸치면 API, model, shared hook 위치가 route path에 종속됩니다.
- Option B: `src/app`은 route entry로 얇게 유지하고, 실제 page shell과 page-local 확장 지점은 `src/domains`에 둡니다.
  - 장점: Next route convention과 제품 domain 책임을 분리할 수 있습니다.
  - 단점: 단일 route만 보는 경우에는 app folder 안에 모두 모으는 방식보다 한 단계 더 이동해야 합니다.
- Option C: 초기에 `packages/shared` 또는 별도 공통 feature package로 route/page logic을 분리합니다.
  - 장점: 여러 app 재사용을 빠르게 열 수 있습니다.
  - 단점: 사용자측 앱에서만 검증된 요구사항을 repo-wide abstraction으로 과하게 승격할 위험이 있습니다.

## Decision

- 선택한 안: Option B
- 선택 이유:
  - `src/app`은 Next route segment, route group, layout, loading/error/not-found, metadata, route handler를 위한 boundary로 유지합니다.
  - 실제 화면 의미와 후속 구현 단위는 `src/domains/{domain}/{page}` 아래 page shell에서 시작합니다.
  - domain 여러 page가 공유하는 API, model, query/mutation hook은 `src/domains/{domain}/{api|model|hooks}`에 둡니다.
  - page 안에서만 쓰는 UI 조각, section, UI state hook, fixture, util은 `src/domains/{domain}/{page}/{components|sections|hooks|fixtures|utils}`에 둡니다.
  - `src/domains`는 Next route로 해석되지 않으므로 `_hooks`, `_components`처럼 underscore prefix를 붙이지 않습니다.
  - route path 조합은 app-local `shared/constants/routes.ts`의 `CLIENT_ROUTES`로 모읍니다.

## Consequences

- 장점:
  - route entry는 URL param 전달과 domain page 위임만 담당하므로 App Router convention이 화면 구현으로 비대해지지 않습니다.
  - `/markets`, `/markets/[marketId]`, `/markets/[marketId]/products/[productId]`처럼 같은 market domain에 속한 여러 route가 domain API, model, hook을 공유할 수 있습니다.
  - `app` 하위에서만 필요한 Next private folder convention을 `domains`까지 확산하지 않습니다.
  - 사용자측 앱 내부 구조를 먼저 검증한 뒤, 실제 재사용이 확인될 때만 `shared` 또는 `packages/*`로 승격할 수 있습니다.
- 단점:
  - 단일 route에만 관심 있는 작은 변경은 `app` entry와 `domains` page shell을 함께 따라가야 합니다.
  - route와 page shell이 분리되므로 route param 전달 규칙을 spec과 테스트로 계속 확인해야 합니다.
- 영향을 받는 파일/문서/작업:
  - `apps/client/src/app/**/page.tsx`
  - `apps/client/src/domains/**`
  - `apps/client/src/shared/constants/routes.ts`
  - `docs/architecture/app-structure.md`
  - `docs/workflows/spec-writing.md`
  - page/route generator와 route-boundary verification 작업

## Verification

- DCMCL-2에서 아래 route entry와 domain page shell 구조를 구현했습니다.
  - `/` -> `/login` redirect gate
  - `/login` -> `domains/auth/login/LoginPage`
  - `/markets` -> `domains/market/nearby-markets/NearbyMarketsPage`
  - `/markets/[marketId]` -> `domains/market/market-products/MarketProductsPage`
  - `/markets/[marketId]/products/[productId]` -> `domains/market/product-detail/ProductDetailPage`
- PR #28에서 아래 검증을 통과했습니다.
  - `git diff --check`
  - `pnpm format:check`
  - `pnpm --filter client lint`
  - `pnpm --filter client typecheck`
  - `pnpm --filter client test`
  - `pnpm --filter client build`
  - `pnpm e2e:smoke`
- 검증하지 못한 부분:
  - social login 이후 root 분기 정책
  - geolocation/map SDK 연동 후 route state와 permission state의 최종 구조
  - 실제 product/flyer API contract가 생긴 뒤 domain model 분리 기준

## Revisit

- auth/session 정책이 생겨 `/`가 `/login`과 `/markets` 사이에서 조건부 분기해야 할 때 다시 봅니다.
- market domain의 API, model, query hook이 과도하게 커지면 `market` 내부 domain split을 검토합니다.
- 같은 page shell 또는 business logic이 `apps/market-owner`와 실제로 공유되면 `packages/shared` 승격 여부를 별도 decision log로 검토합니다.
- 특정 route에 완전히 종속된 작은 UI 조각만 필요한 경우에는 `app/.../_components` 사용을 제한적으로 허용할 수 있습니다. 단, domain API/model/hook은 `app` 아래로 넣지 않습니다.
