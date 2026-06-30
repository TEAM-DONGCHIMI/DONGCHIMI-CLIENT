# Component Spec: `Button`

## Purpose

`Button`은 텍스트 라벨을 중심으로 동작을 실행하는 공통 버튼 primitive입니다.
디자인시스템 안에서는 외형, native button 동작, disabled/focus 상태, 좌우 아이콘 슬롯, 접근 가능한 이름 계약만 책임집니다.
텍스트 없이 아이콘만으로 동작을 표현하는 버튼은 `IconButton`이 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/button/Button.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] 사용 가능한 token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node 212:805, 262:7669, 177:6021의 일반 Button과 Variant-ICN 사례, node 276:23036의 mobile Button을 기준으로 합니다.
- [x] Figma에 정의된 버튼 조합에 좌우 아이콘만 optional로 붙는 구조를 사용합니다.

## UI Structure

```text
Button
  button
    leftIcon?
    label
    rightIcon?
```

## Props

### children

- type: `ReactNode`
- required: `true`
- description: 버튼의 텍스트 라벨 또는 텍스트를 포함한 콘텐츠입니다. 아이콘만 단독으로 쓰지 않습니다.

### leftIcon

- type: `ReactNode`
- required: `false`
- description: 라벨 왼쪽에 배치되는 장식용 아이콘 슬롯입니다. `large`, `medium`, `small`에서만 렌더링합니다.

### rightIcon

- type: `ReactNode`
- required: `false`
- description: 라벨 오른쪽에 배치되는 장식용 아이콘 슬롯입니다. `large`, `medium`, `small`에서만 렌더링합니다.

### variant

- type: `RecipeVariantProps<typeof button>['variant']`
- default: `solid`
- values: `solid`, `outline`, `soft`
- description: Button의 시각적 강조 방식을 정합니다. `solid`는 채움형, `outline`은 흰 배경 테두리형, `soft`는 연한 배경과 테두리를 함께 쓰는 primary 강조형입니다.

### color

- type: `RecipeVariantProps<typeof button>['color']`
- default: `primary`
- values: `primary`, `assistive`, `assistiveLight`, `negative`
- description: Button의 semantic color를 정합니다.

### size

- type: `RecipeVariantProps<typeof button>['size']`
- default: `small`
- values: `large`, `medium`, `small`, `mobile`
- description: `large`, `medium`, `small`은 Figma desktop Button size이고, `mobile`은 Figma node 276:23036의 모바일 전용 Button size입니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `children`, `color`를 제외한 native button props를 전달합니다. `disabled`는 별도 variant가 아니라 native `disabled` prop으로 제어합니다.

## States

- default: size, variant, color 조합에 맞는 배경/테두리/텍스트 색상을 표시합니다.
- disabled: native `disabled` prop을 사용하며 클릭/키보드 동작이 막히고 배경, 테두리, 텍스트를 neutral disabled 색상으로 표시합니다. `variant="disabled"`는 제공하지 않습니다.
- loading: 지원하지 않습니다. 필요하면 별도 이슈에서 spinner와 accessible status 정책을 정합니다.
- invalid/error: 지원하지 않습니다. negative color는 destructive/error action 표현용으로만 사용합니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled`, `form` 등 native button 동작을 그대로 사용합니다.
3. `leftIcon`과 `rightIcon`은 desktop size(`large`, `medium`, `small`)에서만 사용할 수 있습니다.
4. `leftIcon`과 `rightIcon`은 장식용 슬롯이므로 `aria-hidden` 영역에 렌더링합니다.
5. `mobile` size에서는 icon prop이 전달돼도 렌더링하지 않습니다.
6. 아이콘만 있는 버튼은 이 컴포넌트로 만들지 않고 `IconButton`을 사용합니다.
7. `disabled`는 color/variant 조합과 별개로 최종 상태 스타일을 덮어씁니다.

## Figma Presets

- `solid / primary`
- `outline / assistive`
- `outline / assistiveLight`
- `outline / negative`
- `soft / primary`
- `solid / primary / disabled`
- `solid / assistive`
- `solid / primary / mobile`

`mobile` size는 Figma node 276:23036 기준 `solid / primary`에서만 지원하며, 아이콘 슬롯을 사용하지 않습니다.
`Variant-ICN`은 desktop preset의 별도 색상/variant가 아니라, 각 desktop preset에 `leftIcon`과 `rightIcon` 슬롯이 optional로 붙은 상태입니다.
`disabled`는 Figma preset으로 표시되지만 public variant 값이 아니라 native 상태입니다.

## Styling

- layout: `inline-flex`, center alignment, grid parent 안에서도 stretch되지 않는 content-based auto width, max-width 100%
- spacing: size별 fixed height, min-width, inline padding, desktop icon slot 24px
- variants: `outline`은 흰 배경과 테두리를 사용하고, `soft`는 연한 primary 배경과 primary 테두리를 함께 사용합니다.
- responsive: 호출부 width 안에서 max-width 100%를 넘지 않습니다.
- hover/focus/disabled: focus-visible outline 유지, disabled는 background, border, text를 neutral disabled color로 통일
- token usage: color는 `semantic.primary`, `semantic.status`, `atomic.neutral`, `atomic.common`을 사용합니다. typography는 `typography` token을 사용합니다.
- token gap: spacing, radius, control size token은 아직 확정 전이라 Figma 실측값을 component-local 값으로 둡니다.

## Accessibility

- semantic element: `button`
- accessible name: 텍스트 라벨 기반. 아이콘만 단독으로 쓰는 사용은 금지합니다.
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 키보드 접근 시 outline을 표시합니다.
- ARIA: 아이콘 슬롯은 장식용으로 `aria-hidden` 처리합니다.

## Storybook

- [x] Default
- [x] Disabled when supported
- [ ] Loading when supported: 미지원
- [ ] Invalid/Error when supported: 미지원
- [x] Size or variant differences when supported
- [x] Mobile: `solid / primary / mobile` 조합과 아이콘 미렌더링 정책 확인
- [x] Variant-ICN: desktop preset에서 좌우 아이콘 슬롯 확인

## Public API

- [x] `Button` value export
- [x] `ButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
