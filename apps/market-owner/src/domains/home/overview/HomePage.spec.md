# React Page Spec: `HomePage`

## Metadata

- App: `market-owner`
- Domain: `home`
- Page: `overview`
- Route: `/`
- Path: `apps/market-owner/src/domains/home/overview/HomePage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

사장님웹 홈 page가 protected sidebar layout의 기본 route로 진입되는지 확인합니다. 실제 dashboard data와 업무 summary는 후속 홈 퍼블리싱 작업에서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/` route가 `홈` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 오늘의 특가 상품 등록 link는 `/products/today-special/new`로 이동합니다.
- dashboard summary, market profile data, notification data는 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `홈`을 제공합니다.
- keyboard: sidebar item과 본문 link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar `홈` item은 현재 route에 `aria-current="page"`를 적용합니다.

## Verification

- [ ] `/` route renders `홈`
- [ ] route renders sidebar complementary landmark
- [ ] sidebar `홈` link has `aria-current="page"`
