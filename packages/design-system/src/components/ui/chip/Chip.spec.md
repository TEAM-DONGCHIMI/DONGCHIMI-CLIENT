# Component Spec: `Chip`

## Purpose

`Chip`은 서비스 내 정보 분류, 선택 상태, 필터 조건, 상품 상태처럼 짧은 정보를 빠르게 보여주는 디자인시스템 UI primitive입니다. 주요 액션을 실행하는 버튼이 아니라 항목의 속성이나 상태를 보조적으로 표시합니다.

## Usage Location

- `packages/design-system/src/components/ui/chip/Chip.tsx`

## Category

- `ui`

## Requirements

- 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- 용도가 다른 세 가지 표현을 `kind: 'default' | 'status' | 'sale'`로 먼저 구분하고, 각 `kind` 안에서 실제로 지원하는 조합만 prop으로 노출합니다.
  - `default`: 카테고리, 조회수, 할인율, 마감일처럼 일반적인 정보를 보여주는 칩입니다.
  - `status`: 상품 등록 확인처럼 확인 필요/완료 상태를 강조하는 칩입니다.
  - `sale`: 할인율을 이미지 배경 위에 강조해 표시하는 칩입니다.
- 긴 텍스트는 한 줄에서 말줄임 처리하고 부모 너비를 넘지 않습니다.
- 기본 semantic은 비인터랙티브 `span`입니다.

## Kind 별 지원 Prop

| `kind`               | 지원 prop                                                  | 비고                                          |
| -------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `default`(생략 가능) | `variant`(solid/soft/subtle) + `color` + `size`            | 일반적인 정보 표시용 칩                       |
| `status`             | `color`(negative/primary)만 노출, `size`는 `"status"` 고정 | `variant`는 받지 않고 `color`로 표현이 결정됨 |
| `sale`               | `size`(`pointDesktop`/`pointMobile`)만 노출                | `color`/`variant`를 받지 않음                 |

`variant`(solid/soft/subtle)는 `kind="default"` 안에서만 의미를 갖는 시각 강도 축입니다. `kind="status"`는 `color`만으로 outlined/soft 표현이 내부적으로 결정되고, `kind="sale"`은 애초에 `color`/`variant` 자체를 받지 않습니다. `Chip.tsx`의 `ChipVariantProps`가 `kind`별로 실제 허용되는 조합만 타입으로 표현합니다.

## UI Structure

```text
Chip
  Icon(optional)
  Text
```

## Public API

```ts
type DefaultChipSizeTypes = 'desktop' | 'mobile' | 'mobileLarge';
type SaleChipSizeTypes = 'pointDesktop' | 'pointMobile';

type ChipVariantProps =
  | { kind?: 'default'; variant?: 'subtle'; color?: 'neutral'; size?: DefaultChipSizeTypes }
  | { kind?: 'default'; variant: 'soft'; color?: 'primary'; size?: DefaultChipSizeTypes }
  | {
      kind?: 'default';
      variant: 'solid';
      color: 'primary' | 'negative' | 'dark';
      size?: DefaultChipSizeTypes;
    }
  | { kind: 'status'; variant?: never; color: 'negative' | 'primary'; size?: 'status' }
  | { kind: 'sale'; variant?: never; color?: never; size: SaleChipSizeTypes };

type ChipProps = ComponentPropsWithoutRef<'span'> &
  ChipVariantProps & {
    children: ReactNode;
    leftIcon?: ReactNode;
    rounded?: boolean;
  };
```

- `kind`로 표현 그룹을 먼저 나누고, 그 안에서 실제로 스타일이 정의된 `variant`/`color`/`size` 조합만 타입으로 허용하는 discriminated union입니다.
- `kind` 생략 시 `"default"`로 취급됩니다. `kind="status"`는 `variant`를 받지 않고 `color`(negative/primary)만으로 outlined/soft 표현이 내부적으로 결정됩니다. `kind="sale"`은 `color`/`variant`를 아예 받지 않고 `size`(`pointDesktop`/`pointMobile`)만 받습니다.
- 스타일이 없는 조합(예: `kind="sale"` + `size="desktop"`, `kind="status"` + `variant="outlined"`, `variant="solid"`인데 `color` 미지정)은 컴파일 타임에 차단됩니다.
- `Chip` value export와 `ChipProps` type export만 public으로 노출합니다.
- 내부 style helper와 `resolveChipVisualProps` 등 변환 로직은 export하지 않습니다.

## States And Variants

- `kind="default"`(생략 가능)
  - `subtle neutral`(default): 조회수, 일반 정보처럼 낮은 강조 정보입니다.
  - `soft primary`: 카테고리, 완료 정보처럼 긍정 또는 브랜드 색의 낮은 강조 정보입니다.
  - `solid primary | negative | dark`: 완료, 마감, 수정 필요, 할인율처럼 강한 강조 정보입니다. `color`는 세 값 중 하나를 반드시 명시해야 합니다.
  - `desktop`, `mobile`, `mobileLarge` 크기를 지원합니다.
- `kind="status"`
  - `color="negative"`: 확인 필요 상태의 외곽선 표현(내부적으로 `outlined`)입니다.
  - `color="primary"`: 완료 상태의 낮은 강조 표현(내부적으로 `soft`)입니다.
  - `size`는 항상 `"status"`이고, `leftIcon`과 함께 사용합니다.
- `kind="sale"`
  - 배경 이미지(`assets/img-chips-point.svg`) 위에 할인율을 표시합니다. `color`/`variant`를 받지 않습니다.
  - `size`는 `pointDesktop`/`pointMobile`만 허용합니다.

## Usage Examples

| 용도             | Props                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| 할인율 강조      | `color="negative" variant="solid" size="desktop"`                                                       |
| 카테고리         | `color="primary" variant="soft" size="desktop"`                                                         |
| 조회수           | `color="neutral" variant="subtle" size="desktop"`                                                       |
| 수정 필요        | `color="negative" variant="solid" size="desktop"`                                                       |
| 완료             | `color="primary" variant="solid" size="mobileLarge"`                                                    |
| 마감일           | `color="negative" variant="solid" size="mobileLarge"` 또는 `color="dark" variant="solid" size="mobile"` |
| 상품 수량        | `color="primary" variant="soft" size="mobile"`                                                          |
| 확인 필요(상태)  | `kind="status" color="negative" leftIcon`                                                               |
| 완료(상태)       | `kind="status" color="primary" leftIcon`                                                                |
| 할인 칩(desktop) | `kind="sale" size="pointDesktop"`                                                                       |
| 할인 칩(mobile)  | `kind="sale" size="pointMobile"`                                                                        |

## Behavior

1. `Chip`은 자체 클릭 동작을 갖지 않습니다.
2. `leftIcon`은 장식 요소로 렌더링되며 `aria-hidden` 처리합니다.
3. 소비자가 상태 전달 문구를 넣는 경우 `children`이 accessible text가 됩니다.

## Styling

- token 색상과 typography를 우선 사용합니다.
- desktop chip은 21px, mobile chip은 18px, mobileLarge chip은 25px, status chip은 36px, sale chip은 desktop 45px/mobile 40px 높이를 갖습니다.
- `max-width: 100%`, `text-overflow: ellipsis`, `white-space: nowrap`으로 overflow를 방지합니다.

## Accessibility

- semantic element: `span`
- accessible name: 텍스트 children
- keyboard interaction: 없음
- focus-visible: 없음
- ARIA: 장식 icon은 `aria-hidden`

## Storybook

- `DefaultChips`
- `StatusChips`
- `PointChips`

## Verification

- `git diff --check`
- `pnpm --filter @dongchimi/design-system typecheck`
- `pnpm --filter @dongchimi/design-system lint`
- `pnpm --filter @dongchimi/design-system build`
