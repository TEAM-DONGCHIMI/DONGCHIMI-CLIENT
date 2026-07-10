# Component Spec: `DesktopUploadHeader`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/desktop-upload-header/DesktopUploadHeader.tsx`
- Figma:
  - [desktopupload_header node 427:7694](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=427-7694&m=dev)
  - [segment navi node 427:7557](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=427-7557&m=dev)
  - [select node 442:5765](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=442-5765&m=dev)
- Status: Implemented

## Purpose

- 사장님 사이트 상품 결과 확인 뷰에서 상품 상태 탭, 선택 상품 액션, 정렬 액션, 상품 검색을 한 줄로 제공하는 desktop upload header입니다.
- segment navigation의 텍스트는 고정하고, 숫자는 호출부에서 전달받습니다.
- 선택된 상품 개수가 전달된 경우 `선택삭제` 액션의 활성/비활성 상태를 표현합니다.
- 정렬 또는 검색 관련 props가 전달된 경우에만 해당 액션을 렌더링합니다.
- 검색 UI는 기존 `SearchBar`를 재사용하고, 실제 검색 결과 반영은 호출부가 처리합니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.

## Props

- `selectedSegment`: 현재 활성화할 segment입니다. `total`, `completed`, `needsEdit` 중 하나를 전달합니다.
- `totalCount`: `총 상품` 옆에 표시할 숫자입니다.
- `completedCount`: `등록 완료` 옆에 표시할 숫자입니다.
- `needsEditCount`: `수정 필요` 옆에 표시할 숫자입니다.
- `selectedCount`: 선택된 상품 개수입니다. 전달된 경우에만 선택 상품 액션 영역을 렌더링합니다.
- `searchValue`, `onSearchValueChange`, `onSearch`: 내부 SearchBar로 전달하는 검색 관련 props입니다. 하나라도 전달된 경우에만 검색 UI를 렌더링합니다.
- `onSegmentChange`: segment 버튼 클릭 시 선택한 segment 값을 호출부에 전달합니다. 호출부는 이 값으로 `selectedSegment`를 갱신하고, 필요하면 아래 상품 목록/결과 영역도 함께 변경합니다.
- `onDeleteSelected`: 선택삭제 버튼 클릭 시 호출합니다. `selectedCount` 또는 이 handler가 전달된 경우 선택 상품 액션 영역을 렌더링합니다.
- `onSortClick`: 정렬 버튼 클릭 시 호출합니다. `onSortClick` 또는 `sortDropdownId`가 전달된 경우 정렬 액션을 렌더링합니다.
- `className`: header wrapper className을 추가할 때 사용합니다.

## States

- total / completed / needsEdit: `selectedSegment`로 받은 활성 segment에 neutral 60 background와 white text를 적용합니다.
- no selection: `selectedCount`가 0이면 선택삭제 버튼을 disabled로 두고 neutral 30 text를 사용합니다.
- selected: `selectedCount`가 1 이상이면 선택삭제 버튼을 활성화하고 negative text를 사용합니다.
- no optional action: 선택, 정렬, 검색 관련 props가 없으면 오른쪽 action group을 렌더링하지 않습니다.
- search focus/hover/error/filled: 내부 SearchBar 상태 정책을 따릅니다.
- loading/error: Header 자체 상태로는 제공하지 않습니다.

## Structure

- `DesktopUploadHeader`
  - private `SegmentNavigation`
  - private `SelectedProductAction`
  - private `SortButton`
  - shared `SearchBar`

## Usage

```tsx
const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('total');

return (
  <DesktopUploadHeader
    completedCount={112}
    needsEditCount={12}
    onSegmentChange={setSelectedSegment}
    selectedSegment={selectedSegment}
    totalCount={128}
  />
);
```

## Accessibility

- Header wrapper는 semantic `header` element를 사용합니다.
- Segment navigation은 `nav aria-label="상품 상태 필터"`로 노출합니다.
- 활성 segment에는 `aria-current="page"`를 적용합니다.
- 선택삭제 버튼은 선택된 상품이 없을 때 `disabled`입니다.
- 검색 입력의 접근성 이름과 keyboard submit은 SearchBar를 따릅니다.

## Styling Constraints

- Segment item width는 150px 기준입니다.
- Segment item label은 body-2 regular, count는 body-2 semibold를 사용합니다.
- 오른쪽 action group gap은 16px입니다.
- 정렬 버튼은 36px height, neutral 10 background, pill radius를 사용합니다.
- 디자인시스템 token의 `atomic`, `semantic`, `typography`를 사용합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test -- DesktopUploadHeader DesktopHeader SearchBar`
- [x] `pnpm --filter market-owner build`
