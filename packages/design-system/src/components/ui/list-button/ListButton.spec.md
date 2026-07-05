# Component Spec: `ListButton`

## Purpose

`ListButton`은 리스트나 메뉴에서 텍스트 항목을 선택할 때 사용하는 166px content-width 버튼 primitive입니다.
디자인시스템 안에서는 native button 동작, default/assistive selected/primary selected 상태, optional left icon 슬롯, checkbox variant(항상 표시되는 선택 컨트롤), focus-visible 상태, 접근 가능한 선택 상태 표현만 책임집니다.

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
- [x] Figma APPJAM node 480:10743의 leftIcon(selected 시 아이콘) 슬롯 사례를 기준으로 합니다.
- [x] Figma APPJAM node 480:10741/480:10744의 checkbox variant(미체크 시에도 박스 노출, checked 시 primary 박스+흰 체크)를 기준으로 합니다.

## UI Structure

```text
ListButton
  button
    leftIcon?                  # leftIcon variant (selected일 때만 표시)
    checkbox?                  # checkbox variant (leftIcon과 상호배타)
      box                      # 18px, radius 4, 항상 표시
        check icon             # checked(selected)일 때
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
- description: 라벨 왼쪽 24px 슬롯에 배치되는 장식용 아이콘입니다. `selected=true`일 때만 아이콘을 표시하며, `null`/`undefined`/`false`이면 슬롯을 렌더링하지 않습니다. `checkbox`와 상호배타이며, `leftIcon`은 "선택 시 나타나는 장식 아이콘", `checkbox`는 "항상 보이는 선택 컨트롤"로 역할이 다릅니다.

### checkbox

- type: `boolean`
- required: `false`
- default: `false`
- description: 체크박스 variant를 켭니다. `true`면 라벨 왼쪽 24px 슬롯에 항상 보이는 체크박스 박스를 렌더링하고 `selected`가 checked 상태를 제어합니다. `leftIcon`과 동시에 사용할 수 없습니다. checkbox variant에서는 `role="checkbox"`와 `aria-checked`를 컴포넌트가 관리합니다.

### leftIcon · checkbox 상호배타 타입

`leftIcon`과 `checkbox`는 discriminated union으로 동시 사용을 막습니다.

```ts
type ListButtonLeadingProps =
  | { checkbox?: false; leftIcon?: ReactNode }
  | { checkbox: boolean; leftIcon?: never };
```

### selected

- type: `boolean`
- required: `false`
- default: `false`
- description: 현재 선택(또는 checked)된 항목인지 표현합니다. `checkbox=false`이고 `leftIcon`이 없으면 `color`에 맞는 selected 배경을 적용하고, `leftIcon`이 있으면 아이콘 표시 여부를 제어합니다. `checkbox=true`면 체크박스의 checked 상태를 나타냅니다. 접근성은 checkbox variant에서 `aria-checked`, 그 외에는 `aria-pressed`로 노출합니다.

### color

- type: `RecipeVariantProps<typeof listButton>['color']`
- required: `false`
- default: `assistive`
- values: `assistive`, `primary`
- description: selected 상태의 색상 계열을 정합니다. `leftIcon`이 있거나 `selected=false`이면 시각적으로 default 상태를 유지합니다. `checkbox=true`에서는 row selected 배경에 `color`를 적용하지 않습니다. checked box 색상은 Figma checkbox variant 기준으로 항상 `semantic.primary.normal`을 사용합니다.

### internal style variants

- description: `hasLeadingVisual`(checkbox 또는 leftIcon 유무)은 내부 recipe 분기용 값이며 public prop으로 노출하지 않습니다. 호출부는 `leftIcon`/`checkbox` 전달 여부만 제어합니다.

### native button props

- type: `Omit<ComponentPropsWithoutRef<'button'>, 'aria-pressed' | 'aria-checked' | 'role' | 'children' | 'color'>`
- description: 위 omit을 제외한 native button props를 전달합니다. `aria-pressed`·`aria-checked`·`role`은 variant에 따라 컴포넌트가 관리하므로 호출부가 덮어쓸 수 없습니다. Figma 기준 별도 disabled/loading/error 시각 상태는 정의하지 않습니다.

## States

- default: 별도 배경 없이 neutral 90 텍스트로 표시합니다.
- hover: content 영역보다 좌우 12px 확장된 neutral 10 배경을 표시합니다.
- assistive selected: `selected=true`, `color=assistive`, `checkbox=false`이면 content 영역보다 좌우 12px 확장된 neutral 10 배경과 neutral 90 텍스트로 표시합니다.
- primary selected: `selected=true`, `color=primary`, `checkbox=false`이면 content 영역보다 좌우 12px 확장된 primary light 배경과 primary strong 텍스트로 표시합니다.
- icon selected: `leftIcon`이 있으면 selected 배경/텍스트 색상을 적용하지 않고, `selected=true`일 때만 24px 슬롯 안에 아이콘을 표시합니다.
- checkbox unchecked: `checkbox=true`, `selected=false`이면 24px 슬롯 안 18px 박스(radius 4)에 1.5px neutral 70 테두리·투명 배경을 표시합니다.
- checkbox checked: `checkbox=true`, `selected=true`이면 박스를 primary normal 채움+테두리로 표시하고 안에 흰색 체크를 렌더링합니다.
- checkbox row: `checkbox=true`이면 `selected`여도 row action-box 배경(assistive/primary)을 적용하지 않고 checkbox box만 selected를 표현합니다. hover row 배경(neutral 10)은 유지합니다.
- disabled: `disabled` 전달 시 hover 배경을 표시하지 않고 `cursor: not-allowed`를 적용합니다. checkbox variant는 박스를 `neutral/40`(미체크 테두리 / 체크 채움)으로 muted 처리해 활성 checkbox와 구분합니다. checkbox 외 variant는 Figma 범위상 native disabled 외 별도 색 상태를 정의하지 않습니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. `selected`는 선택/checked 여부를 나타내는 controlled visual state입니다.
4. `checkbox=false`면 `aria-pressed={selected}`, `checkbox=true`면 `role="checkbox"`+`aria-checked={selected}`(aria-pressed 미전달)로 노출합니다.
5. `color`는 `checkbox=false`이고 `leftIcon`이 없는 selected 상태일 때만 시각적으로 의미가 있습니다.
6. `leftIcon`과 checkbox box는 장식/시각 요소이므로 `aria-hidden` 영역에 렌더링합니다.
7. leading 영역(leftIcon/checkbox)은 같은 button 내부에 있으므로 그 영역을 클릭해도 ListButton의 `onClick`이 실행됩니다.
8. aria 상태(`aria-pressed` 또는 `aria-checked`)는 호출부에서 덮어쓸 수 없고 항상 `selected` 값과 동기화됩니다.
9. `leftIcon`이 `null`, `undefined`, `false`이면 icon slot을 만들지 않습니다.
10. `checkbox`와 `leftIcon`은 discriminated union으로 상호배타이며, `checkbox: true`일 때 `leftIcon?: never`입니다.
11. checkbox box는 `selected`와 무관하게 항상 표시하고, `selected=true`일 때만 채움+체크로 바뀝니다.
12. `selected`+`color`의 selected 배경(action box)은 `checkbox=false`에서만 적용합니다.
13. 체크 아이콘은 icon 세트에 없어 컴포넌트 내부 인라인 SVG로 렌더링합니다.

## Styling

- layout: `inline-flex`, center alignment, fixed 166px content width and 40px height. selected background는 좌우 12px씩 확장되어 190px action box처럼 표시합니다.
- spacing: padding 0, centered label. leading visual(leftIcon/checkbox)이 있으면 start alignment, 24px slot, 4px gap을 사용하고 slot은 selected 여부와 상관없이 유지합니다.
- shape: 8px radius
- checkbox: 24px 슬롯 안 18px box(4px radius). unchecked는 1.5px neutral 70 테두리·투명, checked는 primary normal 채움+테두리·흰 체크. box는 항상 표시하며, `checkbox=true`이면 selected여도 row action-box 배경을 넣지 않고 hover row 배경(neutral 10)은 유지합니다.
- disabled: hover 배경을 표시하지 않고 `cursor: not-allowed`를 적용합니다. checkbox box는 disabled 시 `neutral/40`으로 muted 처리해 활성 checkbox와 구분합니다.
- responsive: ListButton 자체는 고정 크기이며 부모 layout이 배치를 책임집니다.
- overflow: 라벨이 고정 폭을 넘으면 ellipsis로 처리합니다.
- hover: default/icon/checkbox 타입에서 neutral 10 배경을 표시하고, selected 색상은 hover에서도 유지합니다.
- focus: focus-visible outline을 사용합니다.
- token usage: 색상은 `atomic.neutral`, `semantic.primary`를 사용합니다. typography는 Figma의 15px Regular, 146.7% line-height, 0.96% letter-spacing 값을 component-local 값으로 둡니다.

## Accessibility

- semantic element: `button` (checkbox variant는 `role="checkbox"` 부여)
- accessible name: 텍스트 라벨 기반
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 outline을 표시합니다.
- ARIA: 기본/단일 선택은 `selected`를 `aria-pressed`로, checkbox variant는 `role="checkbox"`+`aria-checked`로 노출합니다(`aria-pressed` 미전달). `leftIcon`/checkbox box 시각 요소는 `aria-hidden`으로 처리합니다.

## Storybook

- [x] Default
- [x] Assistive selected
- [x] Primary selected
- [x] Left icon
- [x] Left icon hidden when not selected
- [x] Left icon controlled toggle example
- [x] Checkbox unchecked
- [x] Checkbox checked
- [x] Checkbox multi-select 예시
- [x] Dropdown checkbox multi-select story 추가
- [x] Checkbox disabled (box muted + `cursor: not-allowed`·hover 미표시)
- [ ] Loading when supported
- [ ] Invalid/Error when supported
- [x] State differences when supported

## Public API

- [x] `ListButton` value export
- [x] `ListButtonProps` type export
- [x] no private helper export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
