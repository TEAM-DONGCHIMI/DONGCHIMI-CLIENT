# Component Spec: `ListButton`

## Purpose

`ListButton`은 리스트나 메뉴에서 텍스트 항목을 선택할 때 사용하는 166px content-width 버튼 primitive입니다.
디자인시스템 안에서는 native button 동작, default/assistive selected/primary selected 상태, optional left icon 슬롯, focus-visible 상태, 접근 가능한 선택 상태 표현만 책임집니다.

## Usage Location

- `packages/design-system/src/components/ui/list-button/ListButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 462:5212의 `list button` 컴포넌트 default, assistive selected, primary selected 상태를 기준으로 합니다.
- [x] Figma APPJAM node 480:10743의 checkbox/icon slot list button 사례를 기준으로 합니다.

## UI Structure

```text
ListButton
  button
    leftIcon?
    text label
```

## Props

### children

- type: `ReactNode`
- required: `true`
- description: 버튼 내부에 렌더링되는 텍스트 라벨입니다.

### leftIcon

- type: `ReactNode`
- required: `false`
- description: 라벨 왼쪽에 배치되는 장식용 아이콘 슬롯입니다. 실제 아이콘 노드가 있으면 Figma checkbox 자리처럼 24px 영역을 유지하고, `selected=true`일 때만 아이콘을 표시합니다. `null`, `undefined`, `false`이면 슬롯을 렌더링하지 않습니다.

### selected

- type: `boolean`
- required: `false`
- default: `false`
- description: 현재 선택된 항목인지 표현합니다. `leftIcon`이 없으면 `color`에 맞는 selected 배경을 적용하고, `leftIcon`이 있으면 아이콘 표시 여부만 제어합니다. 항상 `aria-pressed`를 selected 값으로 전달합니다.

### color

- type: `RecipeVariantProps<typeof listButton>['color']`
- required: `false`
- default: `assistive`
- values: `assistive`, `primary`
- description: selected 상태의 색상 계열을 정합니다. `leftIcon`이 있거나 `selected=false`이면 시각적으로 default 상태를 유지합니다.

### internal style variants

- description: `hasLeftIcon`은 내부 recipe 분기용 값이며 public prop으로 노출하지 않습니다. 호출부는 `leftIcon` 전달 여부만 제어합니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `children`, `color`를 제외한 native button props를 전달합니다. Figma 기준 별도 disabled/loading/error 시각 상태는 정의하지 않습니다.

## States

- default: 별도 배경 없이 neutral 90 텍스트로 표시합니다.
- hover: content 영역보다 좌우 12px 확장된 neutral 10 배경을 표시합니다.
- assistive selected: `selected=true`, `color=assistive`이면 content 영역보다 좌우 12px 확장된 neutral 10 배경과 neutral 90 텍스트로 표시합니다.
- primary selected: `selected=true`, `color=primary`이면 content 영역보다 좌우 12px 확장된 primary light 배경과 primary strong 텍스트로 표시합니다.
- icon selected: `leftIcon`이 있으면 selected 배경/텍스트 색상을 적용하지 않고, `selected=true`일 때만 24px 슬롯 안에 아이콘을 표시합니다.
- disabled: native disabled prop 전달은 가능하지만, 현재 Figma 범위의 시각 상태로는 지원하지 않습니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. `selected`는 선택 여부를 나타내는 controlled visual state입니다.
4. `selected`가 `true`이면 `aria-pressed=true`를 전달합니다.
5. `color`는 `leftIcon`이 없는 selected 상태일 때만 시각적으로 의미가 있습니다.
6. `leftIcon`은 장식용 슬롯이므로 `aria-hidden` 영역에 렌더링합니다.
7. `leftIcon` 영역은 같은 button 내부에 있으므로 아이콘 영역을 클릭해도 ListButton의 `onClick`이 실행됩니다.
8. `aria-pressed`는 호출부에서 덮어쓸 수 없고 항상 `selected` 값과 동기화됩니다.
9. `leftIcon`이 `null`, `undefined`, `false`이면 icon slot을 만들지 않습니다.

## Styling

- layout: `inline-flex`, center alignment, fixed 166px content width and 40px height. selected background는 좌우 12px씩 확장되어 190px action box처럼 표시합니다.
- spacing: padding 0, centered label. `leftIcon`이 있으면 start alignment, 24px icon slot, 4px gap을 사용합니다. selected 여부와 상관없이 icon slot은 유지합니다.
- shape: 8px radius
- responsive: ListButton 자체는 고정 크기이며 부모 layout이 배치를 책임집니다.
- overflow: 라벨이 고정 폭을 넘으면 ellipsis로 처리합니다.
- hover: default와 icon 타입에서 neutral 10 배경을 표시하고, selected 색상은 hover에서도 유지합니다.
- focus: focus-visible outline을 사용합니다.
- token usage: 색상은 `atomic.neutral`, `semantic.primary`를 사용합니다. typography는 Figma의 15px Regular, 146.7% line-height, 0.96% letter-spacing 값을 component-local 값으로 둡니다.

## Accessibility

- semantic element: `button`
- accessible name: 텍스트 라벨 기반
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 outline을 표시합니다.
- ARIA: `selected` 상태는 `aria-pressed`로 노출하고, `leftIcon` 슬롯은 장식용으로 `aria-hidden` 처리합니다.

## Storybook

- [x] Default
- [x] Assistive selected
- [x] Primary selected
- [x] Left icon
- [x] Left icon hidden when not selected
- [x] Left icon controlled toggle example
- [ ] Disabled when supported: 별도 시각 상태 미지원
- [ ] Loading when supported
- [ ] Invalid/Error when supported
- [x] State differences when supported

## Public API

- [x] `ListButton` value export
- [x] `ListButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
