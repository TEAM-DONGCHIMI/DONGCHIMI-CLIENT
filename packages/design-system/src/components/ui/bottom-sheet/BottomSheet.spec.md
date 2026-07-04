# Component Spec: `BottomSheet`

## Purpose

`BottomSheet`는 화면 하단에서 올라오는 dialog형 UI를 구성하기 위한 디자인시스템 base primitive입니다.

Figma `bottomsheet` 예시는 전단 공유하기 UI를 보여주지만, 디자인시스템 컴포넌트는 공유 문구, 링크 복사, 카카오톡 공유, QR 보기 같은 도메인 콘텐츠를 소유하지 않습니다. DS는 overlay, portal, sheet container, title 연결과 Description 존재 시 보조 설명 연결, close behavior, focus management를 제공하고, 사용처가 내부 콘텐츠와 액션을 조합합니다.

## Usage Location

- `packages/design-system/src/components/ui/bottom-sheet/BottomSheet.tsx`

## Category

- `ui`

## Requirements

- [ ] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [ ] controlled / uncontrolled open 상태를 모두 지원합니다.
- [ ] overlay click, ESC, Close 버튼으로 닫을 수 있습니다.
- [ ] Title semantic 연결, Description 존재 시 보조 설명 연결, 기본 focus trap, focus restore를 보장합니다.
- [ ] token 또는 CSS variable을 우선 사용합니다.

## UI Structure

```text
BottomSheet.Root
  BottomSheet.Trigger
  BottomSheet.Content
    BottomSheet.Handle
    BottomSheet.Header
      BottomSheet.Title
      BottomSheet.Description
    BottomSheet.Body
    BottomSheet.Footer
      BottomSheet.Close
```

## Public API

```tsx
<BottomSheet>
  <BottomSheet.Trigger>공유하기</BottomSheet.Trigger>
  <BottomSheet.Content>
    <BottomSheet.Handle />
    <BottomSheet.Header>
      <BottomSheet.Title>전단 공유하기</BottomSheet.Title>
      <BottomSheet.Description>망원 신선마트 전단을 공유해보세요.</BottomSheet.Description>
    </BottomSheet.Header>
    <BottomSheet.Body>{/* 사용처 콘텐츠 */}</BottomSheet.Body>
    <BottomSheet.Footer>
      <BottomSheet.Close>닫기</BottomSheet.Close>
    </BottomSheet.Footer>
  </BottomSheet.Content>
</BottomSheet>
```

- `BottomSheet`는 `BottomSheet.Root`와 동일한 root component입니다.
- `open`과 `onOpenChange`를 사용하면 제어형으로 동작합니다.
- `defaultOpen`을 사용하면 비제어형으로 동작합니다.
- `BottomSheet.Content`는 기본 portal과 modal dialog backdrop을 함께 렌더링합니다.

## Props

### `BottomSheet`

- `open`: 현재 열림 상태입니다. 제어형에서 사용합니다.
- `defaultOpen`: 초기 열림 상태입니다. 비제어형에서 사용합니다.
- `onOpenChange`: 열림 상태가 바뀔 때 호출됩니다.

### `BottomSheet.Content`

- `children`: sheet 내부 콘텐츠입니다.
- `className`: 사용처에서 필요한 최소 레이아웃 보강을 허용합니다.
- native `dialog` props와 keydown handler를 전달할 수 있습니다.
- `aria-labelledby`, `aria-describedby`를 명시하면 호출부의 접근성 연결을 우선합니다.

### `BottomSheet.Trigger` / `BottomSheet.Close`

- native button props를 지원합니다.
- 텍스트가 없는 trigger/close를 사용하는 경우 호출부가 accessible name을 제공해야 합니다.

## States

- open: overlay와 sheet content가 portal에 렌더링됩니다.
- closed: overlay와 sheet content가 제거됩니다.
- controlled: `open` 값이 source of truth입니다.
- uncontrolled: 내부 상태를 `BottomSheet.Root`가 관리합니다.
- disabled: BottomSheet 자체 disabled 상태는 제공하지 않고 Trigger/Close 또는 호출부 action이 담당합니다.
- loading / invalid / error: BottomSheet 자체 상태로 지원하지 않습니다.

## Behavior

1. `BottomSheet.Trigger`를 클릭하면 sheet가 열립니다.
2. sheet가 열리면 focus가 dialog 내부로 이동합니다.
3. `Escape`, overlay click, `BottomSheet.Close`로 닫을 수 있습니다.
4. sheet가 닫히면 focus가 trigger로 복귀합니다.
5. `BottomSheet.Title`과 `BottomSheet.Description`이 렌더링되면 dialog의 accessible name/description과 연결합니다.
6. native dialog modal lifecycle은 `showModal()` / `close()`로 동기화합니다.
7. 내부 콘텐츠, 공유 액션, API side effect는 호출부가 관리합니다.

## Styling

- layout: portal에 렌더링된 modal dialog content를 viewport 하단에 배치합니다.
- size: mobile bottom sheet 기준으로 `width: 100%`, `max-width: 37.5rem`을 기본값으로 둡니다.
- spacing: Figma 예시를 기준으로 content padding과 section slot을 제공합니다.
- responsive: viewport 폭이 좁으면 가로 폭을 채우고, 넓으면 중앙 정렬된 mobile-width sheet로 보입니다.
- hover/focus/disabled: focus-visible은 sheet content와 호출부 interactive element 기준을 유지합니다.
- token usage: color, typography, overlay는 `atomic`, `semantic`, `typography` token을 사용합니다.

## Accessibility

- `BottomSheet.Content`는 dialog semantics를 가집니다.
- `BottomSheet.Title`은 accessible name으로 연결됩니다.
- `BottomSheet.Description`은 렌더링된 경우 보조 설명으로 연결됩니다.
- content 내부에서 기본 focus trap과 outside interaction 제어를 제공합니다.
- keyboard interaction은 `Escape` close와 `Tab` 순환을 지원합니다.

## Storybook

- [ ] Default
- [ ] Controlled
- [ ] With footer action
- [ ] Long content / scroll constraint
- [ ] Trigger / Close native button usage

## Public API Checklist

- [ ] `BottomSheet` value export
- [ ] `BottomSheetProps` type export
- [ ] `BottomSheetTriggerProps` type export
- [ ] `BottomSheetContentProps` type export
- [ ] `BottomSheetCloseProps` type export
- [ ] `BottomSheetHandleProps` type export
- [ ] `BottomSheetHeaderProps` type export
- [ ] `BottomSheetTitleProps` type export
- [ ] `BottomSheetDescriptionProps` type export
- [ ] `BottomSheetBodyProps` type export
- [ ] `BottomSheetFooterProps` type export
- [ ] no private helper export

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test:unit`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
