# Component Spec: `TextInput`

## Metadata

- Jira: [DCMDS-2](https://dongchimi.atlassian.net/browse/DCMDS-2)
- Component: `TextInput`
- Owner: Design System
- Status: Ready

## Purpose

`TextInput`은 한 줄짜리 텍스트를 입력받는 공통 입력 컴포넌트입니다.
제목, 입력창, 입력창 아래에 사용자에게 보여주는 안내 또는 에러 문구를 함께 제공합니다.
여기서 안내 문구는 Figma의 개발용 description 주석이 아니라 실제 화면에서 사용자에게 보이는 텍스트입니다.
어떤 값이 에러인지 판단하는 규칙과 submit, API 연동은 `TextInput`을 사용하는 화면이 책임집니다.

## Source Of Truth

- Figma: [APPJAM TextInput component set, node 130:659](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=130-659&m=dev)
- Figma component name: `Textinput`; 코드에서는 PascalCase 규칙에 따라 `TextInput`을 사용합니다.
- Usage location: `packages/design-system/src/components/ui/text-input/TextInput.tsx`
- Category: `ui`

## Scope

- 한 줄짜리 native `input`을 렌더링합니다.
- 제목과 필수 입력 표시(`*`)는 필요한 경우에만 보여줍니다.
- placeholder, 값, 입력 이벤트와 ref를 native input 방식으로 전달합니다.
- 입력창 아래의 일반 안내 문구와 에러 문구를 input과 접근성 있게 연결합니다.
- Figma의 `default`, `hover`, `focus`, `error`, `success` 표현을 지원합니다.
- public component와 public prop type만 명시적으로 export합니다.

## Out Of Scope

- 앱별 validation 규칙과 validation 실행 시점
- submit, mutation, API error mapping, route, logging, analytics
- multiline 입력; 별도 `TextArea`가 책임집니다.
- SearchBar와 InlineField; 별도 컴포넌트 책임입니다.
- prefix/suffix button처럼 자체 focus와 click behavior를 갖는 interactive adornment
- AddableField의 왼쪽 아이콘과 오른쪽 추가 버튼. AddableField 구현 시 공통 input container 추출 여부를 결정합니다.
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
    TrailingVisual (optional, decorative)
  SupportingText (optional)
    ErrorStatusIcon (error only)
    HelperText | ErrorMessage
```

## Public API

```tsx
<TextInput
  label='주제'
  placeholder='텍스트를 입력하세요'
  helperText='입력할 내용을 안내합니다'
  errorMessage='입력값을 확인해주세요'
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
- description: default, hover, focus, success 상태에서 input 아래에 보여주는 일반 안내 문구입니다.

### errorMessage

- type: `ReactNode`
- required: `false`
- description: `status='error'`일 때 helper text 대신 에러 아이콘과 함께 보여주는 오류 문구입니다.

일반 안내와 에러 문구는 목적과 내용이 다르고 Figma에서도 `text`와 `errorText`로 분리되어 있으므로 각각 받습니다. 두 값을 모두 전달해도 한 번에 하나만 표시합니다.

### status

- type: `'default' | 'error' | 'success'`
- default: `'default'`
- description: 호출부가 판단한 결과 상태입니다. `hover`와 `focus`는 브라우저가 실제 마우스와 키보드 동작에 맞춰 자동으로 표현하므로 prop에 포함하지 않습니다.

### native input props

- type: text-like `ComponentPropsWithoutRef<'input'>`
- description: `value`, `defaultValue`, `onChange`, `name`, `placeholder`, `required`, `disabled`, `readOnly`, `autoComplete` 등 native input props를 전달합니다.
- supported types: `text`, `email`, `password`, `search`, `tel`, `url`
- `children`과 native numeric `size`는 public API에서 제외합니다.

### ref

- type: `Ref<HTMLInputElement>`
- description: input에 직접 focus하거나 form library와 연결할 수 있도록 native input ref를 전달합니다.

## Variants

- size: Figma node `130:659` 기준 48px 높이 한 종류만 지원합니다.
- header: `label`을 전달하면 제목을 표시하고, 전달하지 않으면 표시하지 않습니다. `label`과 `header=true/false`가 서로 어긋나는 경우를 만들지 않기 위해 별도 boolean prop은 두지 않습니다.
- description: 현재 상태에서 보여줄 `helperText` 또는 `errorMessage`가 있으면 문구 영역을 표시합니다. 문구와 노출 여부를 따로 관리하지 않기 위해 별도 boolean prop은 두지 않습니다.
- required: native `required` 하나로 필수 입력 동작과 `*` 표시를 함께 결정합니다. 별도의 필수 표시 prop은 두지 않습니다.
- value: Figma의 `empty`, `filled`, `typing`, `filled/typing`은 실제 input 값과 입력 중인 상황을 설명하는 디자인 상태입니다. 실제 `value`와 어긋날 수 있으므로 별도 variant prop으로 만들지 않습니다.

## States

- default: neutral border와 white background를 사용합니다.
- hover: pointer hover 시 neutral strong border를 사용하며 외부 prop으로 제어하지 않습니다.
- focus: input focus 시 primary border와 focus-visible 표현을 사용하며 외부 prop으로 제어하지 않습니다.
- error: `status='error'`일 때 negative-light border, negative message와 status icon을 표시하고 `aria-invalid='true'`를 적용합니다.
- success: `status='success'`일 때 Figma처럼 neutral-20 background/border를 사용합니다. Figma 주석에 따라 제한된 완료 결과에서 호출부가 명시적으로 사용하며, 입력값 유무를 컴포넌트가 추론하지 않습니다.
- empty/filled: `value` 또는 `defaultValue`와 placeholder의 native 동작으로 표현합니다.
- disabled: native `disabled` semantics는 전달하지만 Figma node에 전용 visual이 없어 1차 의미 있는 visual variant와 story 범위에서는 제외합니다.
- readOnly: native `readOnly` semantics를 전달하며 success와 동일한 상태로 간주하지 않습니다.
- loading: 지원하지 않습니다.

### State priority

1. native `disabled`
2. `status='error'`
3. `status='success'`
4. native focus
5. hover
6. default

Error 상태에서 focus가 발생해도 error border와 `aria-invalid`를 유지합니다.

## Behavior

1. controlled와 uncontrolled value를 모두 native input 방식으로 지원합니다.
2. `hover`, `focus`, `typing` 상태를 React state prop으로 복제하지 않습니다.
3. error 상태에서는 `errorMessage`가 `helperText`보다 우선합니다.
4. error 상태지만 `errorMessage`가 없으면 빈 문구 영역을 만들지 않고 `aria-invalid`만 적용합니다.
5. `*` 표시는 native `required`와 동기화하고 스크린 리더에 중복 낭독되지 않게 합니다.

## Styling

- root: caller width를 따르며 기본적으로 사용 가능한 inline width를 채웁니다. Figma의 660px은 예시 canvas 폭으로 보고 고정 public width로 만들지 않습니다.
- vertical gap: label, input, supporting text 사이 8px
- input: width 100%, height 48px, padding 12px, border 1px, radius 6px
- label: Body 3 Semibold, 14px/1.4
- input text/placeholder: Body 2 Medium, 16px/1.4
- helper/error text: Caption 1 Medium, 12px/1.4
- required indicator: label과 4px 간격
- error icon/text: 16px icon과 약 4px 간격
- transition: border/background/color 변화에만 짧게 적용하고 layout은 움직이지 않습니다.
- overflow: 긴 input 값은 native single-line scrolling을 사용합니다. label과 helper/error text는 컨테이너 폭 안에서 wrapping 가능해야 합니다.
- token usage: 기존 `atomic`, `semantic`, `typography` token을 우선하고 component-local vanilla-extract style을 사용합니다.

### Figma color mapping

- text: `atomic.neutral[90]` (`#191F28`)
- placeholder: `atomic.neutral[60]` (`#6B7684`)
- default border: `atomic.neutral[20]` (`#E5E8EB`)
- helper text: `atomic.neutral[40]` (`#B0B8C1`)
- hover border: `atomic.neutral[80]` (`#333D4B`)
- focus border: `semantic.primary.normal` (`#15C47E`)
- error border: `semantic.status.negativeLight` (`#FF6362`)
- error text: `semantic.status.negative` (`#FF4242`)
- success background/border: `atomic.neutral[20]` (`#E5E8EB`)
- background: `atomic.common[0]` (`#FFFFFF`)

## Accessibility

- semantic element: native `input`
- accessible name: visible `label`을 native input과 연결합니다. label이 없으면 `aria-label` 또는 `aria-labelledby`가 필요합니다.
- keyboard: native input keyboard editing, selection, tab order를 유지합니다.
- focus: focus indicator를 제거하지 않으며 error 상태에서도 focus 위치를 식별할 수 있어야 합니다.
- description: 화면에 표시한 helper text 또는 error message의 고유 id를 `aria-describedby`에 연결합니다. 호출부가 전달한 기존 id가 있으면 함께 유지합니다.
- invalid: error 상태에서 `aria-invalid='true'`를 적용합니다.
- required: native `required`를 input에 적용하고 시각적 `*`는 중복 낭독을 방지합니다.
- error status icon: 장식 요소로 렌더링하고 accessible name에 포함하지 않습니다.
- error announcement: 입력 중 매 keystroke마다 강제 announcement하지 않습니다. live-region 정책은 실제 form validation 흐름이 필요할 때 호출부에서 결정합니다.

## Storybook

- [ ] Default empty
- [ ] Default filled
- [ ] Hover empty/filled visual check
- [ ] Focus empty/filled interaction
- [ ] Error empty/filled
- [ ] Error while focused
- [ ] Success filled
- [ ] Required label
- [ ] Without visible label using an accessible name
- [ ] Helper text and error message priority
- [ ] Long label, value, helper/error text, and constrained width

## Public API

- [ ] `TextInput` value export
- [ ] `TextInputProps` type export
- [ ] no private style helper, state type, or internal id export

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

- Figma error status icon에 대응하는 검증된 SVG source/generated icon이 현재 package에 있는지 확인하고, 없으면 icon 작업을 별도 범위로 분리합니다.
- Figma `textIcon`은 AddableField 계열과 input 내부 여백을 맞추기 위한 자리로 보입니다. AddableField 구현 전에는 `TextInput` public prop으로 노출하지 않고, 이후 공통 input container 또는 전용 slot API가 필요한지 결정합니다.
- Figma `success`는 “특정 부분에만 사용”한다고 명시되어 있습니다. 최초 실제 사용처에서 success의 readOnly/수정 가능 여부를 확인합니다.
- disabled 전용 Figma variant가 제공되면 시각 상태와 Storybook 범위를 갱신합니다.
