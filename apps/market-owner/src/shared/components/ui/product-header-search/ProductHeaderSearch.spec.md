# Component Spec: `ProductHeaderSearch`

## Metadata

- Jira: DCMSM-38
- Path: `apps/market-owner/src/shared/components/ui/product-header-search/ProductHeaderSearch.tsx`
- Owner: market-owner shared UI
- Status: Implemented

## Purpose

`ProductHeaderSearch`는 사장님웹 헤더의 상품 검색 동작을 공통으로 조합합니다.
표현 UI는 `ProductSearchPanel`을 재사용하고, query debounce, pending 상태, 검색 결과 선택 전달을 담당합니다.
수정 route 생성과 navigation, 상품 상세 로드 실패 정책은 호출부가 소유합니다.

## Public API

- `products`: 검색 대상 상품 목록입니다. API 연동 전 fixture 또는 adapter 결과를 전달합니다.
- 현재 홈 호출부는 app-shared fixture를 전달합니다. 상품 수정 shell은 실데이터 source가 연결되기 전까지
  검색 영역을 숨깁니다.
- `getProductsByQuery`: 검색 소스를 교체할 수 있는 선택적 filter/adapter입니다. 기본값은 상품명에 대한 부분 검색입니다.
- `onSelectProduct`: 검색 결과에서 선택한 상품을 호출부에 전달합니다. 호출부는 route 이동, modal open, error feedback 같은 후속 정책을 결정합니다.

## Behavior

- 한 글자 이상 입력하면 `ProductSearchPanel` dropdown을 엽니다.
- debounce 반영 전에는 pending 상태를 전달합니다.
- 기본 검색은 상품명만 비교하며, `dealType`은 결과 chip과 수정 route 선택에만 사용합니다.
- 검색 결과를 선택하면 해당 `ProductHeaderSearchProductTypes`를 `onSelectProduct`에 전달합니다.
- 현재 검색 결과에서 상품을 찾지 못하면 선택 이벤트를 전달하지 않습니다.

## Accessibility

- 검색 input, dropdown list, pending/empty/error state의 semantics는 `ProductSearchPanel`과 `SearchBar` 계약을 따릅니다.

## Verification

- [x] selected search result is forwarded through `onSelectProduct`
- [x] home call site creates the edit route with the `productId` search param
- [x] home call site keeps the current page and shows error feedback when product info cannot be loaded
