# Component Spec: `TextButton`

## Purpose

`TextButton`은 배경이나 테두리 없이 텍스트만으로 액션을 표현하는 낮은 강조의 버튼 primitive입니다.
디자인시스템 안에서는 native button 동작, default/negative 시각 톤, disabled 상태, focus-visible 상태 표현만 책임집니다.

## Usage Location

- `packages/design-system/src/components/ui/text-button/TextButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 410:8870의 default, disabled, negative 상태를 기준으로 합니다.

## UI Structure

```text
TextButton
  button
    text label
```

## Props

### children

- type: `ReactNode`
- required: `false`
- description: 버튼 내부에 렌더링되는 텍스트 라벨입니다.

### tone

- type: `RecipeVariantProps<typeof textButton>['tone']`
- required: `false`
- default: `default`
- values: `default`, `negative`
- description: 텍스트 색상의 시각적 의도를 정합니다. `negative`는 취소/삭제처럼 위험도가 높은 액션에 사용합니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `disabled`를 포함한 native button props를 그대로 전달합니다. `disabled`는 시각 상태가 아니라 실제 상호작용 상태이므로 `tone`과 분리된 native 속성으로 처리합니다.

## States

- default: neutral 90 텍스트, 배경/테두리 없음.
- negative: `tone='negative'`이면 status negative 텍스트 색상을 적용합니다.
- disabled: native `disabled` prop이 있으면 tone과 무관하게 neutral 30 텍스트와 `cursor: not-allowed`를 적용하고, 클릭/키보드 상호작용을 차단합니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.

## Behavior

1. 기본 엘리먼트는 `button`이며 기본 `type`은 `button`이라 form 내부에서 의도치 않은 submit을 막습니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. `tone`은 색상만 바꾸는 시각적 prop이며 상호작용에는 영향을 주지 않습니다.
4. `disabled`는 native button 속성으로 처리되어 키보드/포인터 상호작용을 실제로 차단합니다.

## Styling

- layout: `inline-flex`, center alignment, height 30px.
- spacing: padding 4px 10px.
- shape: 배경/테두리 없음, radius는 focus outline에만 사용.
- responsive: 고정 크기이며 부모 layout이 배치를 책임집니다.
- hover/focus/disabled: 별도 hover 상태는 없고, focus-visible outline을 사용합니다. disabled는 neutral 30 텍스트와 `not-allowed` 커서로 표현합니다.
- token usage: typography는 `typography['body-2-regular']`, 색상은 `atomic.neutral[90]`(default), `atomic.neutral[30]`(disabled), `semantic.status.negative`(negative)를 사용합니다.

## Accessibility

- semantic element: `button`
- accessible name: 텍스트 라벨(children) 기반
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 outline을 표시합니다.
- ARIA: 아이콘이 없는 텍스트 버튼이라 별도 `aria-label`이 필요 없고, disabled는 native `disabled` 속성으로 처리합니다.

## Storybook

- [x] Default
- [x] Negative
- [x] Disabled
- [ ] Loading when supported
- [ ] Invalid/Error when supported
- [x] Size or variant differences when supported

## Public API

- [x] `TextButton` value export
- [x] `TextButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm build`
- [x] `pnpm --filter @dongchimi/design-system build`
