# Component Spec: `LineButton`

## Purpose

`LineButton`은 도움말/부가 안내 링크처럼 낮은 강조로 노출되는 텍스트 버튼 primitive입니다.
디자인시스템 안에서는 native button 동작과, 상호작용 시(hover/focus) 밑줄이 나타나는 시각 상태 표현만 책임집니다.

## Usage Location

- `packages/design-system/src/components/ui/line-button/LineButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 179:630(`Linebutton`)의 default, action 상태를 기준으로 합니다.

## UI Structure

```text
LineButton
  button
    text label
```

## Props

### children

- type: `ReactNode`
- required: `false`
- description: 버튼 내부에 렌더링되는 텍스트 라벨입니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `disabled`를 포함한 native button props를 그대로 전달합니다. 별도 public variant prop은 없습니다.

## States

- default: 배경/밑줄 없이 neutral 40 텍스트로 표시합니다.
- hover: 마우스 오버 시 `caption-1-medium` 타이포, `neutral 60` 텍스트 색상, 밑줄(`text-decoration: underline`)이 나타납니다. Figma의 `state=action`에 대응합니다.
- focus-visible: 키보드 focus 시에도 동일하게 `caption-1-medium` 타이포, `neutral 60` 텍스트 색상, 밑줄, focus outline을 표시합니다.
- disabled: native `disabled` prop을 전달할 수 있으며, 브라우저 기본 동작에 따라 포인터/키보드 상호작용과 hover/focus가 발생하지 않습니다. 별도 시각 상태는 정의하지 않습니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.

## Behavior

1. 기본 엘리먼트는 `button`이며 기본 `type`은 `button`이라 form 내부에서 의도치 않은 submit을 막습니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. Figma의 default/action 상태는 별도 prop이 아니라 실제 상호작용에 반응하는 `:hover`/`:focus-visible` CSS pseudo state로 표현합니다. 상호작용 상태를 prop으로 강제할 수 없습니다.

## Styling

- layout: `inline-flex`, center alignment, content-hugging width.
- spacing: padding 0.
- shape: 배경/테두리 없음.
- responsive: 고정 크기가 없으며 부모 layout이 배치를 책임집니다.
- hover/focus/disabled: hover와 focus-visible에서 `typography['caption-1-medium']`, `atomic.neutral[60]` 색상, `text-decoration: underline`을 적용하고, focus-visible에서는 outline도 함께 표시합니다. disabled는 별도 시각 스타일 없이 브라우저 기본 동작을 따릅니다.
- token usage: default typography는 `typography['body-3-semibold']`, 색상은 `atomic.neutral[40]`, action typography는 `typography['caption-1-medium']`, 색상은 `atomic.neutral[60]`을 사용합니다.

## Accessibility

- semantic element: `button`
- accessible name: 텍스트 라벨(children) 기반
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 밑줄과 outline을 함께 표시합니다.
- ARIA: 아이콘이 없는 텍스트 버튼이라 별도 `aria-label`이 필요 없습니다.

## Storybook

- [x] Default
- [x] Disabled when supported
- [ ] Loading when supported
- [ ] Invalid/Error when supported
- [ ] Size or variant differences when supported: 별도 variant 없음. action 상태는 hover/focus로 브라우저에서 확인합니다.

## Public API

- [x] `LineButton` value export
- [x] `LineButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm build`
- [x] `pnpm --filter @dongchimi/design-system build`
