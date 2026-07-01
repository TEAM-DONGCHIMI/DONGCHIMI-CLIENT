# Component Spec: `PillButton`

## Purpose

`PillButton`은 칩에 가까운 형태의 버튼 primitive입니다.
수정하기 뷰 등에서 텍스트 버튼과 유사하게 사용하며, 웹/모바일에서 혼용합니다.
디자인시스템 안에서는 외형(variant), native button 동작, 트레일링 아이콘 슬롯만 책임집니다.
제품별 동작, 라우팅, 로깅, copy 선택, variant 선택 로직은 호출부가 주입합니다.

## Usage Location

- `packages/design-system/src/components/ui/pill-button/PillButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 variant를 명확히 정의합니다.
- [x] Figma에서 확인된 `platform`(desktop/mobile) × `variant`(outlined-light/outlined/filled) 케이스를 지원합니다.
- [x] 색상/타이포는 `atomic`, `semantic`, `typography` token만 사용합니다.

## UI Structure

```text
PillButton
  button
    children (label)
    IconSlot (optional, trailing)
```

## Props

### children

- type: `ReactNode`
- required: `true`
- description: 버튼 라벨입니다. platform별 라벨 텍스트는 호출부가 결정합니다.

### platform

- type: `RecipeVariantProps<typeof pillButton>['platform']`
- default: `'desktop'`
- description: 웹/모바일 표현을 선택합니다. desktop은 높이 40px·`body-3-semibold`, mobile은 높이 30px·`caption-1-medium`입니다.

### variant

- type: `RecipeVariantProps<typeof pillButton>['variant']` (`'outlined-light' | 'outlined' | 'filled'`)
- default: `'outlined-light'`
- description: Figma에서 확인된 스타일 변형입니다. `outlined-light`는 옅은 테두리, `outlined`는 진한 테두리, `filled`는 채움 표현입니다. `platform='mobile'`에는 Figma에 `outlined` 조합이 없어, prop 타입(discriminated union)에서 mobile은 `outlined-light`/`filled`만 허용해 잘못된 조합을 컴파일 단계에서 막습니다.

### icon

- type: `ReactNode`
- required: `false`
- description: 라벨 뒤에 표시할 트레일링 아이콘입니다. 장식 슬롯(`aria-hidden`)으로 감싸며, accessible name에는 포함하지 않습니다. desktop 16px, mobile 12px이고 `currentColor`로 텍스트 색을 따릅니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `children`, `color`를 제외한 native button props(`onClick`, `disabled`, `aria-*` 등)를 전달합니다.

## Variants

- `outlined-light`: 배경 `common/0`, 테두리 `neutral/20`. 텍스트는 desktop `neutral/90`, mobile `neutral/80`.
- `outlined`: 배경 `common/0`, 테두리 `neutral/40`, 텍스트 `neutral/90`. desktop 전용입니다.
- `filled`: 테두리 없음. desktop은 배경 `common/100`·텍스트 `common/0`, mobile은 배경 `semantic.primary.normal`·텍스트 `common/0`.

## States

- disabled: native `disabled`로 pointer/keyboard interaction을 막고, 디자인시스템 공통 disabled 표현(opacity 0.45, `cursor: not-allowed`)을 적용합니다.
- loading: 지원하지 않습니다.
- invalid/error: 지원하지 않습니다.
- selected/active: 별도 상태 prop은 없습니다. 선택 표현이 필요하면 호출부가 `variant`(예: `filled`)로 제어합니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `disabled` 등 native button 동작을 그대로 사용합니다.
3. `platform`과 `variant`에 맞는 외형을 렌더링합니다.
4. `icon`은 `aria-hidden='true'` 슬롯 안 트레일링에 렌더링합니다.

## Styling

- layout: inline-flex 버튼. 라벨과 아이콘 사이 gap은 desktop 4px, mobile 2px입니다.
- radius: 20px pill 형태입니다.
- size: desktop 높이 40px·좌우 padding 20px, mobile 높이 30px·좌우 padding 14px입니다.
- typography: desktop `body-3-semibold`, mobile `caption-1-medium`입니다.
- colors: `Variants` 항목의 variant × platform 매핑을 따릅니다.
- icon: desktop 16px, mobile 12px 슬롯, `currentColor`.
- focus/disabled: `focus-visible` outline을 제공하고, disabled는 opacity 0.45와 `cursor: not-allowed`로 표현합니다.
- token usage: `atomic`, `semantic`, `typography` token을 사용합니다. focus ring은 `semantic.primary.normal` 기반 `color-mix`입니다.

## Accessibility

- semantic element: `button`
- accessible name: `children` 라벨로 제공합니다.
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: outline 유지
- ARIA: 아이콘 슬롯은 `aria-hidden='true'`

## Storybook

- [ ] Desktop outlined-light
- [ ] Desktop outlined
- [ ] Desktop filled
- [ ] Mobile outlined-light
- [ ] Mobile filled
- [ ] With trailing icon
- [ ] Disabled
- [ ] platform × variant matrix

## Public API

- [ ] `PillButton` value export
- [ ] `PillButtonProps` type export
- [ ] no private helper export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
