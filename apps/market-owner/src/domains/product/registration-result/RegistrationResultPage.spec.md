# React Page Spec: `RegistrationResultPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `registration-result`
- Route: `/products/registration-result`
- Path: `apps/market-owner/src/domains/product/registration-result/RegistrationResultPage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

상품 등록 결과 확인 page가 protected route이지만 sidebar 없는 layout에서 진입되는지 확인합니다. 결과 데이터와 완료 flow는 후속 작업에서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- No-sidebar protected layout responsibility stays in `src/app/layouts/NoSidebarLayout.tsx`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/products/registration-result` route가 `상품 등록 결과 확인` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 홈 link는 `/`로 이동합니다.
- 등록 결과 데이터, 완료 CTA, 공유 진입은 후속 flow 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `상품 등록 결과 확인`을 제공합니다.
- keyboard: 홈 link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.

## Verification

- [ ] `/products/registration-result` route renders `상품 등록 결과 확인`
- [ ] route does not render sidebar complementary landmark
- [ ] home link routes to `/`
