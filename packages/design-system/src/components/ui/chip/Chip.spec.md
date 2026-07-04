# Component Spec: `Chip`

## Purpose

`Chip`은 서비스 내 정보 분류, 선택 상태, 필터 조건, 상품 상태처럼 짧은 정보를 빠르게 보여주는 디자인시스템 UI primitive입니다. 주요 액션을 실행하는 버튼이 아니라 항목의 속성이나 상태를 보조적으로 표시합니다.

## Usage Location

- `packages/design-system/src/components/ui/chip/Chip.tsx`

## Category

- `ui`

## Requirements

- 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- Figma `APPJAM` Chip 섹션의 Default Chip, Status Chip, Point Chip 표현을 조합 가능한 props로 지원합니다.
- 긴 텍스트는 한 줄에서 말줄임 처리하고 부모 너비를 넘지 않습니다.
- 기본 semantic은 비인터랙티브 `span`입니다.

## Figma Default Chip Reference

Default Chip은 상품의 할인율, 카테고리, 조회수, 상태, 기간, 상품 수량처럼 짧은 정보를 표시하는 기본 칩입니다. 카드, 리스트, 모바일 뷰 안에서 보조 정보를 빠르게 인지시키는 용도로 사용하고, variant는 사용성 측면에서 나눕니다.

- Type: `Discount` / `Category` / `View Count` / `Edit Required` / `Complete` / `Due Date` / `Product Count`
- Platform: `Desktop` / `Mobile`
- Sale Percent: custom text
- Category Name: custom text
- Views: custom text
- Sale Label: custom text
- Product Count: custom text
- Number: `true` / `false`
- Text: custom text

코드에서는 Figma의 `Type`을 별도 prop으로 노출하지 않고 `size`, `variant`, `color`, `children` 조합으로 표현합니다.

| Figma Type      | Recommended Props                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `Discount`      | `color="negative" variant="solid" size="desktop"`                                                     |
| `Category`      | `color="primary" variant="soft" size="desktop"`                                                       |
| `View Count`    | `color="neutral" variant="subtle" size="desktop"`                                                     |
| `Edit Required` | `color="negative" variant="solid" size="desktop"`                                                     |
| `Complete`      | `color="primary" variant="solid" size="mobileLarge"`                                                  |
| `Due Date`      | `color="negative" variant="solid" size="mobileLarge"` or `color="dark" variant="solid" size="mobile"` |
| `Product Count` | `color="primary" variant="soft" size="mobile"`                                                        |

## UI Structure

```text
Chip
  Icon(optional)
  Text
```

## Public API

```ts
interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
  leftIcon?: ReactNode;
  size?: 'desktop' | 'mobile' | 'mobileLarge' | 'status' | 'pointDesktop' | 'pointMobile';
  variant?: 'solid' | 'soft' | 'subtle' | 'outlined' | 'point';
  color?: 'neutral' | 'primary' | 'negative' | 'dark';
  rounded?: boolean;
}
```

- `Chip` value export와 `ChipProps` type export만 public으로 노출합니다.
- 내부 style helper는 export하지 않습니다.

## States And Variants

- `subtle neutral`: 조회수, 일반 정보처럼 낮은 강조 정보입니다.
- `soft primary`: 카테고리, 완료 정보처럼 긍정 또는 브랜드 색의 낮은 강조 정보입니다.
- `solid primary | negative`: 완료, 마감, 수정 필요, 할인율처럼 강한 강조 정보입니다.
- `solid dark`: 짧은 마감/상태 정보를 어두운 배경으로 표시합니다.
- `outlined negative`: 확인 필요 같은 status chip의 외곽선 표현입니다.
- `point`: `assets/img-chips-point.png` 배경 이미지 위에 할인율을 표시합니다.
- `desktop`, `mobile`, `mobileLarge`, `status`, `pointDesktop`, `pointMobile` 크기를 지원합니다.

## Behavior

1. `Chip`은 자체 클릭 동작을 갖지 않습니다.
2. `leftIcon`은 장식 요소로 렌더링되며 `aria-hidden` 처리합니다.
3. 소비자가 상태 전달 문구를 넣는 경우 `children`이 accessible text가 됩니다.

## Styling

- token 색상과 typography를 우선 사용합니다.
- Figma 기준 desktop chip은 21px, mobile chip은 18px, mobileLarge chip은 25px, status chip은 36px, point chip은 desktop 45px/mobile 40px 높이를 갖습니다.
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
