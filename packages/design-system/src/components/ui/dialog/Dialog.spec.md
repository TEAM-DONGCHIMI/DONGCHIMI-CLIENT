# Component Spec: `Dialog`

## Purpose

`Dialog`는 화면 중앙에 뜨는 모달 다이얼로그의 기본 동작을 구성하기 위한 디자인시스템 base primitive입니다.

이 컴포넌트는 modal lifecycle, portal, focus trap, body scroll lock, close interaction, accessible name/description 연결만 담당합니다. header, body, footer, action row, form, upload area, 도메인 문구 같은 모달 레이아웃은 사용처에서 조합합니다.

## Usage Location

- `packages/design-system/src/components/ui/dialog/Dialog.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] controlled / uncontrolled open 상태를 모두 지원합니다.
- [x] trigger, close button, ESC, backdrop click으로 열고 닫을 수 있습니다.
- [x] Title semantic 연결, Description 존재 시 보조 설명 연결, 기본 focus trap, focus restore를 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] header/body/footer 같은 modal layout은 primitive 책임에서 제외합니다.
- [x] width, padding, action alignment 같은 표현 레이아웃은 `Dialog.Content`의 `className` 또는 native props로 사용처가 지정합니다.

## UI Structure

```text
Dialog.Root
  Dialog.Trigger
  Dialog.Content
    Dialog.Title
    Dialog.Description
    Dialog.Close
```

사용처는 `Dialog.Content` 내부에 필요한 모달 레이아웃을 직접 조합합니다.

## Public API

```tsx
<Dialog>
  <Dialog.Trigger>모달 열기</Dialog.Trigger>
  <Dialog.Content className={modalContentClassName}>
    <header>
      <Dialog.Title>엑셀 파일 업로드</Dialog.Title>
      <Dialog.Description>상품 정보가 담긴 엑셀 파일을 선택해주세요.</Dialog.Description>
    </header>
    <div>{/* 사용처 modal layout */}</div>
    <footer>
      <Dialog.Close>취소</Dialog.Close>
      <button type='button'>확인</button>
    </footer>
  </Dialog.Content>
</Dialog>
```

- `Dialog`와 `Dialog.Root`는 동일한 root component입니다.
- `open`과 `onOpenChange`를 사용하면 제어형으로 동작합니다.
- `defaultOpen`을 사용하면 비제어형으로 동작합니다.
- `Dialog.Content`는 portal과 modal dialog backdrop을 함께 렌더링합니다.
- `Dialog.Title`과 `Dialog.Description`은 accessible name/description 연결만 담당하고 typography/layout은 강제하지 않습니다.

## Props

### `Dialog`

- `open`: 현재 열림 상태입니다. 제어형에 사용합니다.
- `defaultOpen`: 초기 열림 상태입니다. 비제어형에서 사용합니다.
- `onOpenChange`: 열림 상태가 바뀔 때 호출합니다.

### `Dialog.Content`

- `children`: dialog 내부 콘텐츠입니다.
- `className`: 사용처에서 필요한 width, padding, layout 보강을 허용합니다.
- native `dialog` props와 keydown handler를 전달할 수 있습니다.
- `aria-labelledby`, `aria-describedby`, `aria-label`을 명시하면 호출부의 접근성 연결을 우선합니다.

### `Dialog.Trigger` / `Dialog.Close`

- native button props를 지원합니다.
- 텍스트가 없는 trigger/close를 사용하는 경우 호출부가 accessible name을 제공해야 합니다.
- 기본 `type`은 `button`입니다.

## States

- open: overlay와 dialog content가 portal에 렌더링됩니다.
- closed: overlay와 dialog content가 제거됩니다.
- controlled: `open` 값이 source of truth입니다.
- uncontrolled: 내부 상태를 `Dialog.Root`가 관리합니다.
- disabled: Dialog 자체 disabled 상태는 제공하지 않고 Trigger/Close 또는 호출부 action이 담당합니다.
- loading / invalid / error: Dialog 자체 상태로 지원하지 않습니다.

## Behavior

1. `Dialog.Trigger`를 클릭하면 dialog가 열립니다.
2. dialog가 열리면 focus가 dialog 내부로 이동합니다.
3. `Escape`, backdrop click, `Dialog.Close`로 닫을 수 있습니다.
4. dialog가 닫히면 focus가 이전 active element 또는 trigger로 복귀합니다.
5. `Dialog.Title`과 `Dialog.Description`이 렌더링되면 dialog의 accessible name/description과 연결합니다.
6. native dialog modal lifecycle은 `showModal()` / `close()`로 동기화합니다.
7. 내부 콘텐츠, form validation, submit, API side effect는 호출부가 관리합니다.

## Styling

- layout: portal에 렌더링된 modal dialog content를 viewport 중앙에 배치합니다.
- width: primitive는 width preset을 제공하지 않습니다. 모달별 width는 호출부가 `className` 또는 native `style`로 지정합니다.
- spacing: primitive는 padding, header/body/footer, action row를 제공하지 않습니다.
- responsive: viewport보다 넓어지지 않도록 `max-width`와 `max-height`만 제한합니다.
- hover/focus/disabled: focus-visible은 dialog content 기준으로 유지하고, 내부 interactive element는 호출부 스타일을 따릅니다.
- token usage: color, shadow, overlay는 `atomic`, `semantic`, `shadow` token을 사용합니다.

## Accessibility

- `Dialog.Content`는 dialog semantics를 가집니다.
- `aria-modal='true'`를 설정합니다.
- `Dialog.Title`은 accessible name으로 연결합니다.
- `Dialog.Description`은 렌더링된 경우 보조 설명으로 연결합니다.
- content 내부에서 기본 focus trap과 outside interaction 제어를 제공합니다.
- keyboard interaction은 `Escape` close와 `Tab` 순환을 지원합니다.
- title을 사용하지 않는 커스텀 구조에서는 호출부가 `aria-label` 또는 `aria-labelledby`를 제공해야 합니다.

## Implementation Notes

- `Dialog`는 `BottomSheet`와 서로 다른 UI 패턴이므로 public primitive는 분리합니다.
- native dialog lifecycle, focus trap, body scroll lock, aria 연결 로직은 `BottomSheet`와 일부 중복됩니다.
- 이번 이슈에서는 `BottomSheet` 리팩터링을 제외합니다. 리뷰 후 필요하면 후속 PR에서 내부 modal utility 추출을 검토합니다.

## Storybook

- [x] Default
- [x] OpenByDefault
- [x] Controlled
- [x] LongContent
- [x] MobileWidth
- [x] WithoutDescription

## Public API Checklist

- [x] `Dialog` value export
- [x] `DialogProps` type export
- [x] `DialogTriggerProps` type export
- [x] `DialogContentProps` type export
- [x] `DialogTitleProps` type export
- [x] `DialogDescriptionProps` type export
- [x] `DialogCloseProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
