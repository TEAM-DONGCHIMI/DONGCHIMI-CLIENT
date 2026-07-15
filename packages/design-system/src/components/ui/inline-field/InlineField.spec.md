# Component Spec: `InlineField`

## Metadata

- Jira: [DCMDS-16](https://dongchimi.atlassian.net/browse/DCMDS-16)
- Component: `InlineField`
- Owner: Design System
- Status: Implemented
- Classification: DS primitive

## Purpose

`InlineField`는 테이블, 리스트, 행 안에서 짧은 값을 화면 이동 없이 입력하거나 수정하는 입력 필드입니다. 입력값, placeholder, 선택적 단위 문구를 한 줄에 표시합니다.

validation 규칙, 가격 포맷팅, 저장 시점, form과 API 연동은 호출부가 담당합니다.

## Source Of Truth

- Small variant: [APPJAM node 645:7835](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=645-7835&m=dev)
- Medium read-only: [APPJAM node 663:6454](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=663-6454&m=dev)
- Usage location: `packages/design-system/src/components/ui/inline-field/InlineField.tsx`
- Category: `ui`

## Scope

- native `input`과 ref를 제공합니다.
- `small`, `medium` 크기를 지원합니다.
- default, hover/focus, error, read-only visual을 지원합니다.
- 오른쪽 단위 문구를 선택적으로 표시합니다.
- error 상태에서 에러 메시지를 선택적으로 표시합니다.
- controlled와 uncontrolled 값을 모두 지원합니다.
- Storybook에서 크기, 상태, 단위, 긴 값 조합을 검증합니다.

## Out Of Scope

- visible label, helper message
- disabled, loading, success 상태
- validation 규칙과 실행 시점
- 가격 포맷팅과 숫자 변환
- autosave, submit, API 연동
- 공통 input primitive 추출

## UI Structure

```text
InlineField
  InputWrapper
    input
    Unit (optional)
  ErrorMessage (optional)
```

## Public API

```tsx
<InlineField aria-label='가격' defaultValue='10000' size='medium' unit='원' />
<InlineField aria-label='상품명' status='error' errorMessage='상품명을 입력해주세요.' />
```

- component: `InlineField`
- exported type: `InlineFieldProps`
- caller responsibility: accessible name, value, placeholder, unit, status, validation, event handler
- non-owned behavior: formatting, validation, persistence, form/API integration
- native input props: value, defaultValue, onChange, name, placeholder, inputMode, autoComplete
- supported types: `text`, `number`, `email`, `search`, `tel`, `url`
- `children`, native numeric `size`, `disabled`, caller-provided `aria-invalid`는 public API에서 제외합니다.

### Accessible name

visible label을 렌더링하지 않으므로 `aria-label`과 `aria-labelledby` 중 하나를 필수로 제공합니다.

### State contract

- editable: `readOnly`가 없거나 `false`이며 `status='default' | 'error'`를 사용할 수 있습니다.
- read-only: `readOnly=true`이며 `status`를 함께 전달할 수 없습니다.
- error와 read-only 조합은 타입 수준에서 허용하지 않습니다.

### unit

- type: `string`
- required: `false`
- description: 입력 오른쪽에 표시하는 단위 문구입니다. 빈 문자열이면 렌더링하지 않습니다.

### errorMessage

- type: `ReactNode`
- required: `false`
- description: error 상태에서 입력 아래에 표시하는 오류 메시지입니다. 메시지가 있으면 input의 `aria-describedby`에 연결합니다.

## States And Behavior

- default: 흰 배경과 neutral-20 border를 사용합니다.
- hover/focus: 실제 pointer hover와 input focus에서 neutral-80 border를 사용합니다.
- error: negative-light border와 `aria-invalid='true'`를 사용합니다. `errorMessage`가 있으면 오류 아이콘과 메시지를 입력 아래에 표시합니다.
- read-only: native `readOnly`와 neutral-20 배경을 사용하며 error 상태가 될 수 없습니다.
- empty/filled: native value와 placeholder로 표현합니다.
- typing: native input focus와 편집 동작으로 표현하며 별도 상태를 저장하지 않습니다.

## Styling Constraints

- field root: `width: 100%`, `min-width: 0`, input wrapper와 error message를 세로로 배치합니다.
- input wrapper: `width: 100%`, `min-width: 0`; Figma의 319px은 예시 너비로만 사용합니다.
- small: 32px 높이, 상하 padding 6px, 좌우 padding 12px, Caption 1 Medium
- medium: 40px 높이, 상하 padding 10px, 좌우 padding 16px, Body 3 Medium
- border: 1px, radius 4px
- medium input과 unit 간격: 10px
- text: neutral-90, placeholder: neutral-60
- unit은 줄바꿈하지 않고 input은 남은 너비에서 축소되어 두 콘텐츠가 겹치지 않습니다.
- error message: Caption 1 Medium, negative color, 16px 오류 아이콘과 4px gap을 사용합니다.
- input wrapper와 error message 사이는 `0.4rem` (기본 root font-size 10px 기준 4px)을 사용합니다.

## Accessibility

- semantic element: native `input`
- accessible name: `aria-label` 또는 `aria-labelledby` 필수
- keyboard: native input editing, selection, tab order 유지
- focus: border 변화로 keyboard focus 위치 식별
- invalid: error 상태에서만 `aria-invalid='true'`
- error message: `errorMessage`가 있으면 input의 accessible description에 포함합니다.
- read-only: native `readOnly` semantics 사용
- unit: interactive element나 별도 tab stop을 만들지 않는 보조 문구

## Storybook

- [x] Default
- [x] Small
- [x] Filled
- [x] WithUnit
- [x] Error
- [x] ReadOnly
- [x] LongValue
- [x] VariantMatrix

## Public API Checklist

- [x] `InlineField` value export
- [x] `InlineFieldProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test:unit`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
