# React Page Spec: `LeafletSharePage`

## Metadata

- App: `market-owner`
- Domain: `leaflet`
- Page: `share`
- Route: `/leaflets/share`
- Path: `apps/market-owner/src/domains/leaflet/share/LeafletSharePage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

오늘의 전단 공유 page가 protected sidebar layout 안에서 진입되는지 확인합니다. 실제 공유 link 생성과 배포 상태는 후속 flow 작업에서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/leaflets/share` route가 `오늘의 전단 공유하기` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 공유 링크 생성, 복사, preview, 배포 상태는 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `오늘의 전단 공유하기`를 제공합니다.
- keyboard: sidebar item은 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item은 현재 route에 `aria-current="page"`를 적용합니다.

## Verification

- [ ] `/leaflets/share` route renders `오늘의 전단 공유하기`
- [ ] route renders sidebar complementary landmark
- [ ] sidebar `오늘의 전단 공유하기` link has `aria-current="page"`
