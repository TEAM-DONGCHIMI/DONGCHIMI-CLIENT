# Component Spec: `Dropdown`

## Purpose

`Dropdown`은 목록이나 페이지에서 탐색 조건을 선택할 때 사용하는 메뉴 패널 컨테이너입니다.
`ListButton` 항목들을 담는 표현용 surface이며, 디자인시스템 안에서는 패널 외형(카드, 그림자,
padding, 항목 간격)과 slot 구조만 책임집니다.
열림/닫힘, 트리거, 선택 상태 관리, 키보드 로빙 네비게이션은 호출부가 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/dropdown/Dropdown.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 462:5192 `Dropdown`의 Page/category use를 기준으로 합니다.
- [x] 항목은 새 컴포넌트를 만들지 않고 기존 `ListButton`을 조합합니다.

## UI Structure

```text
Dropdown
  div (panel)
    children (ListButton 항목들)
```

## Props

### children

- type: `ReactNode`
- required: `true`
- description: 패널 안에 렌더링되는 항목들입니다. 일반적으로 `ListButton`을 나열합니다.

### native div props

- type: `ComponentPropsWithoutRef<'div'>`
- description: `className`을 포함한 native div props를 전달합니다. 선택 맥락에 맞는
  `role`(예: `menu`, `listbox`, `group`)과 `aria-label`은 호출부가 주입합니다.

## States

- default: 항목들을 세로로 배치한 패널을 표시합니다.
- empty: children이 없으면 빈 패널만 렌더링합니다. 별도 empty 시각은 정의하지 않습니다.
- disabled / loading / invalid/error: 지원하지 않습니다. 개별 항목 상태는 `ListButton`이 책임집니다.

## Behavior

1. 패널 외형만 렌더링하고 children을 세로로 배치합니다.
2. 열림/닫힘, 트리거 연결, 선택 상태, 키보드 네비게이션은 호출부 책임입니다.
3. 항목의 선택 표현(`aria-pressed`)과 상호작용은 `ListButton`이 담당합니다.

## Styling

- layout: `flex` column, 항목 간 `0.4rem`(4px) gap, stretch 정렬.
- spacing: padding `0.8rem 2rem`(8px 20px).
- surface: 배경 `atomic.common[0]`, `1px` `atomic.neutral[10]` 테두리, `12px` radius.
- shadow: `shadow.normal.small` token을 사용합니다. (Figma의 다층 그림자 대신 token 우선)
- clip: 패널은 `overflow: clip`으로 자식이 둥근 모서리(radius 12) 밖으로 나가지 않게 잘라냅니다.
- width: 하드코딩하지 않습니다. 폭은 고정 폭 `ListButton`(166px)과 좌우 padding으로 결정되며,
  필요 시 호출부가 `className`으로 오버라이드합니다. Figma 206px는 stories 기본 예시로만 사용합니다.
- overflow: 항목 overflow는 `ListButton`이 ellipsis로 처리합니다.
- token usage: 색상은 `atomic`, 그림자는 `shadow` token을 사용합니다.

## Accessibility

- semantic element: `div` 컨테이너.
- role: 강제하지 않습니다. 선택 맥락에 맞는 role(`menu`/`listbox`/`group`)과 accessible name은
  호출부가 주입합니다. 완전한 menu/listbox 키보드 패턴이 필요하면 후속 이슈에서 다룹니다.
- keyboard interaction: 항목(`ListButton`)의 native button interaction을 사용합니다.
- focus-visible: 각 `ListButton`이 focus-visible outline을 제공합니다.
- ARIA: 선택 상태는 항목의 `aria-pressed`로 노출합니다.

## Public API

- [ ] `Dropdown` value export
- [ ] `DropdownProps` type export
- [ ] no private helper export
- [ ] 항목용 별도 컴포넌트(`DropdownItem`)를 만들지 않고 `ListButton`을 재사용

### Usage

```tsx
// Page use — assistive 단일 선택
<Dropdown>
  <ListButton selected>최신순</ListButton>
  <ListButton>인기순</ListButton>
  <ListButton>가격순</ListButton>
</Dropdown>

// category use — primary 단일 선택
<Dropdown>
  <ListButton color="primary" selected>전체</ListButton>
  <ListButton color="primary">카테고리 1</ListButton>
</Dropdown>
```

## Storybook

- [ ] Page (assistive 단일 선택)
- [ ] Category (primary 단일 선택)
- [ ] Long text overflow
- [ ] Checkbox multi-select: 범위 외 (ListButton `checkbox` variant 보완 후 별도 이슈에서 지원)
- [ ] Disabled / Loading / Invalid: 미지원

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
