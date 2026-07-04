# Component Spec: `TabNav`

## Purpose

`TabNav`는 탭과 같은 시각 체계를 사용하지만, query string 또는 route 이동처럼 URL에 선택 상태가 남아야 하는 navigation UI를 담당합니다.

`Tabs`가 같은 화면 안의 상태 기반 panel 전환을 담당한다면, `TabNav`는 link 기반 navigation semantics를 유지합니다.

## Usage Location

- `packages/design-system/src/components/ui/tabs/TabNav.tsx`

## Category

- `ui`

## Requirements

- [ ] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [ ] public props와 상태를 명확히 정의합니다.
- [ ] 필요한 접근성 동작을 보장합니다.
- [ ] token 또는 CSS variable을 우선 사용합니다.
- [ ] 기본 link 사용에서는 불필요한 client event handler를 만들지 않습니다.

## UI Structure

```text
TabNav
  List
    Item
    Item
```

## Public API

```tsx
<TabNav aria-label='할인 유형'>
  <TabNav.List>
    <TabNav.Item href='?discountType=today' selected>
      오늘의 특가
    </TabNav.Item>
    <TabNav.Item href='?discountType=period'>기간 할인</TabNav.Item>
  </TabNav.List>
</TabNav>
```

- `TabNav`는 `nav`와 link 기반의 navigation pattern입니다.
- Next `Link`, React Router `Link/NavLink`, 일반 `a`를 `as` prop으로 주입할 수 있습니다.
- URL 상태 계산은 호출부가 담당하고, 현재 항목은 `selected`로 전달합니다.
- `selected` 항목은 기본적으로 `aria-current="page"`를 가집니다.
- route/searchParams 기반 탭을 `Tabs`에 억지로 연결하지 않습니다.

## Props

### `TabNav`

- native `nav` props와 ref를 전달합니다.

### `TabNav.List`

- native `div` props와 ref를 전달합니다.

### `TabNav.Item`

- `as`: 렌더링할 link component입니다. 기본값은 `a`입니다.
- `selected`: 현재 URL 상태와 일치하는 항목인지 여부입니다.
- `current`: selected일 때 사용할 `aria-current` 값입니다. 기본값은 `page`입니다.
- `disabled`: navigation을 막고 focus 순서에서 제외합니다.

## States

- active: `neutral/90`, `body-1-semibold`, 하단 2px indicator
- default: `neutral/50`, `body-1-medium`
- disabled: opacity를 낮추고 pointer 및 keyboard navigation을 막음
- loading: 지원하지 않음
- invalid/error: 지원하지 않음

## Behavior

1. `TabNav.Item`은 자체 선택 상태를 갖지 않고 호출부가 계산한 `selected` 값만 표현합니다.
2. `TabNav.Item`은 기본적으로 순수 link처럼 동작하며 내부 event handler를 만들지 않습니다.
3. 호출부가 `onClick`을 전달하면 해당 handler를 그대로 전달합니다.
4. disabled item은 `href`를 제거하고 `aria-disabled`와 `tabIndex={-1}`를 적용합니다.

## Styling

- layout: list는 inline-flex입니다.
- spacing: Figma `edit_tab_container` 기준으로 item 간 gap은 16px입니다.
- responsive: item text는 줄바꿈하지 않습니다. overflow 처리는 호출부 layout이 담당합니다.
- hover/focus/disabled: focus-visible ring과 disabled opacity를 제공합니다.
- token usage: typography와 color는 `typography`, `atomic`, `semantic` token을 사용합니다.

## Accessibility

- `TabNav`: `nav` element를 사용하며 의미 있는 `aria-label` 또는 `aria-labelledby`를 권장합니다.
- `TabNav.Item`: selected 상태에서는 `aria-current="page"`를 기본으로 사용합니다.
- disabled item은 `aria-disabled`와 `tabIndex={-1}`를 적용하고 link navigation 대상에서 제외합니다.
- focus-visible outline을 제공합니다.

## Storybook

- [ ] QueryString
- [ ] ActiveRight
- [ ] Disabled

- [ ] `TabNav` value export
- [ ] `TabNavProps` type export
- [ ] no private helper export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] `pnpm --filter @dongchimi/design-system build`
