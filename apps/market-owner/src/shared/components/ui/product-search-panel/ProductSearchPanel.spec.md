# Component Spec: `ProductSearchPanel`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/product-search-panel/ProductSearchPanel.tsx`
- Status: Implemented

## Purpose

`ProductSearchPanel`은 사장님 사이트 header 영역에서 상품명을 입력하고 일치하는 상품을 즉시 선택할
수 있는 검색 패널입니다. `SearchBar` 입력 UI를 재사용하되, 결과 정렬, dropdown 표시, empty/error
feedback, 외부 클릭 닫힘, 선택 callback을 app shared component로 묶습니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
  - 홈 header 검색에서 먼저 사용하지만, 상품 수정/관리 header에서도 같은 상품 검색 패널을 재사용할
    가능성이 높습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
  - 결과 click 후 이동, 상품 정보 fetch, toast 표시 여부는 호출부가 handler/props로 결정합니다.
- [x] public props와 접근성 요구를 명시합니다.

## UI Structure

```text
ProductSearchPanel(root)
  SearchBar(role=search)
  dropdown
    result list
      result button * n
    empty message
    error feedback
```

## Public API

- component: `ProductSearchPanel`
- exported types:
  - `ProductSearchPanelProps`
  - `ProductSearchPanelItemTypes`
- props:
  - `items`: 검색 가능한 상품 목록입니다.
  - `placeholder`: 검색 입력 placeholder입니다. 기본값은 `상품 검색...`입니다.
  - `emptyMessage`: 결과 없음 문구입니다. 기본값은 `검색 결과가 없어요. 상품을 등록해보세요.`입니다.
  - `errorMessage`: 검색/상품 정보 error feedback 문구입니다. 기본값은 `상품 정보를 불러오지 못했어요.`입니다.
  - `status`: `default` 또는 `error`입니다. `error`면 error feedback을 표시하고 검색 입력에 error 상태를 적용합니다.
  - `onSelectProduct`: 검색 결과 상품을 선택하면 호출합니다.
  - `onQueryChange`: 입력값이 바뀌면 호출합니다.
  - native div props: `children`을 제외한 root div props를 전달할 수 있습니다.
- item fields:
  - `id`: stable key입니다.
  - `name`: 검색과 노출에 사용하는 상품명입니다.
  - `label`: 결과 왼쪽 chip 문구입니다. 예: `오늘의 특가`, `행사 할인`.
  - `registeredAt`: 동일 일치도일 때 최신 등록순 정렬에 사용합니다.
- caller responsibility:
  - 상품 선택 후 route 이동 또는 modal open을 처리합니다.
  - 실제 API query/loading/error 상태를 `items`와 `status`로 변환합니다.
  - 상품 정보 fetch 실패 toast가 page-level 위치에 떠야 하면 호출부에서 별도로 렌더링합니다.
- non-owned behavior:
  - URL query sync, API 호출, cache, route, analytics, mutation은 소유하지 않습니다.

## States

- default: 입력값이 없으면 dropdown을 열지 않습니다.
- open: 한 글자 이상 입력하면 검색 결과 dropdown을 엽니다.
- result: 일치도 높은 순으로 표시하고, 동일 일치도는 `registeredAt` 최신순으로 정렬합니다.
- overflow: 결과는 기본 4개 높이로 보이고, 4개 초과 시 4개 row 높이의 scroll 영역으로 전환합니다. 최대 10개까지만 렌더링합니다.
- empty: 검색 결과가 없으면 결과 label과 같은 primary soft Chip으로 message를 표시합니다.
- error: `status='error'`이면 error feedback을 표시합니다.
- disabled/loading: 이번 컴포넌트 public API에는 포함하지 않습니다. API 연동 시 별도 상태가 필요하면 props를 확장합니다.

## Behavior

1. 입력값이 trim 기준 1자 이상이면 dropdown을 엽니다.
2. 검색창과 dropdown 사이 gap은 4px입니다.
3. 검색 결과는 다음 순서로 정렬합니다.
   - 완전 일치
   - 시작 일치
   - 포함 일치
   - label 포함 일치
   - 같은 일치도면 최신 등록순
4. 외부 영역을 pointer/click하면 dropdown을 닫습니다.
5. 결과 item hover 시 해당 button에 focus를 이동해 hover/focus 영역을 일치시킵니다.
6. 결과 item click 시 `onSelectProduct(item)`만 호출합니다.

## Accessibility

- search input은 내부 `SearchBar`의 `role="search"`와 accessible name을 유지합니다.
- dropdown은 `aria-label="상품 검색 결과"`를 가진 list로 렌더링합니다.
- 각 결과는 native `button`으로 렌더링해 keyboard activation을 지원합니다.
- empty message는 `role="status"`로 노출합니다.
- error feedback은 `Toast status="error"`의 `role="alert"`를 사용합니다.
- 외부 클릭 닫힘은 keyboard focus-visible 스타일을 제거하지 않습니다.

## Styling Constraints

- width: `SearchBar`와 dropdown은 같은 254px 폭을 사용합니다.
- gap: search panel과 dropdown 사이 4px.
- dropdown: white surface, radius 12px, subtle shadow.
- result list: Figma 기준 8px vertical padding, 20px horizontal padding, item gap 4px, item height 40px를
  사용합니다. 4개 초과 시 max-height는 `40px * 4 + 4px * 3 + 16px = 188px`입니다.
- result item: label chip + product name, one-line ellipsis. 상품명은 Figma 기준 body-2 regular에 맞춥니다.
- result label chip: Figma default category chip 기준 caption-1 regular, primary soft 색상에 맞춥니다.
- result item hover/focus: neutral 10 background로 영역을 강조합니다.
- empty: 결과 label과 동일한 `Chip color="primary" variant="soft"`를 중앙에 표시합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner test -- ProductSearchPanel`
- [x] `pnpm --filter market-owner test -- DesktopHeader`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner build`
