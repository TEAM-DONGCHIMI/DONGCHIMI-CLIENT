# Component Spec: `StatusChip`

## Purpose

`StatusChip`은 상품 등록 확인 과정에서 확인 필요 여부와 완료 상태를 강조해 표시하는 디자인시스템 UI primitive입니다. 아이콘과 상태 메시지를 함께 보여주는 용도로, 일반 정보를 보여주는 [`Chip`](./Chip.spec.md)과는 별개 컴포넌트입니다.

## Usage Location

- `packages/design-system/src/components/ui/chip/StatusChip.tsx`

## Category

- `ui`

## Requirements

- 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- `status: 'error' | 'success'` 두 상태만 지원하고, 그 외 `color`/`variant` 조합은 노출하지 않습니다.
- 긴 텍스트는 한 줄에서 말줄임 처리하고 부모 너비를 넘지 않습니다.
- 기본 semantic은 비인터랙티브 `span`입니다.

## UI Structure

```text
StatusChip
  Icon(optional)
  Text
```

## Public API

```ts
interface StatusChipProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
  leftIcon?: ReactNode;
  rounded?: boolean;
  status: 'error' | 'success';
}
```

- `status`에 따라 내부적으로 시각 표현이 결정됩니다: `error` → outlined/negative, `success` → soft/primary. `size`는 항상 고정이라 prop으로 노출하지 않습니다.
- `StatusChip` value export와 `StatusChipProps` type export만 public으로 노출합니다.
- 내부 공유 렌더링은 `ChipBase`(비공개)가 담당하며 export하지 않습니다.

## States And Variants

- `status="error"`: 확인 필요 상태의 외곽선 표현입니다.
- `status="success"`: 완료 상태의 낮은 강조 표현입니다.

## Usage Examples

| 용도      | Props                             |
| --------- | --------------------------------- |
| 확인 필요 | `status="error" leftIcon={...}`   |
| 완료      | `status="success" leftIcon={...}` |

## Behavior

1. `StatusChip`은 자체 클릭 동작을 갖지 않습니다.
2. `leftIcon`은 장식 요소로 렌더링되며 `aria-hidden` 처리합니다.
3. 소비자가 상태 전달 문구를 넣는 경우 `children`이 accessible text가 됩니다.

## Styling

- token 색상과 typography를 우선 사용합니다.
- 36px 높이를 갖습니다.
- `max-width: 100%`, `text-overflow: ellipsis`, `white-space: nowrap`으로 overflow를 방지합니다.

## Accessibility

- semantic element: `span`
- accessible name: 텍스트 children
- keyboard interaction: 없음
- focus-visible: 없음
- ARIA: 장식 icon은 `aria-hidden`

## Storybook

- `StatusChips`

## Verification

- `git diff --check`
- `pnpm --filter @dongchimi/design-system typecheck`
- `pnpm --filter @dongchimi/design-system lint`
- `pnpm --filter @dongchimi/design-system build`
