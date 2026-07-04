# Component Spec: `PaginationFooter`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/pagination-footer/PaginationFooter.tsx`
- Status: Implemented

## Purpose

`PaginationFooter`는 사장님 앱의 table/list 하단에서 총 개수, 현재 표시 범위, 페이지 이동 UI를 함께 보여주는 app shared 컴포넌트입니다.
API 요청, route/query string 동기화, total page 계산은 호출부가 담당하고, 컴포넌트는 표시와 callback 전달만 책임집니다.

Figma APPJAM `Table Pagination Footer` node `436:4741`을 기준으로 합니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] page navigation은 design-system `Navigation` 컴포넌트를 조합합니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] Figma 최신안에 맞춰 page size dropdown/control은 렌더링하지 않습니다.

## Props

- `totalCount`: 전체 item 개수입니다.
- `rangeStart` / `rangeEnd`: 현재 페이지에서 표시 중인 item 범위입니다.
- `pages`: 렌더링할 페이지 번호 목록입니다. windowing/ellipsis 정책은 호출부가 결정합니다.
- `currentPage`: 현재 페이지입니다.
- `onPageChange`: 페이지 번호, 이전, 다음 버튼 선택 시 호출됩니다.
- `previousDisabled` / `nextDisabled`: 이전/다음 disabled 상태를 호출부가 직접 제어할 때 사용합니다.
- `getPageAriaLabel`: 페이지 번호 버튼의 accessible name을 커스터마이즈합니다.
- `previousLabel` / `nextLabel`: 이전/다음 버튼 accessible name입니다.

## States

- default: total count, current range, page navigation을 표시합니다.
- first page: `currentPage`가 `pages` 최소값이면 이전 버튼을 비활성화합니다.
- last page: `currentPage`가 `pages` 최대값이면 다음 버튼을 비활성화합니다.
- selected page: `currentPage`와 같은 page button에 selected와 `aria-current="page"`를 적용합니다.
- loading: 지원하지 않습니다. 호출부가 footer 노출 또는 skeleton을 결정합니다.
- error: 지원하지 않습니다. 호출부가 footer 노출 여부를 결정합니다.

## Behavior

1. 이전 버튼을 누르면 design-system `Navigation`이 disabled가 아닐 때 `onPageChange(currentPage - 1)`를 호출합니다.
2. 다음 버튼을 누르면 design-system `Navigation`이 disabled가 아닐 때 `onPageChange(currentPage + 1)`를 호출합니다.
3. 페이지 번호를 누르면 design-system `Navigation`이 `onPageChange(page)`를 호출합니다.
4. 실제 API refetch, query string sync는 실행하지 않습니다.

## Styling

- root: white background, left/right/bottom neutral 30 1px border, bottom 1.2rem radius, 2.4rem horizontal and 1.6rem vertical padding
- summary: body-3 regular, neutral 60, no wrapping
- navigation: design-system `Navigation`의 chevron buttons, `NumButton` page buttons, page gap을 그대로 사용
- responsive: 좁은 부모에서는 horizontal overflow를 허용해 text/navigation overlap을 피합니다.

## Accessibility

- root는 `footer`이고 기본 `aria-label`은 `페이지네이션 정보`입니다.
- page navigation은 `nav aria-label="페이지 탐색"`입니다.
- 현재 page button은 `aria-current="page"`를 가집니다.
- 이전/다음/page button은 native button keyboard interaction과 focus-visible을 유지합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test:unit`
- [x] `pnpm --filter market-owner build`
- [x] `pnpm --filter market-owner build-storybook`
