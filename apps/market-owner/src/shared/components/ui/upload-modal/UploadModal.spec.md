# Component Spec: `UploadModal`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/upload-modal/UploadModal.tsx`
- Jira: `DCMSM-14`
- Status: Implemented

## Purpose

- 엑셀 파일 또는 전단지 파일 업로드 과정에서 파일 선택, 선택 상태 안내, 업로드 액션을 제공하는 앱 내부 shared modal입니다.
- Dialog primitive의 focus trap, ESC close, backdrop close, aria title/description 연결을 유지하면서 Upload Modal 전용 시각 상태를 조합합니다.
- 파일 종류, 허용 확장자, 실제 업로드 가능 여부, 업로드 API 호출은 호출부가 소유합니다.

## Source Of Truth

- Default: https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=216-856&m=dev
- Upload: https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=227-1043&m=dev
- Error: https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=227-1093&m=dev

## Scope

- Dialog primitive 기반 modal content
- Default / Upload / Error 시각 상태
- Upload 상태의 optional description 한 줄
- Design system `Button` 기반 파일 선택 trigger
- 숨겨진 file input과 change handler 연결
- 취소 / 업로드 callback 연결
- 파일 선택 icon 기본값과 호출부 override 슬롯

## Out Of Scope

- 실제 업로드 API 연동
- 파일 파싱과 데이터 검증
- 서버 오류 코드별 메시지 매핑
- 업로드 progress, loading, retry UI
- 다른 형태의 modal primitive 구현

## UI Structure

```text
UploadModal
  Dialog.Content
    Dialog.Title
    Body
      Text group
        Optional description
        Dialog.Description
      File select Button
      Hidden file input
    Footer
      Cancel Button
      Upload Button
```

## Public API

- component: `UploadModal`
- exported types: `UploadModalProps`, `UploadModalStateTypes`
- caller responsibility:
  - `open`, `onOpenChange` 제어
  - 업로드 흐름별 `heading` 문구 지정
  - 파일 종류별 `accept` 정책 지정
  - 선택 파일 상태와 업로드 가능 여부 계산
  - 실제 업로드 API 호출과 오류 메시지 매핑
  - 필요 시 파일 선택 icon override
- non-owned behavior:
  - upload API, analytics, route navigation

## Props

- `accept`: required file input accept. 엑셀, 이미지, PDF 등 허용 파일 타입 정책은 호출부가 소유합니다.
- `open`: modal open state
- `onOpenChange`: Dialog open state handler
- `state`: `default` | `upload` | `error`
- `heading`: required title text. 앱 shared 컴포넌트가 엑셀, 전단 같은 특정 업로드 흐름 카피를 기본값으로 소유하지 않도록 호출부가 전달합니다.
- `label`: default/error 안내 문구 또는 upload fallback 문구
- `description`: upload 상태에서 label 위에 표시하는 보조 문구
- `selectedFileText`: upload 상태에서 표시하는 선택 파일/대상 문구
- `fileSelectIcon`: 파일 선택 버튼의 optional decorative icon slot. 기본값은 design-system `IcUpload`입니다.
- `fileSelectLabel`: 파일 선택 버튼 문구, defaults to `파일 선택`
- `cancelLabel`: 취소 버튼 문구, defaults to `취소`
- `uploadButtonLabel`: 업로드 버튼 문구, defaults to `파일 업로드`
- `onFileChange`: hidden file input change handler
- `onCancel`: cancel button click handler. `event.preventDefault()`를 호출하면 modal close를 막을 수 있습니다.
- `onUpload`: upload button click handler
- `uploadButtonDisabled`: upload CTA disabled override

## States

- default: 안내 문구와 assistive solid 파일 선택 버튼을 노출하고 업로드 버튼은 비활성화합니다.
- upload: optional description, 선택 파일/대상 문구, primary soft 파일 선택 버튼, 활성 업로드 버튼을 노출합니다.
- error: negative 안내 문구와 negative outlined 파일 선택 버튼을 노출하고 업로드 버튼은 비활성화합니다.
- disabled: 업로드 버튼은 state가 `upload`이 아닐 때 기본 비활성화하며 `uploadButtonDisabled`로 override할 수 있습니다.
- loading: 이 컴포넌트가 직접 소유하지 않습니다.

## Design System Usage

- file select trigger:
  - component: `Button`
  - size: `small`
  - default: `variant="solid" color="assistive"`
  - upload: `variant="soft" color="primary"`
  - error: `variant="outlined" color="negative"`
  - left icon: `fileSelectIcon`
- footer cancel:
  - component: `Button`
  - size: `large`
  - variant/color: `outlined assistive`
- footer upload:
  - component: `Button`
  - size: `large`
  - variant/color: `solid primary`
  - disabled state: native `disabled`

## Accessibility

- `Dialog.Title`과 `Dialog.Description`을 사용해 dialog accessible name/description을 제공합니다.
- 파일 선택 trigger는 design-system `Button`을 사용하며, click handler에서 hidden file input click을 위임합니다.
- hidden file input은 실제 file picker와 `onFileChange` 연결만 담당하며 `tabIndex={-1}`로 일반 탭 순서에 포함하지 않습니다.
- 파일 선택 icon은 장식 요소로 DS Button의 `leftIcon` slot에 전달되어 `aria-hidden` 처리됩니다.
- 취소 버튼은 design-system `Button`을 사용하며, 클릭 시 `onCancel` 실행 후 `onOpenChange(false)`로 Dialog open state를 닫습니다.
- `onCancel`에서 `event.preventDefault()`를 호출하면 닫힘을 막을 수 있습니다.
- focus trap, ESC close, backdrop close는 Dialog primitive가 담당합니다.

## Styling Constraints

- modal width: `76.8rem`
- modal max-width: `calc(100vw - 3.2rem)`
- modal radius: `2.4rem`
- container padding: `3rem 4rem`
- content width: `68.8rem`
- content min-height: `18.9rem`
- content padding: `4rem 2rem`
- content radius: `2rem`
- content background: `atomic.neutral[10]`
- text group padding: `1rem`
- text group internal gap: `0.4rem`
- body gap:
  - default/error: `2rem`
  - upload: `1rem`
- file select button width: `13.4rem`
- footer gap: `1.4rem`
- footer button width: `20rem`
- long text는 wrapping되어 부모 너비를 넘지 않아야 합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test -- UploadModal`
- [x] Storybook에서 Default / Upload / Error 상태 확인
