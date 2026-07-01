# Component Spec: `NumButton`

## Purpose

`NumButton`은 숫자 값을 선택하거나 이동할 때 사용하는 30px 정사각형 버튼 primitive입니다.
디자인시스템 안에서는 native button 동작, default/hover/selected 상태, focus-visible 상태, 접근 가능한 선택 상태 표현만 책임집니다.

## Usage Location

- `packages/design-system/src/components/ui/num-button/NumButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 412:7308의 `numbtn` 컴포넌트 default, hover, selected 상태를 기준으로 합니다.

## UI Structure

```text
NumButton
  button
    number label
```

## Props

### children

- type: `ReactNode`
- required: `true`
- description: 버튼 내부에 렌더링되는 숫자 라벨입니다. 일반적으로 `1`, `2` 같은 짧은 숫자를 전달합니다.

### selected

- type: `boolean`
- required: `false`
- default: `false`
- description: 현재 선택된 숫자인지 표현합니다. `true`이면 selected 배경을 적용하고 `aria-pressed`를 `true`로 전달합니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `children`, `color`를 제외한 native button props를 전달합니다. `disabled` 같은 native prop은 전달할 수 있지만, Figma 기준 별도 disabled 시각 상태는 정의하지 않습니다.

## States

- default: 별도 배경 없이 neutral 90 텍스트로 표시합니다.
- hover: pointer hover 시 neutral 20 배경으로 표시합니다.
- selected: `selected` prop이 `true`이면 neutral 30 배경으로 표시합니다.
- disabled: native disabled prop 전달은 가능하지만, 현재 Figma 범위의 시각 상태로는 지원하지 않습니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. `selected`는 선택 여부를 나타내는 controlled visual state입니다.
4. `selected`가 `true`이면 `aria-pressed=true`를 전달합니다.
5. hover 상태는 CSS `:hover`로 표현합니다.
6. `selected` 상태에서는 hover해도 neutral 30 배경을 유지합니다.
7. `aria-pressed`는 호출부에서 덮어쓸 수 없고 항상 `selected` 값과 동기화됩니다.

## Styling

- layout: `inline-flex`, center alignment, fixed 30px width/height
- spacing: vertical 4px, horizontal 10px padding
- shape: 6px radius
- responsive: 숫자 버튼 자체는 고정 크기이며 부모 layout이 배치를 책임집니다.
- hover/focus: hover는 neutral 20, selected는 neutral 30, focus-visible outline을 사용합니다.
- token usage: 색상은 `atomic.neutral`, focus outline은 `semantic.primary`를 사용합니다. typography는 `body-2-regular` token을 사용합니다.

## Accessibility

- semantic element: `button`
- accessible name: 숫자 라벨 기반
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 outline을 표시합니다.
- ARIA: `selected` 상태는 `aria-pressed`로 노출합니다.

## Storybook

- [x] Default
- [x] Selected
- [x] Hover: CSS pseudo state로 지원하며 Storybook interaction 또는 브라우저 hover로 확인합니다.
- [ ] Disabled when supported: 별도 시각 상태 미지원
- [ ] Loading when supported
- [ ] Invalid/Error when supported
- [x] State differences when supported

## Public API

- [x] `NumButton` value export
- [x] `NumButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
