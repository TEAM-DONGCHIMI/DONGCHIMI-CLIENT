# Market Owner Routing Spec

## Metadata

- Jira: DCMSM-15
- Related Jira: DCMSM-17, DCMSM-24
- Screen ID: APPJAM login/signup, 행사 할인 상품 등록 flow, sidebar/edit tabs screenshots
- Route: `/`, `/login`, `/signup`, `/products/today-special/new`, `/products/event-discount/new`, `/products/today-special/edit`, `/products/event-discount/edit`, `/products/registration-result`, `/leaflets/share`, `*`
- Owner: FE
- Status: Implemented

## Purpose

사장님웹의 초기 페이지 라우팅, public/protected boundary, sidebar/no-sidebar layout boundary를 React Router 기준으로 고정합니다.
실제 auth API와 상품 form/API가 붙기 전에도 각 주요 route가 브라우저에서 진입 가능해야 합니다.
DCMSM-17부터 lazy route page는 앱 전용 `AsyncBoundary`를 통해 Suspense loading fallback과 render error fallback을 가집니다.
DCMSM-24부터 sidebar layout은 viewport 높이에 고정되고, protected page 본문만 독립적으로 스크롤됩니다.

## Source Of Truth

- Jira: DCMSM-15
- Figma: APPJAM node 1714-120191, node 1553-112507
- Attachments: `market-owner-edit-tabs.png`, `market-owner-sidebar-layout.png`
- Decision / Architecture: `docs/architecture/app-structure.md`, `docs/architecture/market-owner-app.md`
- Lazy route helper: `apps/market-owner/src/app/create-lazy-route.tsx`

## Scope

- route path를 `src/shared/constants/routes.ts`에 상수화합니다.
- `/login`, `/signup`은 public auth layout에서 sidebar 없이 렌더링합니다.
- 홈, 상품 등록, 상품 수정 route는 protected route 아래 sidebar layout에서 렌더링하고 sidebar item으로 노출합니다.
- `/leaflets/share` route는 protected sidebar layout을 유지하지만, 요구사항에서 제외되어 sidebar item으로 노출하지 않습니다.
- Protected sidebar layout은 viewport 높이를 넘기지 않고 main content slot에만 세로 스크롤을 부여합니다.
- 상품 등록 결과 확인 route는 protected route이지만 no-sidebar layout에서 렌더링합니다.
- `ProtectedRoute`는 실제 auth API 전까지 fixture 통과 정책을 둡니다.
- 수정하기 탭은 오늘의 특가와 행사 할인 각각 별도 route로 두어 sidebar active state와 같은 URL을 공유합니다.
- 존재하지 않는 경로는 app 내부 Not Found 화면을 보여줍니다.
- lazy route wrapping은 `createLazyRoute` helper에 위임하고, `router.tsx`는 route object와 `createBrowserRouter` 생성만 담당합니다.

## Out Of Scope

- 실제 로그인/회원가입 API, token 저장, refresh 처리
- 상품 등록/수정 form validation, submit mutation, cache invalidation
- 각 page 본문 UI의 pixel-perfect 퍼블리싱
- 등록 결과 데이터 연동
- 새 design-system public component 구현
- 서버 HTTP 404 응답 정책

## Layout And Sections

- Public auth layout: `/login`, `/signup`
- Protected sidebar layout: `/`, `/products/today-special/new`, `/products/event-discount/new`, `/products/today-special/edit`, `/products/event-discount/edit`, `/leaflets/share`
  - sidebar slot: viewport 높이에 고정되어 page content 스크롤과 함께 움직이지 않습니다.
  - content slot: page overflow를 소유하는 scroll container입니다.
- Protected no-sidebar layout: `/products/registration-result`
- Fallback: `*`

## States

- loading: lazy route page는 `AsyncBoundary`의 Suspense fallback으로 처리합니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 `NotFoundPage`에서 처리합니다.
  하위 route render error는 `AsyncBoundary`의 error fallback으로 처리합니다.
- disabled: 이번 범위에서 다루지 않습니다.
- selected / active: sidebar active item은 current pathname으로 계산하고, edit tab active state는 각 edit route로 계산합니다.
- selected / active: `/leaflets/share`는 sidebar item이 없으므로 active sidebar item을 갖지 않습니다.

## Behavior

- navigation: sidebar item 선택은 React Router navigate로 처리하고, modified click은 native link 동작을 보존합니다.
- interaction: edit tab은 `TabNav` + React Router `Link`로 route를 이동합니다.
- form / validation: 이번 범위에서 다루지 않습니다.
- API: 이번 범위에서 다루지 않습니다.

## Accessibility

- keyboard: sidebar link, auth link, edit tab link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- accessible name: 각 route page는 visible `h1`을 가집니다.
- current state: sidebar와 edit tab은 현재 route에 `aria-current="page"`를 적용합니다.

## Responsive

- mobile: 이번 DCMSM-15의 기준 viewport가 아니며, overflow가 생기면 후속 responsive 작업에서 조정합니다.
- tablet: 이번 DCMSM-15의 기준 viewport가 아니며, overflow가 생기면 후속 responsive 작업에서 조정합니다.
- desktop: sidebar width와 main content가 분리되어 렌더링되어야 합니다.
- reduced desktop height / devtools: page content 스크롤 시 sidebar 배경과 footer 영역이 잘리지 않아야 합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter market-owner lint`
- [ ] `pnpm --filter market-owner typecheck`
- [ ] `pnpm --filter market-owner test`
- [ ] `pnpm --filter market-owner build`
- [ ] browser route: `/login`
- [ ] browser route: `/signup`
- [ ] browser route: `/`
- [ ] browser route: `/products/today-special/new`
- [ ] browser route: `/products/event-discount/new`
- [ ] browser route: `/products/today-special/edit`
- [ ] browser route: `/products/event-discount/edit`
- [ ] browser route: `/products/registration-result`
- [ ] browser route: `/leaflets/share`
- [ ] sidebar does not render `오늘의 전단 공유` item
- [ ] browser route: unknown path renders Not Found

## Open Questions

- 실제 auth API가 붙으면 `ProtectedRoute`의 fixture 통과 정책을 제거하고 session/token 판단으로 교체합니다.
- 등록 결과 확인 화면의 상세 CTA와 데이터는 후속 flow 이슈에서 확정합니다.
