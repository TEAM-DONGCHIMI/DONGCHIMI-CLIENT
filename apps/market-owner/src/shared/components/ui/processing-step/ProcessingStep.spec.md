# Component Spec: `ProcessingStep`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/processing-step/ProcessingStep.tsx`
- Jira: `DCMSM-10`
- Figma: `APPJAM` node `230:1096`
- Status: Implemented

## Purpose

- 파일 업로드 이후 상품 등록 처리 흐름을 단계별로 보여주는 사장님 앱 전용 shared UI입니다.
- 각 단계가 `완료`, `진행 중...`, `대기` 중 어디에 있는지 표시해 사용자가 현재 처리 위치를 이해할 수 있게 합니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] 디자인시스템 토큰을 사용해 색상과 typography를 적용합니다.
- [x] 로티 또는 커스텀 아이콘은 `iconSlot`으로 조합할 수 있게 둡니다.

## Props

- `steps`: 외부에서 제어하는 처리 단계 배열입니다.
  - `id`: 단계 key입니다.
  - `title`: 단계명입니다.
  - `status`: `completed`, `processing`, `pending` 중 하나입니다.
  - `statusLabel`: 기본 상태 문구를 대체할 때 사용합니다.
- `iconSlot`: 단계별 아이콘 영역을 교체하는 render function입니다.
- `aria-label`, `aria-labelledby`: 목록 접근성 이름을 지정합니다.
- `className`: 부모 레이아웃에서 너비나 여백을 조정할 때 사용합니다.

## States

- completed: `neutral/10` 배경과 `완료` 상태 문구를 표시합니다.
- processing: border surface와 `aria-current="step"`을 적용하고 `진행 중...` 상태 문구를 표시합니다.
- pending: subdued text와 `대기` 상태 문구를 표시합니다.
- empty: 외부 데이터 문제에 가까우므로 별도 empty UI를 만들지 않고 빈 목록을 렌더링합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test:unit`
- [x] `pnpm --filter market-owner build`
- [x] `pnpm --filter market-owner build-storybook`
