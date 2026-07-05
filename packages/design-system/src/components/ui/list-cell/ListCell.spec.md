# Component Spec: `ListCell`

## Purpose

`ListCell`은 테이블 또는 목록에서 한 행의 선택, 미디어, 여러 inline field, 상태 badge, helper message를 한 줄로 배치하는 디자인시스템 compound primitive입니다.
디자인시스템 안에서는 row layout, slot structure, controlled selection, inline field 표시, focus-visible, overflow 처리만 책임집니다.
상품 데이터, 이미지 업로드 API, route, analytics, submit 동작은 호출부가 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/list-cell/ListCell.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node `398:6171`의 `Product Upload List Cell` error/success 상태를 기준으로 합니다.
- [x] `IconButton`, `InlineField`, `Chip`, `Dropdown` 같은 더 작은 primitive가 완전히 대체할 수 없는 row composition만 담당합니다.
- [x] 일반 field와 상태 badge는 이미 구현된 공통 컴포넌트(`InlineField`, `Chip`)를 조합합니다.
- [x] 좌측 selection control은 `IconButton`을 사용하고, checkbox semantics는 `role="checkbox"`와 `aria-checked`로 제공합니다.
- [x] `Dropdown`은 열린 메뉴 컨테이너 public API만 제공하므로 ListCell 내부의 닫힌 trigger는 action field로만 제공합니다.

## UI Structure

```text
ListCell
  row
    selection IconButton (role=checkbox)
    media frame
      media content | media action
    fields
      InlineField[]
      action field button?
    status column?
      Chip?
      helper message?
```

## Props

### fields

- type: `readonly ListCellFieldProps[]`
- required: `true`
- description: row에 표시할 field 목록입니다. 각 field는 `id`, `value`, `defaultValue`, `placeholder`, `width`, `unit`, `type`, `inputMode`, `onChange`, `readOnly`, `status`, `trailingIcon`, `onClick`, `disabled`, `aria-label`을 받을 수 있습니다.
- note: `onClick`이 없으면 `InlineField size="small"`을 렌더링합니다. `onClick`이 있으면 category/dropdown trigger처럼 native button field를 렌더링하며, 이 경우 `disabled`를 함께 사용할 수 있습니다.

### checkboxLabel

- type: `string`
- required: `false`
- default: `항목 선택`
- description: selection IconButton checkbox의 accessible name입니다.

### checked / defaultChecked

- type: `boolean`
- required: `false`
- description: selection IconButton checkbox의 controlled 또는 initial checked 상태입니다.

### onCheckedChange

- type: `(checked: boolean) => void`
- required: `false`
- description: selection IconButton checkbox 상태가 바뀔 때 호출됩니다.

### checkboxDisabled

- type: `boolean`
- required: `false`
- description: selection IconButton checkbox를 비활성화합니다.

### media

- type: `ReactNode`
- required: `false`
- description: 64px media frame 안에 렌더링할 이미지 또는 미디어 preview입니다. `img`는 frame에 맞게 cover 처리합니다.

### mediaStatus

- type: `'default' | 'error'`
- required: `false`
- default: `default`
- description: media가 없을 때 placeholder frame의 상태를 표현합니다. `error`이면 negative dashed border를 사용합니다.

### mediaActionLabel / mediaActionIcon / mediaActionAriaLabel / onMediaAction

- type: `ReactNode`, `string`, `MouseEventHandler<HTMLButtonElement>`
- required: `false`
- description: media가 없을 때 표시할 action content와 click handler입니다. `onMediaAction`이 있으면 native button으로 렌더링합니다. icon-only action이면 `mediaActionAriaLabel`을 전달해야 합니다.

### statusLabel

- type: `ReactNode`
- required: `false`
- description: 우측 상태 badge에 표시할 내용입니다.

### statusTone

- type: `'neutral' | 'negative'`
- required: `false`
- default: `neutral`
- description: 상태 badge의 색상 계열입니다.

### helperText / helperIcon

- type: `ReactNode`
- required: `false`
- description: status 아래 보조 메시지와 장식 아이콘입니다.

### native div props

- type: `ComponentPropsWithoutRef<'div'>`
- description: `children`, `onChange`를 제외한 native div props를 root에 전달합니다.

## States

- default: media preview, value fields, neutral status badge를 표시합니다.
- error: `mediaStatus=error`, `statusTone=negative`, `helperText` 조합으로 수정 필요 상태를 표현합니다.
- selected: selection IconButton의 `aria-checked`와 checkbox icon 상태를 표현하고 `onCheckedChange`를 호출합니다.
- field placeholder: `value`/`defaultValue`가 없으면 `InlineField` placeholder를 표시합니다.
- field value: `value`와 `onChange`가 함께 있으면 controlled `InlineField`로 렌더링하고, `value`만 있으면 read-only `InlineField`로 렌더링합니다.
- field action: field에 `onClick`이 있으면 native button으로 렌더링합니다. 이 경로는 닫힌 dropdown trigger처럼 `InlineField` input semantics가 맞지 않는 경우에 사용합니다.
- media action: `onMediaAction`이 있으면 native button으로 렌더링합니다.
- disabled: `checkboxDisabled`와 action field `disabled`를 각각 지원합니다. 일반 `InlineField`는 현재 공통 컴포넌트 API에 맞춰 `readOnly` 상태를 사용합니다.
- loading: 지원하지 않습니다. 호출부가 skeleton 또는 노출 여부를 결정합니다.

## Behavior

1. selection IconButton을 선택하면 `checked` 제어 여부에 따라 내부 checked 상태를 갱신하고 `onCheckedChange(nextChecked)`를 호출합니다.
2. media action button을 선택하면 `onMediaAction`을 호출합니다.
3. field에 `onClick`이 있으면 해당 field를 button으로 렌더링하고 클릭 시 호출부 handler를 실행합니다.
4. field에 `onClick`이 없으면 `InlineField`로 렌더링하고, 입력 변경은 field `onChange`로 호출부에 위임합니다.
5. 실제 select popup, image upload, route 이동, API 요청은 실행하지 않습니다.

## Styling

- layout: root는 width 100%, min-height 98px, left/right/bottom border를 갖고 row는 horizontal composition입니다.
- spacing: Figma 기준 root horizontal padding 20px, media leading gap 21px, main columns gap 42px, fields gap 30px를 사용합니다.
- selection: Figma 기준 24px IconButton wrapper 안에 18px checkbox box를 렌더링합니다.
- media: 64px square, 8px radius. error placeholder는 negative light dashed border를 사용합니다.
- field: 일반 field는 `InlineField size="small"`을 사용하고, per-field width는 `width` prop으로 제어합니다.
- action field: 닫힌 dropdown trigger처럼 native button이 필요한 경우에만 ListCell 내부 버튼 스타일을 사용합니다. Figma category trigger 기준 padding은 6px 8px입니다.
- status: 상태 badge는 `Chip`을 사용합니다. `statusTone=negative`이면 negative solid, 그 외에는 neutral subtle입니다.
- responsive: 좁은 부모에서는 root가 horizontal overflow를 허용하고 row 내부 고정 폭을 유지합니다.
- overflow: field text와 helper text는 ellipsis 처리합니다.
- hover/focus/disabled: selection IconButton, interactive field, media action은 focus-visible outline을 유지합니다.
- token usage: 색상은 `atomic`, `semantic`, typography는 `typography` token을 사용합니다.

## Accessibility

- semantic element: root는 `div`, selection은 `IconButton` 기반 `button role="checkbox"`, action field와 media action은 native `button`입니다.
- accessible name: selection IconButton은 `checkboxLabel`, media action은 visible label 또는 `mediaActionAriaLabel`, inline field와 action field는 `aria-label` 또는 visible value/placeholder fallback을 사용합니다.
- keyboard interaction: selection IconButton과 button은 native button keyboard interaction을 사용합니다.
- focus-visible: selection IconButton, media action, action field에 outline을 표시합니다.
- ARIA: helper icon과 trailing icon은 장식용 `aria-hidden` 영역에 렌더링합니다.

## Storybook

- [x] Default / success
- [x] Error
- [x] Field action
- [x] Long text overflow
- [x] Disabled selection and field
- [ ] Loading when supported: 미지원

## Public API

- [x] `ListCell` value export
- [x] `ListCellProps` type export
- [x] `ListCellFieldProps` type export
- [x] `ListCellMediaStatusTypes` type export
- [x] `ListCellStatusToneTypes` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test:unit`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
