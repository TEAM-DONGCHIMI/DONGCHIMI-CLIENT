# Domain Component Spec: `DateField`

## Purpose

`DateField`는 product domain에서 날짜를 입력하는 공통 field입니다.
등록 페이지와 상품 수정 modal이 같은 native date picker field를 공유합니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/date-field`
- 사용처: `TodaySpecialRegistrationPage`, `ProductEditModal`, `ProductEditPeriodModal`
- product domain 전용 field이므로 아직 design-system으로 승격하지 않습니다.

## Behavior

- visible value/placeholder와 투명한 native `input type="date"`를 함께 렌더링합니다.
- `Enter` 또는 Space 입력 시 native date picker를 엽니다.
- 직접 타이핑과 paste 입력은 막고, picker 선택으로 값을 변경합니다.
- `readOnly`이면 picker를 열지 않고 회색 읽기 전용 field로 표시합니다.
