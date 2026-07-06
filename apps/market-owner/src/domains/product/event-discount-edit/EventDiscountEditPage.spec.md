# React Page Spec: `EventDiscountEditPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-edit`
- Route: `/products/event-discount/edit`
- Path: `apps/market-owner/src/domains/product/event-discount-edit/EventDiscountEditPage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

행사 할인 상품 수정 page가 protected sidebar layout 안에서 진입되고, 수정하기 tab과 sidebar active state가 같은 route를 바라보는지 확인합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Edit tab route ownership stays with the page, while sidebar active state stays in `SidebarLayout`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/products/event-discount/edit` route가 `행사 할인 상품 수정` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- `행사 할인` tab은 selected/current 상태입니다.
- `오늘의 특가` tab은 `/products/today-special/edit`으로 이동합니다.
- 수정 table, 기간 filter, pagination, mutation은 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `행사 할인 상품 수정`을 제공합니다.
- keyboard: sidebar item과 tab link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item과 selected tab은 `aria-current="page"`를 적용합니다.

## Verification

- [ ] `/products/event-discount/edit` route renders `행사 할인 상품 수정`
- [ ] sidebar `행사 할인 상품 수정` link has `aria-current="page"`
- [ ] `행사 할인` tab link has `aria-current="page"`
