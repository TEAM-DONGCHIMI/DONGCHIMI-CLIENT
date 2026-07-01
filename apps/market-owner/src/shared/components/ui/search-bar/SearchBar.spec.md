# Component Spec: SearchBar

## Metadata

- Jira: DCMSM-8
- Component: `SearchBar`
- App: `market-owner`
- Category: `shared/components/ui`
- Path: `apps/market-owner/src/shared/components/ui/search-bar/SearchBar.tsx`
- Status: Implemented

## Purpose

- 사장님 사이트의 desktop header 영역에서 상품 검색 입력 UI를 재사용할 수 있게 제공합니다.
- 검색어 입력, Enter submit, hover/focus/filled/error 시각 상태만 담당합니다.
- 실제 검색 실행 방식, 검색 결과 렌더링, URL query sync, API 호출은 사용하는 화면에서 처리합니다.

## Source Of Truth

- Figma: [APPJAM SearchBar node 244:12024](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=244-12024&t=jrGYtow4lFgwFLhF-4)
- Related page: `apps/market-owner/src/domains/home/overview/HomePage.tsx`

## Scope

- `small`, `medium` 두 가지 size를 지원합니다.
- `default`, `hover`, `focus`, `filled`, `error` 상태를 표현합니다.
- 검색어는 사용자가 입력할 때 최대 17자까지만 입력할 수 있습니다.
- 아이콘은 컴포넌트가 고정하지 않고 `icon` slot으로 주입받습니다.
- 접근성 이름은 기본 `상품 검색`을 사용하고, 필요하면 `aria-label`로 바꿀 수 있습니다.

## Out Of Scope

- 검색 버튼, clear 버튼, 자동완성 목록은 포함하지 않습니다.
- disabled 상태는 현재 Figma variant에 없어서 구현하지 않습니다.
- form validation message와 error 문구 렌더링은 포함하지 않습니다.
- 검색어 저장, debounce, API 호출, 라우팅은 호출부 책임입니다.

## UI Structure

```text
SearchBar
  form role="search"
    icon slot
    input type="search"
```

## Public API

- component: `SearchBar`
- exported types: `SearchBarProps`, `SearchBarSizeTypes`
- props:
  - `icon`: 검색 아이콘 영역에 렌더링할 ReactNode입니다.
  - `placeholder`: input placeholder입니다. 기본값은 `상품 검색...`입니다.
  - `size`: `small` 또는 `medium`입니다. 기본값은 `small`입니다.
  - `defaultValue`: uncontrolled input 초기값입니다.
  - `value`: controlled input 값입니다.
  - `isError`: error border와 `aria-invalid`를 적용합니다.
  - `onValueChange`: input 값이 바뀔 때 현재 값을 전달합니다.
  - `onSearch`: form submit 시 현재 검색어를 전달합니다.
  - native form props: `children`, `onSubmit`, `role`을 제외한 form props를 전달할 수 있습니다.
- caller responsibility:
  - controlled로 사용할 경우 `value`와 `onValueChange`를 함께 관리합니다.
  - `onSearch`에서 실제 검색 동작을 처리합니다.
  - 화면 맥락에 맞는 icon을 전달합니다.
- non-owned behavior:
  - 검색 결과, API, routing, analytics는 SearchBar가 소유하지 않습니다.

## Variants

- `small`: height 40px 기준입니다.
- `medium`: height 44px 기준입니다.

## States

- default: neutral 20 border, white background, neutral 60 placeholder를 사용합니다.
- hover: error가 아닐 때 neutral 80 border로 강조합니다.
- focus: input focus 시 neutral 80 border를 유지합니다.
- filled: 입력값은 neutral 90 text로 표시하고 border 정책은 default/hover/focus를 따릅니다.
- error: negative border와 `aria-invalid`를 적용하며 hover/focus보다 우선합니다.

## Accessibility

- keyboard: input focus와 Enter submit을 지원합니다.
- focus: `:focus-within`으로 form border focus 상태를 표시합니다.
- aria / semantic:
  - wrapper form은 `role="search"`를 사용합니다.
  - form과 input은 동일한 접근성 이름을 가집니다.
  - `isError`가 true면 input에 `aria-invalid="true"`를 적용합니다.

## Styling Constraints

- size: Figma 기준 `small` 40px, `medium` 44px 높이를 유지합니다.
- spacing: icon과 input 사이 gap은 8px입니다.
- color/token: design-system token의 `atomic`, `semantic`, `typography`를 사용합니다.
- overflow: input은 `min-width: 0`과 `width: 100%`로 부모 너비 안에서 줄어들 수 있어야 합니다.

## Verification

- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test -- SearchBar`
- [x] `git diff --check`
- [ ] visual states checked in browser

## Open Questions

- 없음
