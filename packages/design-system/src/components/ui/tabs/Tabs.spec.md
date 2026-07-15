# Component Spec: `Tabs`

## Purpose

`Tabs`는 같은 화면 안에서 연관된 콘텐츠 패널을 상태 기반으로 전환하는 디자인시스템 UI입니다.

URL 또는 query string으로 선택 상태를 남겨야 하는 navigation UI는 `TabNav`가 담당합니다. 두 컴포넌트는 같은 시각 토큰을 공유하되 semantic role과 사용 목적을 분리합니다.

## Usage Location

- `packages/design-system/src/components/ui/tabs/Tabs.tsx`

## Category

- `ui`

## Requirements

- [ ] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [ ] public props와 상태를 명확히 정의합니다.
- [ ] 필요한 접근성 동작을 보장합니다.
- [ ] token 또는 CSS variable을 우선 사용합니다.
- [ ] route/searchParams 기반 navigation을 상태형 panel 전환 API에 섞지 않습니다.

## UI Structure

```text
Tabs
  List
    Trigger
    Trigger
  Panel
  Panel
```

## Public API

```tsx
<Tabs defaultValue='today'>
  <Tabs.List aria-label='할인 유형'>
    <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
    <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value='today'>오늘의 특가 콘텐츠</Tabs.Panel>
  <Tabs.Panel value='period'>기간 할인 콘텐츠</Tabs.Panel>
</Tabs>
```

- `Tabs`는 `Tabs.Root`와 동일한 root component입니다.
- `value`와 `onValueChange`를 사용하면 제어형으로 동작합니다.
- `defaultValue`를 사용하면 비제어형으로 동작합니다.
- `activationMode`는 `automatic`을 기본값으로 하며, `manual`이면 방향키는 focus만 이동하고 `Enter` 또는 `Space`로 선택합니다.
- `Tabs.Panel`은 선택된 panel만 mount합니다. `forceMount`가 `true`이면 선택되지 않은 panel도 `hidden` 상태로 유지합니다.

## Props

### `Tabs`

- `value`: 선택된 tab value입니다. 제어형에서 사용합니다.
- `defaultValue`: 초기 선택 tab value입니다. 비제어형에서 사용합니다.
- `onValueChange`: 선택값이 바뀔 때 호출됩니다.
- `activationMode`: `automatic` 또는 `manual`입니다.
- `idPrefix`: `aria-controls` / `aria-labelledby` 연결 id prefix를 지정합니다.

### `Tabs.Trigger`

- `value`: 연결할 tab value입니다.
- `disabled`: 선택과 keyboard 탐색에서 제외합니다.

### `Tabs.Panel`

- `value`: 연결할 tab value입니다.
- `forceMount`: 선택되지 않은 panel을 DOM에 유지할지 결정합니다.

## States

- active: `neutral/90`, `body-1-semibold`, 하단 2px indicator
- default: `neutral/50`, `body-1-medium`
- disabled: opacity를 낮추고 pointer 및 keyboard 선택을 막음
- loading: 지원하지 않음
- invalid/error: 지원하지 않음

## Behavior

1. `Tabs.Trigger`를 클릭하면 연결된 `Tabs.Panel`이 선택됩니다.
2. `Tabs.List` 안에서 `ArrowRight` / `ArrowDown`은 다음 enabled tab으로 focus를 이동합니다.
3. `Tabs.List` 안에서 `ArrowLeft` / `ArrowUp`은 이전 enabled tab으로 focus를 이동합니다.
4. `Home`은 첫 enabled tab, `End`는 마지막 enabled tab으로 focus를 이동합니다.
5. `activationMode="automatic"`이면 focus 이동과 동시에 선택값도 변경됩니다.
6. `activationMode="manual"`이면 focus만 이동하고 `Enter` 또는 `Space`로 선택합니다.

## Styling

- layout: tab list는 inline-flex입니다.
- spacing: Figma `edit_tab_container` 기준으로 item 간 gap은 16px입니다.
- item height: 별도 최소 높이를 두지 않고 텍스트 line-height와 상태별 padding으로 결정합니다.
- indicator spacing: selected tab의 text와 하단 indicator 사이 간격은 8px입니다.
- responsive: item text는 줄바꿈하지 않습니다. overflow 처리는 호출부 layout이 담당합니다.
- hover/focus/disabled: focus-visible ring과 disabled opacity를 제공합니다.
- token usage: typography와 color는 `typography`, `atomic`, `semantic` token을 사용합니다.

## Accessibility

- `Tabs.List`: `role="tablist"`를 사용합니다.
- `Tabs.Trigger`: `role="tab"`, `aria-selected`, `aria-controls`, `id`를 사용합니다.
- `Tabs.Panel`: `role="tabpanel"`, `aria-labelledby`, `id`를 사용합니다.
- `Tabs.List`에는 의미 있는 `aria-label` 또는 `aria-labelledby`를 권장합니다.
- keyboard interaction은 WAI-ARIA tabs pattern을 따릅니다.
- focus-visible outline을 제공합니다.

## Storybook

- [ ] Default
- [ ] Disabled when supported
- [ ] Controlled
- [ ] Manual activation
- [ ] Active left/right container states

- [ ] `Tabs` value export
- [ ] `TabsProps` type export
- [ ] no private helper export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] `pnpm --filter @dongchimi/design-system build`
