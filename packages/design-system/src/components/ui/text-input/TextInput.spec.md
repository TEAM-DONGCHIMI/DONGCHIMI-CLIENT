# Component Spec: `TextInput`

## Metadata

- Jira: [DCMDS-2](https://dongchimi.atlassian.net/browse/DCMDS-2)
- Component: `TextInput`
- Figma component: `Default Text Field`
- Owner: Design System
- Status: In Progress

## Purpose

`TextInput`은 상품명, 가격, 기간처럼 사용자가 한 줄짜리 값을 직접 입력하는 공통 입력 컴포넌트입니다.
선택적인 제목, 필수 입력 표시, 입력창, 입력창 오른쪽의 장식 아이콘, 안내 문구와 오류 문구를 하나의 field로 제공합니다.
검증 규칙, 검증 실행 시점, submit, API 연동은 `TextInput`을 사용하는 화면이 책임집니다.

Figma에서는 `Default Text Field`라고 부르지만 이미 사용 중인 코드와 Jira의 이름은 `TextInput`으로 유지합니다.
Addable Field, Inline Field, Search Field는 목적과 구조가 다른 별도 public component로 구현합니다.

## Source Of Truth

- 전체 Text Field 정의와 variant: [APPJAM node 563:5986](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=563-5986&m=dev)
- Default 상태와 구성 조합: [APPJAM node 563:5988](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=563-5988&m=dev)
- Hover, Focus, Error 상태: [APPJAM node 581:5111](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=581-5111&m=dev)
- Success 상태: [APPJAM node 581:7509](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=581-7509&m=dev)
- Usage location: `packages/design-system/src/components/ui/text-input/TextInput.tsx`
- Category: `ui`

## Scope

- 한 줄짜리 native `input`을 렌더링합니다.
- 제목과 필수 입력 표시(`*`)를 선택적으로 렌더링합니다.
- placeholder, controlled/uncontrolled value, native input event와 ref를 지원합니다.
- 입력창 오른쪽에 선택적인 비상호작용 장식 아이콘을 렌더링합니다.
- 일반 안내 문구와 오류 문구를 input에 접근성 있게 연결합니다.
- Figma의 `default`, `hover`, `focus`, `error`, `success` visual과 native `disabled`, `readOnly` semantics를 지원합니다.
- public component와 public prop type만 명시적으로 export합니다.

## Out Of Scope

- 앱별 validation 규칙과 validation 실행 시점
- submit, mutation, API error mapping, route, logging, analytics
- multiline 입력; 별도 `TextArea`가 책임집니다.
- Addable Field, Inline Field, Search Field
- Addable Field처럼 양쪽에 여러 action을 배치하는 구조
- Figma에 근거가 없는 size variant
- 전역 color/token contract 변경

## UI Structure

```text
TextInput
  LabelRow (optional)
    Label
    RequiredIndicator (optional)
  InputContainer
    input
    TrailingIcon (optional, decorative)
    TrailingAction (optional, interactive)
  SupportingText (optional)
    ErrorIconSlot (error only, reserved)
    HelperText | ErrorMessage
```

## Public API

```tsx
<TextInput
  label='주제'
  placeholder='텍스트를 입력하세요'
  helperText='입력할 내용을 안내합니다'
  errorMessage='입력값을 확인해주세요'
  trailingAction={({ disabled }) => <IconButton aria-label='비밀번호 보기' disabled={disabled} />}
  required
/>
```

- component: `TextInput`
- exported type: `TextInputProps`
- base native props: text-like `input` props와 `ref`
- caller responsibility: label/copy, value state, validation result, event handlers, form integration
- non-owned behavior: validation 실행, error 생성, submit, API와 제품 side effect

### label

- type: `ReactNode`
- required: `false`
- description: input 위에 표시하는 visible label입니다. 생략하면 호출부가 `aria-label` 또는 `aria-labelledby`로 accessible name을 제공해야 합니다.

### helperText

- type: `ReactNode`
- required: `false`
- description: default, hover, focus, success 상태에서 input 아래에 표시하는 일반 안내 문구입니다.

### errorMessage

- type: `ReactNode`
- required: `false`
- description: `status='error'`일 때 helper text 대신 예약된 오류 아이콘 영역과 함께 표시하는 오류 문구입니다.
- constraint: `errorMessage`를 전달하려면 `status='error'`를 함께 명시해야 하며, 잘못된 prop 조합은 타입으로 제한합니다.

일반 안내와 오류 문구는 Figma의 `Description Text`와 `Error Text`에 대응합니다.
두 값을 모두 전달해도 현재 상태에 맞는 하나만 표시합니다.

### trailingIcon

- type: `ReactNode`
- required: `false`
- description: Figma의 `Text Icon=True`에 대응하는 입력창 오른쪽 장식 아이콘입니다.
- behavior: 자체 click handler와 tab stop을 갖지 않으며 input의 accessible name에 포함하지 않습니다.
- constraint: `trailingAction`과 동시에 사용할 수 없습니다.

### trailingAction

- type: `(state: { disabled: boolean }) => ReactElement`
- required: `false`
- description: 비밀번호 보기처럼 입력창 오른쪽에 배치하는 상호작용 요소입니다.
- behavior: 호출부가 native `button` 또는 `IconButton`과 accessible name, click behavior를 제공하고 render prop으로 전달받은 `disabled`를 interactive element에 적용합니다.
- constraint: `trailingIcon`과 동시에 사용할 수 없습니다.

### status

- type: `'default' | 'error' | 'success'`
- default: `'default'`
- description: 호출부가 판단한 의미 상태입니다. `hover`와 `focus`는 실제 interaction, `disabled`와 `readOnly`는 native input prop으로 표현합니다.

### native input props

- type: text-like `ComponentPropsWithoutRef<'input'>`
- description: `value`, `defaultValue`, `onChange`, `name`, `placeholder`, `required`, `disabled`, `readOnly`, `autoComplete` 등 native input props를 전달합니다.
- supported types: `text`, `email`, `password`, `search`, `tel`, `url`
- `children`, native numeric `size`, `aria-invalid`는 public API에서 제외합니다.
- 오류의 시각 상태와 접근성 상태가 어긋나지 않도록 `aria-invalid`는 `status='error'`에서만 컴포넌트가 설정합니다.
- `className`은 native input에 적용합니다.

### ref

- type: `Ref<HTMLInputElement>`
- description: input에 직접 focus하거나 form library와 연결할 수 있도록 native input ref를 전달합니다.

## Variant Mapping

- Header: `label` 존재 여부로 결정하며 별도 boolean prop을 두지 않습니다.
- Header Text: `label`로 전달합니다.
- Required: native `required`로 필수 semantics와 `*` 표시를 함께 결정합니다.
- Description: 현재 표시할 `helperText` 또는 `errorMessage` 존재 여부로 결정하며 별도 boolean prop을 두지 않습니다.
- Description Text: `helperText`로 전달합니다.
- Error Text: `errorMessage`로 전달합니다.
- Text Icon: 장식이면 `trailingIcon`, 상호작용 요소이면 `trailingAction`으로 전달하며 별도 boolean prop을 두지 않습니다.
- Value: `empty`, `typing`, `filled`, `filled typing`을 별도 prop으로 만들지 않고 실제 input 값과 interaction으로 표현합니다.
- Size: input 높이 48px 한 종류만 지원합니다.

## Layout Combinations

아래 높이는 label과 supporting text가 각각 한 줄인 기본 조합을 기준으로 합니다. 긴 label과 supporting text는 말줄임표로 숨기지 않고 줄바꿈하며, 전체 높이는 렌더링된 콘텐츠에 따라 늘어납니다.

- Header + Input + SupportingText: 104px (`22 + 8 + 48 + 8 + 18`)
- Header + Input: 78px (`22 + 8 + 48`)
- Input + SupportingText: 74px (`48 + 8 + 18`)
- Input only: 48px

전체 높이는 렌더링되는 콘텐츠로 자연스럽게 결정하며 별도 layout variant prop을 두지 않습니다.

## States

- default: white background와 neutral-20 border를 사용합니다.
- hover: 활성 input 위에 pointer가 있으면 neutral-80 border를 사용합니다.
- focus: input이 focus되고 pointer가 input 밖에 있으면 primary-normal border를 사용합니다. Figma에 없는 외부 focus ring이나 box-shadow는 추가하지 않습니다.
- error: `status='error'`일 때 negative-light border, 16px 오류 아이콘 영역과 negative 오류 문구를 표시하고 `aria-invalid='true'`를 적용합니다.
- success: `status='success'`일 때 neutral-20 background와 border를 사용합니다. Figma에서는 filled 조합만 제공하지만 컴포넌트가 input 값의 유무를 추론하지 않습니다.
- disabled: native `disabled` semantics를 input에 전달하고 hover를 적용하지 않습니다. `trailingAction`에도 `disabled` 상태를 전달해 호출부가 부가 액션을 함께 비활성화하도록 합니다. 전용 Figma visual이 없어 별도 opacity나 색상을 추가하지 않습니다.
- readOnly: native `readOnly` semantics를 전달합니다. 전용 Figma visual이 없어 별도 색상을 추가하지 않으며 success와 동일한 상태로 간주하지 않습니다.
- empty/filled: `value`, `defaultValue`, placeholder의 native 동작으로 표현합니다.
- loading: 지원하지 않습니다.

### State Priority

1. native `disabled`
2. `status='error'`
3. `status='success'`
4. hover
5. focus
6. default

- focus된 default input 위에 pointer가 있으면 hover border를 표시하고, pointer가 벗어나면 focus border를 표시합니다.
- error 상태에서 hover 또는 focus가 발생해도 error border와 `aria-invalid`를 유지합니다.
- success는 readOnly를 자동으로 부여하지 않습니다. 입력 가능 여부는 호출부가 native prop으로 명시합니다.
- success 상태는 hover/focus에 따라 별도 색으로 변경되지 않으며 호출부가 status를 변경하기 전까지 success visual을 유지합니다.

## Behavior

1. controlled와 uncontrolled value를 모두 native input 방식으로 지원합니다.
2. `hover`, `focus`, `typing`, `filled` 상태를 React state나 public variant prop으로 복제하지 않습니다.
3. error 상태에서는 `errorMessage`가 `helperText`보다 우선합니다.
4. error 상태지만 `errorMessage`가 없으면 빈 supporting text를 만들지 않고 `aria-invalid`만 적용합니다.
5. `trailingIcon` 또는 `trailingAction`이 있으면 input text와 겹치지 않도록 오른쪽 공간을 확보합니다.
6. `trailingIcon`은 pointer event와 tab stop을 만들지 않습니다.
7. `trailingAction`은 render prop으로 `disabled`를 전달받아 interactive element의 pointer와 keyboard interaction 상태를 input과 동기화합니다.
8. `*` 표시는 native `required`와 동기화하고 스크린 리더에 중복 낭독되지 않게 합니다.
9. `status='success'`는 visual만 표현하며 `value`, `defaultValue`, `readOnly`, `disabled`를 자동으로 설정하지 않습니다.

## Styling

- root: caller width를 따르며 기본적으로 사용 가능한 inline width를 채웁니다. Figma의 660px은 예시 canvas 폭이며 고정 public width로 사용하지 않습니다.
- vertical gap: label, input, supporting text 사이 8px
- label row: height 22px, label과 required indicator 사이 4px
- input: width 100%, height 48px, horizontal/vertical padding 12px, border 1px, radius 6px
- label: Body 3 Semibold, 14px/1.4
- input text/placeholder: Body 2 Medium, 16px/1.4
- helper/error text: Caption 1 Medium, 12px/1.4
- label/helper/error text: 긴 문구와 공백 없는 문자열을 줄바꿈해 전체 내용을 표시합니다.
- trailing icon/action slot: 24×24px, input 오른쪽 12px, text와 8px 간격
- error icon slot: 16×16px, error text와 4px 간격. 실제 아이콘 asset이 확정되기 전까지 빈 영역으로 유지합니다.
- transition: border/background/color 변화에만 짧게 적용하고 layout은 움직이지 않습니다.
- token usage: 기존 `atomic`, `semantic`, `typography` token과 component-local vanilla-extract style을 사용합니다.

### Figma Color Mapping

- text: `atomic.neutral[90]` (`#191F28`)
- placeholder: `atomic.neutral[60]` (`#6B7684`)
- default border: `atomic.neutral[20]` (`#E5E8EB`)
- helper text: `atomic.neutral[40]` (`#B0B8C1`)
- hover border: `atomic.neutral[80]` (`#333D4B`)
- focus border: `semantic.primary.normal` (`#15C47E`)
- error border: `semantic.status.negativeLight` (`#FF6362`)
- error text: `semantic.status.negative` (`#FF4242`)
- success background/border: `atomic.neutral[20]` (`#E5E8EB`)
- default background: `atomic.common[0]` (`#FFFFFF`)

## Accessibility

- semantic element: native `input`
- accessible name: visible `label`을 native input과 연결합니다. label이 없으면 `aria-label` 또는 `aria-labelledby`가 필요합니다.
- keyboard: native input keyboard editing, selection, tab order를 유지합니다.
- focus: default와 error 상태 모두 border 변화로 focus 위치를 식별할 수 있어야 합니다.
- description: 화면에 표시한 helper text 또는 error message의 고유 id를 `aria-describedby`에 연결하고 호출부가 전달한 기존 id와 병합합니다.
- invalid: error 상태에서 `aria-invalid='true'`를 적용합니다.
- required: native `required`를 input에 적용하고 시각적 `*`는 중복 낭독을 방지합니다.
- trailing icon: 장식 요소로 렌더링하고 accessible name과 tab order에 포함하지 않습니다.
- trailing action: interactive element의 accessible name과 native keyboard interaction을 유지합니다.
- error icon slot: 장식 요소로 렌더링하고 오류 의미는 `aria-invalid`와 error message로 전달합니다.
- error announcement: 입력 중 매 keystroke마다 강제 announcement하지 않습니다. live-region 정책은 실제 form validation 흐름이 필요할 때 호출부가 결정합니다.

## Storybook

- [x] Default
- [x] Hover
- [x] Focus
- [x] Error
- [x] Success
- [x] Disabled
- [x] ReadOnly
- [x] TrailingIcon
- [x] TrailingAction
- [x] Required
- [x] AriaLabel
- [x] AriaLabelledBy
- [x] VariantMatrix

## Public API Checklist

- [x] `TextInput` value export
- [x] `TextInputProps` type export
- [x] no private style helper, state type, or internal id export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
- [ ] Storybook interaction and a11y checks

## Open Questions

- Figma error status icon에 대응하는 영구 SVG source가 현재 package에 없어 16×16px 빈 slot만 확보합니다. 원본이 확정되면 slot 내부에 generated icon을 렌더링합니다.
- disabled/readOnly 전용 Figma visual이 제공되면 상태 색상과 interaction 우선순위를 추가합니다. 현재는 native semantics만 지원합니다.
