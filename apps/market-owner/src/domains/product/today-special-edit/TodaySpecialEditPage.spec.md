# React Page Spec: `TodaySpecialEditPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `today-special-edit`
- Route: `/products/today-special/edit`
- Path: `apps/market-owner/src/domains/product/today-special-edit/TodaySpecialEditPage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

오늘의 특가 상품 수정 page가 protected sidebar layout 안에서 진입되고, 상품 수정 업무의 오늘의 특가 탭 화면을 제공합니다.
상단 헤더와 수정 유형 route tab, 일괄 작업 버튼, 정렬 필터는 `ProductEditPageShell`을 공유하고, 오늘의 특가 상품 카드 영역은 이 페이지의 section이 소유합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Product edit fixed controls live in `domains/product/components/product-edit-page-shell`.
- Today special product list/card content stays under this page folder.
- Sidebar active state stays in `SidebarLayout`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다. 레이아웃 확인용 샘플 카드 목록을 표시합니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/products/today-special/edit` route가 `오늘의 특가 상품을 수정하세요` heading과 오늘의 특가 상품 수정 카드 section을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: `fixtures/today-special-edit.fixture.ts`
- model: none

## Behavior

- `오늘의 특가` tab은 selected/current 상태입니다.
- `행사 할인` tab은 `/products/event-discount/edit`으로 이동합니다.
- page content는 선택된 filter에 따라 오늘의 특가 샘플 상품 수정 카드를 등록일별, 조회수순으로 표시합니다.
- 오늘의 특가 수정 페이지에는 카테고리 filter를 노출하지 않습니다.
- `상품 등록 순` filter는 등록일별 섹션을 표시합니다.
- `조회수 순` filter는 조회수 높은 순 단일 섹션을 표시합니다.
- 일괄 기간 수정, 일괄 삭제, 초기화 버튼은 shared shell에서 레이아웃 button으로 렌더링합니다.
- 실제 상품 목록 query, mutation, selection, pagination, table/list 확장은 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `오늘의 특가 상품을 수정하세요`를 제공합니다.
- keyboard: sidebar item과 tab link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item과 selected tab은 `aria-current="page"`를 적용합니다.

## Verification

- [ ] `/products/today-special/edit` route renders `오늘의 특가 상품을 수정하세요`
- [ ] sidebar `오늘의 특가 상품 수정` link has `aria-current="page"`
- [ ] `오늘의 특가` tab link has `aria-current="page"`
- [ ] `행사 할인` tab navigates to `/products/event-discount/edit`
- [ ] category filter is not rendered
