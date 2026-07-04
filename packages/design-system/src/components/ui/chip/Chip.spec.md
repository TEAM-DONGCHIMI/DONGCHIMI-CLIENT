# Component Spec: `Chip`

## Purpose

`Chip`은 카테고리, 조회수, 할인율, 마감일처럼 일반적인 정보를 빠르게 보여주는 디자인시스템 UI primitive입니다. 주요 액션을 실행하는 버튼이 아니라 항목의 속성을 보조적으로 표시합니다. 확인 필요/완료 같은 상태 강조는 [`StatusChip`](./StatusChip.spec.md), 이미지 배경 위 할인율 강조는 [`PointChip`](./PointChip.spec.md)이 각각 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/chip/Chip.tsx`

## Category

- `ui`

## Requirements

- 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- 긴 텍스트는 한 줄에서 말줄임 처리하고 부모 너비를 넘지 않습니다.
- 기본 semantic은 비인터랙티브 `span`입니다.
- 실제로 스타일이 정의된 `color`/`variant` 조합만 타입으로 허용합니다.

## UI Structure

```text
Chip
  Icon(optional)
  Text
```

## Public API

```ts
type ChipSizeTypes = 'desktop' | 'mobile' | 'mobileLarge';

type ChipVariantProps =
  | { color?: 'neutral'; variant?: 'subtle' }
  | { color: 'negative'; variant?: 'solid' }
  | { color: 'dark'; variant?: 'solid' }
  | { color: 'primary'; variant: 'soft' | 'solid' };

type ChipProps = ComponentPropsWithoutRef<'span'> &
  ChipVariantProps & {
    children: ReactNode;
    leftIcon?: ReactNode;
    rounded?: boolean;
    size?: ChipSizeTypes;
  };
```

- `color`가 하나의 `variant`만 지원하는 경우(`neutral`→`subtle`, `negative`/`dark`→`solid`)는 `variant`를 생략할 수 있고 자동으로 채워집니다. `primary`는 `soft`/`solid` 두 조합 다 유효해서 `variant`를 반드시 명시해야 합니다.
- `Chip` value export와 `ChipProps` type export만 public으로 노출합니다.
- 내부 공유 렌더링은 `ChipBase`(비공개)가 담당하며 export하지 않습니다.

## States And Variants

- `subtle neutral`(default): 조회수, 일반 정보처럼 낮은 강조 정보입니다.
- `soft primary`: 카테고리, 완료 정보처럼 긍정 또는 브랜드 색의 낮은 강조 정보입니다.
- `solid primary | negative | dark`: 완료, 마감, 수정 필요, 할인율처럼 강한 강조 정보입니다.
- `desktop`, `mobile`, `mobileLarge` 크기를 지원합니다.

## Usage Examples

| 용도        | Props                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| 할인율 강조 | `color="negative" size="desktop"`                                       |
| 카테고리    | `color="primary" variant="soft" size="desktop"`                         |
| 조회수      | `color="neutral" size="desktop"`                                        |
| 수정 필요   | `color="negative" size="desktop"`                                       |
| 완료        | `color="primary" variant="solid" size="mobileLarge"`                    |
| 마감일      | `color="negative" size="mobileLarge"` 또는 `color="dark" size="mobile"` |
| 상품 수량   | `color="primary" variant="soft" size="mobile"`                          |

## Behavior

1. `Chip`은 자체 클릭 동작을 갖지 않습니다.
2. `leftIcon`은 장식 요소로 렌더링되며 `aria-hidden` 처리합니다.
3. 소비자가 상태 전달 문구를 넣는 경우 `children`이 accessible text가 됩니다.

## Styling

- token 색상과 typography를 우선 사용합니다.
- desktop chip은 21px, mobile chip은 18px, mobileLarge chip은 25px 높이를 갖습니다.
- `max-width: 100%`, `text-overflow: ellipsis`, `white-space: nowrap`으로 overflow를 방지합니다.

## Accessibility

- semantic element: `span`
- accessible name: 텍스트 children
- keyboard interaction: 없음
- focus-visible: 없음
- ARIA: 장식 icon은 `aria-hidden`

## Storybook

- `DefaultChips`

## Verification

- `git diff --check`
- `pnpm --filter @dongchimi/design-system typecheck`
- `pnpm --filter @dongchimi/design-system lint`
- `pnpm --filter @dongchimi/design-system build`
