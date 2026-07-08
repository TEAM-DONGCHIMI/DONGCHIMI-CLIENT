# Component Spec: `DesktopHeader`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/desktop-header/DesktopHeader.tsx`
- Figma:
  - [APPJAM DesktopHeader node 244:11926](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=244-11926&m=dev)
  - [APPJAM Header_upload page node 1496:116520](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=1496-116520&m=dev)
- Status: Implemented

## Purpose

- 사장님 사이트 desktop 화면 상단에서 현재 위치와 상품 검색 UI를 함께 보여주는 앱 내부 shared header입니다.
- `default` 모드는 상위 페이지와 현재 페이지 breadcrumb를 표시합니다.
- `onlyHome` 모드는 상위 페이지가 없는 홈 화면에서 단일 home label을 표시합니다.
- 상품 검색 UI는 `SearchBar` 컴포넌트를 재사용하고, 실제 검색 결과 이동/포커싱은 호출부가 처리합니다.
- 상품 검색 UI의 leading icon은 design-system `IcSearchSizeSmall`을 사용합니다.
- 로고가 필요한 화면은 `logo` 슬롯을 전달해 좌측 로고 영역을 표시합니다. 기존 default 사용법은 바꾸지 않습니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.

## Props

- `variant`: `default`, `onlyHome`입니다. 기본값은 `default`입니다.
- `logo`: `default` 모드에서 좌측 92px x 32px 영역에 렌더링할 로고 슬롯입니다. 실제 이미지 선택은 호출부가 책임집니다.
- `showSearchBar`: 검색 영역 표시 여부입니다. 기본값은 `true`입니다. `false`이면 검색 관련 props를 함께 전달하지 않습니다.
- `parentLabel`: `default` 모드에서 상위 페이지 이름을 표시합니다. `default` 모드에서는 필수입니다.
- `currentLabel`: `default` 모드에서 현재 페이지 이름을 표시합니다. `default` 모드에서는 필수입니다.
- `homeLabel`: `onlyHome` 모드에서 표시할 홈 label입니다. 기본값은 `동치미 작업 홈`입니다.
- `searchValue`, `onSearchValueChange`, `onSearch`: 기본 SearchBar로 전달하는 검색 관련 props입니다. `searchSlot`과 함께 전달하지 않습니다.
- `searchSlot`: 기본 SearchBar 대신 렌더링할 custom 검색 영역입니다. 상품 검색 dropdown처럼 SearchBar
  바깥의 결과 패널과 선택 flow가 필요한 경우 사용합니다. `searchValue`, `onSearchValueChange`, `onSearch`와
  함께 전달하지 않습니다.
- `className`: 호출부에서 header wrapper className을 추가로 전달할 때 사용합니다.

## States

- default: 상위 페이지, `/`, 현재 페이지, SearchBar를 표시합니다.
- onlyHome: `homeLabel`과 SearchBar를 표시합니다.
- logo: `logo`가 있으면 좌측 로고 슬롯, 상위 페이지, `/`, 현재 페이지를 표시합니다.
- no search: `showSearchBar`가 `false`면 SearchBar를 렌더링하지 않습니다.
- custom search: `searchSlot`이 있으면 기본 SearchBar 대신 해당 slot을 렌더링합니다.
- search focus/hover/error/filled: 내부 SearchBar 상태 정책을 따릅니다.
- disabled/loading/error: DesktopHeader 자체 상태로는 제공하지 않습니다.

## Accessibility

- Header wrapper는 semantic `header` element를 사용합니다.
- `default` 모드 breadcrumb는 `nav aria-label="현재 위치"`로 노출합니다.
- 로고 슬롯이 있는 breadcrumb도 `nav aria-label="현재 위치"`로 노출합니다.
- 현재 페이지 label에는 `aria-current="page"`를 적용합니다.
- 검색 입력의 접근성 이름과 keyboard submit은 SearchBar를 따릅니다.
- 검색 아이콘은 decorative icon으로 노출하고 접근성 이름은 검색 입력이 제공합니다.

## Styling Constraints

- desktop header 높이는 64px 기준입니다.
- 좌우 padding은 40px 기준입니다.
- wrapper background는 페이지 배경을 따르도록 transparent입니다.
- breadcrumb gap은 16px입니다.
- SearchBar leading icon은 16px x 16px `IcSearchSizeSmall`입니다.
- 로고 슬롯이 있는 header는 APPJAM node 1496:116520 기준으로 wrapper height 64px, 좌우 padding 24px, logo slot 92px x 32px, breadcrumb 영역 좌우 padding 40px을 사용합니다.
- typography와 color는 design-system token을 사용합니다.
- breadcrumb parent label은 긴 텍스트에서 ellipsis 처리합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test -- DesktopHeader`
- [x] `pnpm --filter market-owner build`
- [ ] browser visual check
