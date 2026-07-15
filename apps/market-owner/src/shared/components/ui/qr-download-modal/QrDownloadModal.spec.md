# Component Spec: `QrDownloadModal`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/qr-download-modal/QrDownloadModal.tsx`
- Jira: DCMSM-76
- Status: Implemented

## Purpose

사장님 홈과 오늘의 전단 공유 화면에서 동일한 매장 QR 이미지를 확인하고 다운로드하는 Dialog UI를 제공합니다.
QR 발급, 홈 조회, 이미지 다운로드 실행과 오류 안내는 호출 화면이 담당합니다.

## Source Of Truth

- Figma: [APPJAM 홈*전단공유하기*모달](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=4010-53139&m=dev)
- Screen ID: `4010:53139`
- Related page specs:
  - `apps/market-owner/src/domains/home/overview/HomePage.spec.md`
  - `apps/market-owner/src/domains/leaflet/share/LeafletSharePage.spec.md`

## Scope

- 전달받은 QR 이미지 source를 270px 정사각형 이미지로 표시합니다.
- `매장 고유 QR코드 다운로드` 액션을 제공합니다.
- Dialog가 닫힐 때 호출 화면의 close callback을 실행합니다.
- 동일한 UI를 홈과 전단 공유 화면에서 재사용합니다.

## Out Of Scope

- QR 발급 또는 홈 조회 API 호출
- Base64/Data URL 정규화
- 파일 다운로드 실행과 성공·실패 처리
- toast, route, analytics

## UI Structure

```text
QrDownloadModal(Dialog)
  Dialog.Content("매장 고유 QR코드")
    img(QR image)
    LineButton("매장 고유 QR코드 다운로드")
```

## Public API

- component: `QrDownloadModal`
- props:
  - `imageLabel`: QR 이미지의 대체 텍스트입니다.
  - `imageSrc`: 호출부가 정규화해 전달하는 이미지 source입니다.
  - `open`: Dialog 표시 상태입니다.
  - `onClose`: overlay 또는 controlled state를 닫는 callback입니다.
  - `onDownload`: 호출부가 소유한 다운로드 callback입니다.
- exported types: `QrDownloadModalProps`
- caller responsibility: QR 데이터 조회·정규화, overlay lifecycle, 다운로드 및 오류 feedback
- non-owned behavior: API 요청, 파일명 정책, toast, navigation

## Requirements

- [x] 홈과 전단 공유 화면이 동일한 Figma `modal_qr` UI를 사용합니다.
- [x] route, API, download, toast, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.

## Props

- `QrDownloadModalProps`

## States

- default: `open=true`이면 QR 이미지와 다운로드 액션을 표시합니다.
- closed: `open=false`이면 Dialog를 표시하지 않습니다.
- disabled: 없음. 다운로드 가능 여부는 호출 전 데이터 경계에서 판단합니다.
- loading: 없음. 데이터 준비가 끝난 뒤 모달을 엽니다.
- error: 없음. 이미지 누락과 다운로드 오류는 호출 화면이 처리합니다.

## Accessibility

- `Dialog.Content`는 `매장 고유 QR코드` accessible name을 제공합니다.
- QR 이미지는 호출부가 전달한 `imageLabel`을 `alt`로 사용합니다.
- 다운로드 액션은 native button semantics를 제공하는 design-system `LineButton`을 사용합니다.
- Escape, 외부 영역 클릭, focus 관리는 design-system `Dialog` 동작을 따릅니다.

## Styling Constraints

- Dialog content: 374px 너비에 대응하는 좌우 52px padding, 36px radius
- QR image: 270px 정사각형, `object-fit: contain`
- image/action gap: 14px
- Figma와 기존 전단 공유 화면의 modal visual을 유지합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`
- [ ] 홈과 `/leaflets/share`에서 열기·닫기·다운로드 action 확인
- [x] Storybook default state 추가
- [x] Frontend Fundamentals self-check
