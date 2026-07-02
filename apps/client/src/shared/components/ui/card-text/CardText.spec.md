# Component Spec: `CardText`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/card-text/CardText.tsx`
- Status: Draft

## Purpose

- 마트의 한마디/오늘의 추천 문구를 1줄로 짧게 보여주는 표시용 카드입니다.
- 점주 안내, 특가 강조, 마감 전 홍보 문구처럼 사용자가 빠르게 읽어야 하는 메시지를 노출할 때 사용합니다.

## Source Of Truth

- Figma: https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=267-14240
- Node ID: 267:14240 (Mobile Mart Comment Card)
- Jira: DCMCL-4

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다. (여러 마켓 화면에서 재사용 가능한 표시용 카드)
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.

## Props

- `text: string` (필수) — 노출할 문구. 1줄 노출을 기준으로 하며, 초과 시 말줄임(ellipsis) 처리됩니다.
- `label?: string` — 상단 라벨. 기본값 `"점장 한마디"`.
- 그 외 `div`의 네이티브 props(`className` 포함)를 전달할 수 있습니다. `children`은 받지 않습니다.
- `ref`는 루트 `div`로 forward됩니다.

## States

- default: 라벨 + 문구 표시.
- 긴 문구: 문구가 1줄을 넘으면 말줄임(ellipsis)으로 잘립니다.
- disabled / loading / error: 해당 없음 (정적 표시 컴포넌트, 상호작용 없음).

## Styling Constraints

- 배경: `semantic.primary.light` (#E6FAF2), radius 12.
- padding: 좌우 18 / 상하 14, 내부 세로 배치 · 라벨/문구 간격 4.
- 라벨: `typography['body-3-semibold']` + `atomic.neutral[60]` (#6B7684).
- 문구: `typography['body-2-medium']` + `atomic.neutral[90]` (#191F28), 1줄 말줄임.
- width: 부모를 채우는 `100%` (Figma의 335px 고정 폭은 컨테이너 폭을 따르도록 대체).

## Accessibility

- 라벨과 문구는 `<p>`로 노출되며, 시각적 말줄임은 DOM 텍스트를 숨기지 않으므로 보조기술은 전체 문구를 읽습니다.
- 상호작용이 없어 keyboard/focus 요구는 없습니다.

## Out Of Scope

- 문구 입력 및 글자 수 제한 검증은 이 컴포넌트가 담당하지 않습니다. (상품 등록 폼 책임)
- TBD: 상품 등록 시 문구 글자 수 제한 값은 제품 정책 미확정 (Jira DCMCL-4).

## Testing

- 유닛 테스트 미대상: interaction·state가 없는 표시용 컴포넌트(copy + 단순 style)라 `docs/workflows/testing.md`의 "When To Add Tests" 기준상 테스트를 강제하지 않습니다.
- 렌더/스타일은 로컬 프리뷰 라우트와 컴파일된 CSS(토큰 값)로 시각 검증했습니다.
- 향후 client 컴포넌트 유닛 테스트가 필요해지면 vitest에 vanilla-extract 플러그인 설정이 선행되어야 하며, 이는 별도 tooling 작업으로 다룹니다.

## Verification

- [x] `pnpm format:check`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
