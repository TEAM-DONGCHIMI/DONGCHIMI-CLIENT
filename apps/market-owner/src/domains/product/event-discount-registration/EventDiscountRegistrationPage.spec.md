# React Page Spec: `EventDiscountRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-registration`
- Route: `/products/event-discount/new`
- Path: `apps/market-owner/src/domains/product/event-discount-registration/EventDiscountRegistrationPage.tsx`
- Jira: DCMSM-18, DCMSM-19, DCMSM-25
- Figma:
  - APPJAM registration method home node 1553:112508
  - APPJAM file upload modal states
  - APPJAM excel template download toast states
  - APPJAM POS excel guide panel
  - APPJAM file analysis confirm/progress nodes 1553:114355, 1553:114358, 1553:114280, 1553:114305, 1553:114330
- Status: Implemented

## Purpose

행사 할인 상품 등록 flow의 첫 진입 화면에서 등록 방식을 선택하고, 엑셀 파일 업로드 UI 상태를 거쳐 등록 파일 확인과 AI 분석 진행 화면으로 이어집니다.
사장님 데스크탑 protected sidebar layout 안에서 렌더링하며, 실제 업로드 API, 다운로드 API, SSE transport, 분석 결과 확인 API는 후속 이슈에서 연결합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.
- Toast viewport placement is owned by the nearest `ToastProvider`; sidebar protected routes use `SidebarLayout` to center toast feedback over the content area.
- `RegistrationMethodSection` is page-local because upload method copy, CTA behavior, POS guide entry, and toast feedback are tied to this registration flow.
- `PosExcelGuidePanel` is page-local because its title and image-only placeholder surfaces are specific to the event discount registration upload guide.
- `usePosGuideModalBehavior` stays page-local because the POS guide is an event discount registration specific modal with its own drawer positioning and modal behavior contract.
- App-shared `UploadModal` is reused for the excel upload modal default/upload states.
- Shared `ToastProvider`/`useToast` runtime is reused for action feedback while design-system `Toast` remains the rendered UI.
- `FileAnalysisConfirmSection` and `FileAnalysisProgressSection` remain page-local flow steps for the uploaded file confirmation and AI analysis progress.
- `ProcessingStep` is reused from market-owner shared UI for the ordered analysis step list.
- App-shared `DesktopHeader` is reused for the breadcrumb header.
- Design-system `Flex` and `Button` are reused for internal layout and actions.
- No new shared/design-system component is introduced in this issue.

## Layout

- Page root owns background and vertical flow only. It does not apply global inline padding.
- `DesktopHeader` owns its Figma header spacing, including 64px height and 40px inline padding.
- `FileAnalysisConfirmSection` is rendered directly under the page root and keeps its card width,
  internal padding, and vertical centering responsibility.

## UI States

- initial/method: `/products/event-discount/new` first renders the registration method home with excel and leaflet upload cards.
- modal/default: clicking `엑셀 업로드` opens `UploadModal` with two-line guidance copy, a file format tooltip, and a disabled upload button.
- modal/upload: selecting a `.xlsx` or `.csv` file shows the selected file name and enables the upload button.
- modal/error: the shared `UploadModal` still supports an error state, but this page does not wire it because client-side extension validation is out of scope for this publishing issue.
- success/confirm: clicking the enabled upload button closes the modal and renders `FileAnalysisConfirmSection` with the selected file name.
- loading/progress: `분석 시작` renders `FileAnalysisProgressSection` with step statuses and progressbar.
- completed: original analysis progress at 100% or all completed steps disable the progress cancel action.
- toast/completed: clicking `엑셀 양식 다운로드` shows completed feedback with the completed status icon.
- toast/error: the page can render error toast feedback with the error status icon; `전단지 업로드` currently shows Figma error-style feedback because the actual upload API is out of scope.
- panel: clicking `POS에서 엑셀 파일 받는 방법 보기` opens the right POS guide modal panel with the two-line title (`POS에서 엑셀 파일을` / `이렇게 다운 받으시면 돼요.`) and three stacked guide image placeholders; Escape, backdrop click, or the close button hides it and restores focus.
- route error: unknown route is handled by the existing router fallback.

## Data

- query: none
- mutation: none
- fixture:
  - `registrationMethodFixture`
  - `fileAnalysisConfirmFixture`
  - `fileAnalysisProgressFixtures`
- accepted excel extensions shown to users: `.xlsx`, `.csv`
- model: none

## Behavior

- Breadcrumb copy is `홈 / 행사 할인 상품 등록` on the method view.
- Breadcrumb copy switches to `행사 할인 상품 등록 / 등록 파일 분석` on confirm/progress views.
- `엑셀 업로드` opens the excel upload modal and resets stale file selection state.
- `UploadModal` uses `.xlsx,.csv` as the file input `accept` hint value.
- The modal default state shows `상품이 등록된 엑셀 파일을 선택해주세요.` / `업로드하면 상품이 자동으로 등록됩니다.` on separate visual lines and shows `지원 파일은 .xlsx, .csv예요.` below the file select button.
- The modal file format tooltip is hidden after the modal moves to upload state.
- The page does not perform client-side extension blocking in this publishing issue. Any selected local file moves the modal to upload state so the user can confirm the selected file name.
- File format validation and server/API upload failure mapping are follow-up integration concerns.
- Upload success is UI-only until API integration: clicking enabled `파일 업로드` stores the selected file name and switches to confirmation.
- Confirmation `취소` returns to the method view.
- `분석 시작` switches to progress view.
- Progress `취소` returns to confirmation view.
- `엑셀 양식 다운로드` shows the success toast. Actual file download/API failure mapping is out of scope.
- `전단지 업로드` shows the Figma toast feedback. Actual leaflet image upload/API is out of scope.
- Toast feedback uses the shared toast runtime. The page passes the Figma status icon through the toast `icon` slot and uses a stable toast id for registration action feedback so triggering a new toast replaces the visible toast and resets the runtime timer.
- The page does not own toast viewport positioning or sidebar-width correction.
- The POS guide panel behaves as a modal dialog through `usePosGuideModalBehavior`: Escape and backdrop click close it, focus moves to the close button on open and returns to the previously focused trigger on close, Tab focus is kept inside the panel, and body scroll is locked while open.
- POS guide image areas are 36rem-wide placeholder surfaces until real guide image assets are provided; the fixed heights are 27.4rem, 24.1rem, and 17.5rem, and step copy stays in accessible image labels instead of visible text.
- Analysis items are read-only static labels until repeated reuse or API mapping is confirmed.
- Analysis progress value is clamped and rounded for display while completion checks use original progress or step status.

## Accessibility

- heading order: method view provides visible `h1` `상품 등록`; confirm/progress views provide their own visible `h1`.
- keyboard: card CTAs, modal actions, POS guide close, confirmation actions, and progress actions use native button interaction.
- focus: focus-visible styles are preserved.
- current state: sidebar item has `aria-current="page"` for the current route.
- breadcrumb: current location nav and current page use `aria-current="page"`.
- modal: `UploadModal` provides dialog title/description through the shared component.
- toast: shared toast runtime renders design-system `Toast`, which supplies status/alert roles and live region defaults; page-supplied icons are decorative.
- POS guide: the right panel is a modal dialog labelled by its visible title (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) with Escape/backdrop close, focus move-to/return, Tab containment, and body scroll lock.
- analysis items: `AI 분석 항목` label and list semantics are preserved.
- analysis progress: `AI 분석 진행 현황` ordered list and `AI 분석 진행률` progressbar semantics are preserved.

## Verification

- [x] `/products/event-discount/new` initial view renders `상품 등록`
- [x] route renders excel and leaflet upload cards
- [x] clicking `엑셀 업로드` opens the upload modal in default state
- [x] `.xlsx` or `.csv` file selection enables upload action
- [x] clicking enabled upload action switches to file confirmation
- [x] file confirmation renders selected file name and analysis items
- [x] `분석 시작` switches to the AI analysis progress section
- [x] AI analysis progress section renders step status labels and progressbar value
- [x] completed AI analysis progress disables cancel action
- [x] clicking `엑셀 양식 다운로드` renders toast feedback with icon
- [x] clicking POS guide link opens the modal panel; close button, Escape, and backdrop click close it
- [x] clicking `전단지 업로드` renders toast feedback with icon
- [x] route renders sidebar complementary landmark
- [x] sidebar `행사 할인 상품 등록` link has `aria-current="page"`
