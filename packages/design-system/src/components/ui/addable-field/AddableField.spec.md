# Component Spec: `AddableField`

## Metadata

- Jira: [DCMDS-10](https://dongchimi.atlassian.net/browse/DCMDS-10)
- Component: `AddableField`
- Figma component: `AddableField`
- Owner: Design System
- Status: Implemented
- Classification: DS compound primitive

## Purpose

`AddableField`는 시간, 위치, 카테고리처럼 아이콘으로 값의 종류를 보여주고 입력창 오른쪽의 action으로 값을 추가하거나 선택할 수 있는 한 줄 입력 필드입니다.
선택적인 제목과 필수 표시, 양쪽 icon 영역, native input, 오류 문구를 하나의 field로 제공합니다.

검증 규칙, action을 눌렀을 때 열리는 picker/dialog, 값 추가·삭제, submit과 API 연동은 호출부가 책임집니다.
컴포넌트는 제품 copy나 특정 icon을 내장하지 않습니다.

## Source Of Truth

- 전체 정의와 variant: [APPJAM node 563:6362](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=563-6362&m=dev)
- component set: [APPJAM node 130:1849](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=130-1849&m=dev)
- Default: [APPJAM node 645:4662](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=645-4662&m=dev)
- Hover / typing: [APPJAM node 645:6101](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=645-6101&m=dev)
- Negative: [APPJAM node 645:7389](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=645-7389&m=dev)
- Related component: [DCMDS-2 TextInput](https://dongchimi.atlassian.net/browse/DCMDS-2)
- Usage location: `packages/design-system/src/components/ui/addable-field/AddableField.tsx`
- Category: `ui`

## Scope

- 한 줄짜리 native `input`과 ref를 제공합니다.
- visible label과 필수 표시를 선택적으로 렌더링합니다.
- 입력창 왼쪽에 값의 종류를 나타내는 장식 icon을 렌더링합니다.
- 입력창 오른쪽에 component가 소유한 native action button을 렌더링하고, 호출부가 icon, accessible name, callback을 주입합니다.
- `default`, 실제 `hover`/`focus`, `error` visual을 지원합니다.
- error message를 input에 접근성 있게 연결합니다.
- caller width를 따르며 좁은 container에서 input text가 icon과 겹치지 않게 합니다.
- Storybook에서 Figma의 header/value/status 조합과 width constraint를 검증합니다.

## Out Of Scope

- `TextInput` public API 변경 또는 내부 조합
- 공통 `InputBase`, `FieldRoot` 같은 primitive의 선제 추출
- picker, dialog, dropdown 또는 modal 구현
- action click 이후의 값 추가·삭제와 목록 상태 관리
- 앱별 validation 규칙과 validation 실행 시점
- submit, mutation, API error mapping, route, logging, analytics
- 특정 제품 icon과 문구의 기본값 제공
- Figma 근거가 없는 size, success, loading variant

`TextInput`과 label/id/message 처리의 중복이 생겨도 첫 구현에서는 로컬로 유지합니다.
두 컴포넌트가 같은 이유로 함께 변경되는 사례가 확인될 때 private helper 추출을 별도 리팩터링으로 검토합니다.

## UI Structure

```text
AddableField
  LabelRow (optional)
    Label
    RequiredIndicator (optional)
  FieldContainer
    LeadingIcon (decorative)
    input
    ActionButton
      TrailingIcon (decorative)
  ErrorMessage (optional)
    ErrorIcon (optional, decorative)
    Message
```

## Public API

```tsx
<AddableField
  label='시간'
  leadingIcon={<IcClock />}
  trailingIcon={<IcPlus />}
  trailingActionLabel='시간 추가'
  onTrailingAction={openTimePicker}
  placeholder='시간을 입력하세요'
  errorMessage='시간을 확인해주세요'
  status='error'
  required
/>
```

- component: `AddableField`
- exported type: `AddableFieldProps`
- base native props: text-like `input` props와 `ref`
- caller responsibility: label/copy, leading/trailing/error icon, action accessible name과 callback, value, validation result, event handler, form integration
- non-owned behavior: picker/dialog, 값 추가·삭제, validation 실행, submit, API와 제품 side effect

### accessible name

- visible `label`, `aria-label`, `aria-labelledby` 중 하나를 필수로 제공합니다.
- visible label을 전달하면 컴포넌트가 생성한 input id와 연결합니다.
- label이 없을 때 호출부가 `aria-label` 또는 `aria-labelledby`를 제공합니다.

### leadingIcon

- type: `ReactNode`
- required: `true`
- description: 값의 종류를 나타내는 20×20px 장식 icon입니다.
- behavior: pointer event와 tab stop을 만들지 않고 accessible name에 포함하지 않습니다.

### trailingIcon / trailingActionLabel / onTrailingAction

- `trailingIcon`: 오른쪽 action에 표시할 `ReactNode`이며 필수입니다.
- `trailingActionLabel`: action button의 accessible name인 `string`이며 필수입니다.
- `onTrailingAction`: 값을 추가하거나 picker를 여는 `MouseEventHandler<HTMLButtonElement>`이며 필수입니다. 동작 없는 button이 렌더링되지 않도록 callback을 반드시 제공합니다.
- component가 native `button type='button'`을 렌더링해 form 내부의 의도치 않은 submit을 막습니다.

### errorIcon

- type: `ReactNode`
- required: `false`
- description: 오류 문구 앞에 표시하는 16×16px 장식 icon입니다.
- behavior: `status='error'`이고 `errorMessage`가 있을 때만 렌더링되며 접근성 트리와 tab order에서 제외됩니다.

### label

- type: `string | ReactElement`
- required: `false`
- description: input 위에 표시하는 visible label입니다. `false`, `null`, `undefined`처럼 렌더링되지 않는 값은 허용하지 않습니다.

### errorMessage

- type: `ReactNode`
- required: `false`
- description: `status='error'`일 때 input 아래에 표시하고 `aria-describedby`로 연결하는 오류 문구입니다.

### className

- type: native input의 `className`
- description: root가 아니라 내부 native input에 적용됩니다. root width는 부모 container로 제어합니다.

### status

- type: `'default' | 'error'`
- default: `'default'`
- description: 호출부가 판단한 의미 상태입니다. Figma의 `negative`는 코드에서 `error`로 표현합니다.

### native input props

- type: text-like `ComponentPropsWithoutRef<'input'>`
- description: `value`, `defaultValue`, `onChange`, `name`, `placeholder`, `required`, `disabled`, `readOnly`, `autoComplete` 등을 전달합니다.
- supported types: `text`, `email`, `search`, `tel`, `url`
- `children`, native numeric `size`, `aria-invalid`는 public API에서 제외합니다.
- `hover`, `focus`, `typing`, `filled`는 public prop이나 React state로 복제하지 않습니다.

### ref

- type: `Ref<HTMLInputElement>`
- description: input에 직접 focus하거나 form library와 연결할 수 있도록 native input ref를 전달합니다.

## Variant Mapping

- Header: `label` 존재 여부로 결정하며 별도 boolean prop을 두지 않습니다.
- Header Text: `label`로 전달합니다.
- Required: native `required`로 필수 semantics와 `*` 표시를 함께 결정합니다.
- Description: `status='error'`이고 `errorMessage`가 있을 때 표시하며 별도 boolean prop을 두지 않습니다.
- Description Text: `errorMessage`로 전달합니다.
- Icon: `leadingIcon`으로 전달합니다.
- Value: `empty`, `typing`, `filled`, `filled typing`을 별도 prop으로 만들지 않고 실제 input 값과 interaction으로 표현합니다.
- Status Hover: 실제 CSS `:hover`와 `:focus-within`으로 표현합니다.
- Status Negative: `status='error'`로 표현합니다.

## Layout Combinations

- Label + Field: 76px (`22 + 6 + 48`)
- Field only: 48px
- Label + Field + Error: 106px (`22 + 6 + 48 + 12 + 18`)
- Field + Error: 78px (`48 + 12 + 18`)

전체 높이는 렌더링되는 콘텐츠로 자연스럽게 결정하며 별도 layout variant를 두지 않습니다.
Figma의 322px은 예시 폭이며 public fixed width로 사용하지 않습니다.

## States And Behavior

- default: white background와 neutral-20 border를 사용합니다.
- hover: 활성 field 위에 pointer가 있으면 neutral-80 border를 사용합니다.
- focus: input 또는 trailing action에 focus가 있으면 field container에 hover와 동일한 neutral-80 border를 사용합니다. 별도의 focus border color는 두지 않습니다.
- error: negative-light border와 error message를 표시하고 input에 `aria-invalid='true'`를 적용합니다.
- empty / filled: native value와 placeholder로 표현합니다.
- typing / filled typing: native input focus와 editing으로 표현하며 별도 상태를 저장하지 않습니다.
- required: native `required`와 시각적 `*`를 동기화합니다.
- disabled: native input과 action button을 함께 비활성화합니다. 전용 Figma visual이 없어 별도 색상을 만들지 않고 hover/focus border 변경을 차단합니다.
- readOnly: native input에만 `readOnly` semantics를 전달하며 action button은 활성 상태를 유지합니다.
- loading / success: 지원하지 않습니다.

### State Priority

1. `status='error'`
2. native `disabled`
3. hover / focus-within
4. default

- error 상태에서는 hover 또는 focus가 발생해도 error border를 유지합니다.
- disabled와 error를 함께 전달하면 error border와 `aria-invalid`는 유지되고 input과 action만 비활성화됩니다.
- 빈 문자열인 label, error message, error icon은 렌더링하지 않습니다. 숫자 `0`은 error message와 error icon에서 유효한 React content로 처리하며 label 타입에는 허용하지 않습니다.
- trailing action은 input의 value를 자동으로 변경하지 않습니다.
- action을 누른 뒤 input에 focus를 복귀시킬지는 제품 interaction을 소유한 호출부가 결정합니다.

## Styling Constraints

- root: caller width를 따르며 `width: 100%`, `min-width: 0`
- label row: 22px, label과 required indicator 사이 4px
- label-to-field gap: 6px
- field-to-error gap: 12px
- field: width 100%, height 48px, padding 12px, border 1px, radius 8px
- field content: leading icon, input, trailing action 순서; icon과 text 사이 8px
- leading icon / trailing action icon: 20×20px, flex shrink 금지
- trailing action hit area: 24×24px, `margin: -2px`로 기존 20px layout 점유 유지
- input text / placeholder: Body 3 Medium, 14px/1.4
- label: Body 3 Semibold, 14px/1.4
- error message row: min-height 18px, 16px error icon과 message 사이 4px
- error message: Caption 1 Medium, 12px/1.4를 기본값으로 사용
- overflow: input에 `min-width: 0`; 긴 값은 native horizontal scroll behavior를 유지합니다. label과 error message는 내용을 생략하지 않고 줄바꿈하며, 공백 없는 긴 문자열도 caller container 안에서 줄바꿈합니다.
- responsive: 322px 고정 폭을 사용하지 않고 caller container를 채움
- token usage: `atomic`, `semantic`, `typography`와 component-local vanilla-extract style 사용

### Figma Color Mapping

- text: `atomic.neutral[90]`
- placeholder: `atomic.neutral[60]`
- default border: `atomic.neutral[20]`
- hover / focus border: `atomic.neutral[80]`
- error border: `semantic.status.negativeLight`
- error text: `semantic.status.negative`
- required indicator: `semantic.primary.strong`
- background: `atomic.common[0]`

## Accessibility

- semantic element: native `input`
- accessible name: visible label을 input과 연결하거나 호출부의 `aria-label` / `aria-labelledby`를 전달합니다.
- keyboard: native input editing과 trailing action의 native keyboard interaction을 유지합니다.
- focus: input과 trailing action 모두 keyboard focus를 식별할 수 있어야 하며 action 자체의 focus-visible을 제거하지 않습니다.
- description: error message id를 input의 `aria-describedby`에 연결하고 호출부가 전달한 기존 id와 병합합니다.
- invalid: error 상태에서 input에 `aria-invalid='true'`를 적용합니다.
- required: native `required`를 input에 적용하고 시각적 `*`는 중복 낭독을 방지합니다.
- leading icon / error icon: 장식 요소로 렌더링하고 접근성 트리와 tab order에서 제외합니다.
- trailing action: component가 24×24px hit area의 native button과 accessible name, keyboard interaction을 제공합니다. 내부 icon visual은 20×20px입니다.
- error announcement: 입력 중 매 keystroke마다 강제 announcement하지 않습니다. live-region 정책은 호출부 form flow가 결정합니다.

## Storybook

- [x] DefaultEmpty
- [x] DefaultFilled
- [x] Hover
- [x] Focus
- [x] Required
- [x] ErrorEmpty
- [x] ErrorFilled
- [x] WithoutLabel
- [x] NarrowWidth
- [x] LongContent
- [x] VariantMatrix

## Public API Checklist

- [x] `AddableField` value export
- [x] `AddableFieldProps` type export
- [x] no private style helper, state type, or internal id export

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test:unit`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`

## Open Questions

- Figma는 empty/typing error message를 Caption 2 Regular(10px), filled/filled typing error message를 Caption 1 Medium(12px)으로 다르게 정의합니다. 값 유무로 오류 문구 typography가 바뀌는 것은 예측하기 어려우므로 12px로 통일하되 구현 전 디자인 의도를 확인합니다.
- disabled/readOnly 전용 Figma visual이 제공되면 상태 색상과 action 정책을 추가합니다.
