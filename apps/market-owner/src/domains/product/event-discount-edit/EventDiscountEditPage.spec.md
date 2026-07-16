# React Page Spec: `EventDiscountEditPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-edit`
- Route: `/products/event-discount/edit`
- Path: `apps/market-owner/src/domains/product/event-discount-edit/EventDiscountEditPage.tsx`
- Jira: DCMSM-15, DCMSM-38, DCMSM-60
- Status: Implemented

## Purpose

행사 할인 상품 수정 page가 protected sidebar layout 안에서 진입되고, 상품 수정 업무의 행사 할인 탭 화면을 제공합니다.
상단 헤더와 수정 유형 route tab, 일괄 작업 버튼, 카테고리/정렬 필터는 `ProductEditPageShell`을 공유하고, 행사 할인 상품 카드 영역은 이 페이지의 section이 소유합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Product edit fixed controls live in `domains/product/components/product-edit-page-shell`.
- Event discount product list/card content stays under this page folder.
- Sidebar active state stays in `SidebarLayout`.

## UI States

- loading: 상품 목록 query가 pending이면 목록 영역에 로딩 안내를 표시합니다.
- empty: 등록된 상품이 없으면 `ProductEditProductList`가 empty image, 안내 문구, `/products/event-discount/new` 등록 link를 표시합니다.
- error: 상품 목록 query error는 route `AsyncBoundary`의 복구 가능한 error fallback에서 처리합니다.
  알 수 없는 route는 router fallback에서 처리합니다.
  `productId` search param에 해당하는 상품을 찾지 못하면 error toast를 표시하고 search param을 제거합니다.
- market missing: auth store에 `marketId`가 없으면 마트 정보 등록 route로 이동합니다.
- success: `/products/event-discount/edit` route가 `행사 할인 상품을 수정하세요` heading과 행사 할인 상품 수정 카드 section을 렌더링합니다.

## Data

- query: auth store의 `marketId`로 `useProductListInfiniteQuery({ marketId, type: 'PERIODIC', sort })`
- pagination: 서버의 `nextCursor`를 다음 요청의 `cursor`로 전달하고 목록 하단 진입 시 다음 페이지를 이어 붙입니다.
- mutation: 개별 삭제, 일괄 삭제, `dealType=PERIODIC` 상품 초기화
- fixture: 사용하지 않음
- model: `domains/product/model/product-list.ts`

## Behavior

- `행사 할인` tab은 selected/current 상태입니다.
- `오늘의 특가` tab은 `/products/today-special/edit`으로 route 이동합니다.
- 행사 할인 수정 페이지의 기본 filter는 `카테고리별`입니다.
- page content는 `PERIODIC` 목록 응답을 행사 할인 상품 수정 카드로 표시합니다.
- 카테고리별은 `sort=CATEGORY`, 상품 등록 순은 `sort=LATEST`, 조회수 순은 `sort=VIEW_COUNT`로 재조회합니다.
- 표시할 상품이 없으면 `상품 등록하러 가기` link로 행사 할인 상품 등록 화면에 이동합니다.
- `카테고리별` filter는 shared shell에서 dropdown으로 열립니다.
- `카테고리별` trigger 클릭만으로는 목록 grouping이 바뀌지 않고, dropdown option 선택 후 카테고리별 섹션을 표시합니다.
- 카테고리를 선택한 뒤 `상품 등록 순` 또는 `조회수 순`을 선택하면 선택 카테고리를 초기화하고 category trigger label을 `카테고리별`로 되돌립니다.
- `상품 등록 순` filter는 등록일별 섹션을 표시합니다.
- `조회수 순` filter는 조회수 높은 순 단일 섹션을 표시합니다.
- 개별 상품 카드의 수정 버튼을 누르면 행사 할인 variant의 판매 정보 수정 modal을 엽니다.
- `/products/event-discount/edit?productId={id}`로 진입하면 같은 `productId`를 가진 행사 할인 상품의 개별 수정 modal을 자동으로 엽니다.
- 자동으로 열린 modal이 닫히면 URL에서 `productId` search param을 제거합니다.
- 일괄 기간 수정, 일괄 삭제, 초기화 버튼은 기존 활성 스타일을 유지합니다.
- 기간 일괄 수정 성공 후 refetch된 상품 기간으로 로컬 카드 목록 상태를 다시 초기화합니다.
- 개별 상품 카드의 삭제 버튼은 행사 기간이 남았으면 삭제 확인 modal 확인 후 해당 카드를 목록에서 제거하고, 기간이 지났으면 바로 제거합니다.
- 개별 삭제는 해당 상품의 `productId`로 삭제 API가 성공한 뒤 목록에서 제거합니다.
- 일괄 삭제는 선택 상품의 `productId[]`로 삭제 API가 성공한 뒤 목록에서 제거합니다.
- 삭제 API가 실패하면 기존 상품 목록과 선택 상태를 유지하고 오류를 안내합니다.
- 초기화 확인 시 `dealType: PERIODIC`, `forceDelete: true`로 전체 삭제 API를 요청합니다.
- 개별 삭제, 일괄 삭제, 초기화는 같은 deletion action 인스턴스를 공유하며 요청 중 모든 삭제 action을 비활성화합니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `행사 할인 상품을 수정하세요`를 제공합니다.
- keyboard: sidebar item과 route tab은 native link keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item과 selected tab은 `aria-current="page"`를 적용합니다.
- category dropdown: trigger는 open state를 `aria-expanded`로 제공하고, dropdown option은 selected state를 제공합니다.

## Verification

- [ ] `/products/event-discount/edit` route renders `행사 할인 상품을 수정하세요`
- [ ] sidebar `행사 할인 상품 수정` link has `aria-current="page"`
- [ ] `행사 할인` tab link has `aria-current="page"`
- [ ] `오늘의 특가` tab navigates to `/products/today-special/edit`
- [ ] category filter opens overlay dropdown
- [x] `/products/event-discount/edit?productId=...` opens the matching product edit modal
- [x] closing the search-target edit modal removes `productId` search param
- [x] empty product list renders registration link to `/products/event-discount/new`
- [x] `type=PERIODIC`으로 상품 목록을 조회한다
- [x] 정렬 filter가 `CATEGORY`, `LATEST`, `VIEW_COUNT` query로 연결된다
