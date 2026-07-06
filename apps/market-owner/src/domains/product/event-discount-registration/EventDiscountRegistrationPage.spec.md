# React Page Spec: `EventDiscountRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-registration`
- Route: `/products/event-discount/new`
- Path: `apps/market-owner/src/domains/product/event-discount-registration/EventDiscountRegistrationPage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

행사 할인 상품 등록 page가 protected sidebar layout 안에서 진입되는지 확인합니다. 실제 행사 할인 등록 form과 API는 후속 flow 작업에서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/products/event-discount/new` route가 `행사 할인 상품 등록` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 등록 결과 link는 `/products/registration-result`로 이동합니다.
- 행사 기간, 상품 form, validation, submit mutation은 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `행사 할인 상품 등록`을 제공합니다.
- keyboard: sidebar item과 결과 link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item은 현재 route에 `aria-current="page"`를 적용합니다.

## Verification

- [ ] `/products/event-discount/new` route renders `행사 할인 상품 등록`
- [ ] route renders sidebar complementary landmark
- [ ] sidebar `행사 할인 상품 등록` link has `aria-current="page"`
