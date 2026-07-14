# React Page Spec: `EventDiscountRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-registration`
- Route: `/products/event-discount/new`
- Path: `apps/market-owner/src/domains/product/event-discount-registration/EventDiscountRegistrationPage.tsx`
- Jira: DCMSM-18, DCMSM-19, DCMSM-25, DCMSM-33, DCMSM-34, DCMSM-52
- Figma:
  - APPJAM registration method home node 1553:112508
  - APPJAM file upload modal states
  - APPJAM excel template download toast states
  - APPJAM POS excel guide panel
  - APPJAM file analysis confirm/progress nodes 1553:114355, 1553:114358, 1553:114280, 1553:114305, 1553:114330
- Status: Implemented

## Purpose

행사 할인 상품 등록 flow의 첫 진입 화면에서 등록 방식을 선택하고, 엑셀 파일 업로드 UI 상태를 거쳐 등록 파일 확인과 AI 분석 진행 화면으로 이어집니다.
사장님 데스크탑 protected sidebar layout 안에서 렌더링하며, 다운로드 API, SSE transport, 분석 결과 확인 API는 후속 이슈에서 연결합니다.
엑셀 파일 업로드 후 파일 분석 시작 API를 호출하고, 실제 분석 진행 SSE를 연결하기 전까지 page-local fixture simulation으로 진행 상태를 순차 표시한 뒤 상품 결과 등록 확인 route로 이동합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.
- Toast viewport placement is owned by the nearest `ToastProvider`; sidebar protected routes use `SidebarLayout` to show toast feedback at the viewport `top-center`.
- `RegistrationMethodSection` is page-local because upload method copy, CTA behavior, POS guide entry, and toast feedback are tied to this registration flow.
- `PosExcelGuidePanel` is page-local because its title and image-only placeholder surfaces are specific to the event discount registration upload guide.
- `usePosGuideModalBehavior` stays page-local because the POS guide is an event discount registration specific modal with its own drawer positioning and modal behavior contract.
- `useExcelUploadFlow` stays page-local because it owns only the excel upload modal, uploaded excel URL handoff, and file-analysis view transitions for this route.
- `useFileAnalysisSimulation` stays page-local because it temporarily advances fixture frames and owns only timer lifecycle; route navigation remains a page callback.
- `startProductImport` stays page-local under `api/` because the owner product import endpoint is only used by this route.
- `useStartProductImportMutation` stays page-local because it wraps the analysis-start mutation without introducing cross-page cache behavior.
- `resolvePresignedExcelFileUrl` stays page-local because it orchestrates the flow-specific `product_import` presigned upload purpose, S3 PUT, and import-start handoff value.
- `marketId` is accepted as a page prop until the owner market context/auth integration provides a route-level source.
- `useFileDrop` is reused from product domain hooks for file drop event handling; accepted extension validation stays in `useExcelUploadFlow` because `.xlsx/.csv` is specific to this flow.
- App-shared `UploadModal` is reused for the excel upload modal default/upload states.
- Shared `ToastProvider`/`useToast` runtime is reused for action feedback while design-system `Toast` remains the rendered UI.
- `FileAnalysisConfirmSection` and `FileAnalysisProgressSection` remain page-local flow steps for the uploaded file confirmation and AI analysis progress.
- `ProcessingStep` is reused from market-owner shared UI for the ordered analysis step list.
- The page passes the supplied `/public/lottie/spinner.lottie` asset through `ProcessingStep.iconSlot`; Lottie playback remains page-specific.
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
- modal/upload: selecting or dropping a `.xlsx` or `.csv` file shows the selected file name and enables the upload button.
- modal/error: selecting or dropping a file outside `.xlsx` or `.csv` shows the upload modal error state and keeps the upload button disabled.
- success/confirm: clicking the enabled upload button closes the modal and renders `FileAnalysisConfirmSection` with the selected file name.
- loading/progress: `분석 시작` renders `FileAnalysisProgressSection` at 24%, then advances the processing step and progress fixture once per second.
- loading/icon: only the current `processing` step replaces the default progress icon with the autoplaying, looping spinner Lottie.
- completed: all steps reach `completed` and progress reaches 100%, disabling cancel for one interval before automatic navigation.
- toast/completed: clicking `엑셀 양식 다운로드` shows completed feedback with the completed status icon.
- toast/error: the page can render error toast feedback with the error status icon; `전단지 업로드` currently shows Figma error-style feedback because the actual upload API is out of scope.
- guide line button: `POS에서 엑셀 파일 받는 방법 보기` keeps its visible action styling (`body-3-semibold`, neutral 60, underline) unchanged across default, hover, and focus-visible states.
- panel: clicking `POS에서 엑셀 파일 받는 방법 보기` opens the right POS guide modal panel with a right-to-left slide-in animation, the two-line title (`POS에서 엑셀 파일을` / `이렇게 다운 받으시면 돼요.`), and three stacked guide image placeholders; Escape, backdrop click, or the close button hides it and restores focus.
- route error: unknown route is handled by the existing router fallback.

## Data

- query: none
- mutation:
  - `POST /v1/uploads/presigned-url`
  - request body: `{ purpose, contentType, contentLength }`
  - response data: `{ uploadUrl, objectKey, expiresAt, requiredHeaders }`
  - `POST /v1/owners/markets/{marketId}/products/import`
  - request body: `{ excelFileUrl }`
  - response data: `{ jobId }`
- fixture:
  - `fileAnalysisConfirmFixture`
  - `fileAnalysisProgressFixtures`
  - `fileAnalysisSimulationFrames`
- static registration-method, upload-modal, POS guide, and toast copy is colocated with the component that renders or triggers it.
- accepted excel extensions shown to users: `.xlsx`, `.csv`
- model: none

## Behavior

- Breadcrumb copy is `홈 / 행사 할인 상품 등록` on the method view.
- Breadcrumb copy switches to `행사 할인 상품 등록 / 등록 파일 분석` on confirm/progress views.
- `엑셀 업로드` opens the excel upload modal and resets stale file selection state.
- `UploadModal` uses `.xlsx,.csv` as the file input `accept` hint value.
- The modal default state shows `상품이 등록된 엑셀 파일을 선택해주세요.` / `업로드하면 상품이 자동으로 등록됩니다.` on separate visual lines and shows `지원 파일은 .xlsx, .csv예요.` below the file select button.
- Dropping a file on the modal body follows the same selected-file state transition as the native file select button.
- Drag over / drag leave / drop visual effects are intentionally out of scope for DCMSM-34.
- The modal file format tooltip is hidden after the modal moves to upload state.
- The page performs lightweight client-side extension checking for local selection and drag & drop. Files outside `.xlsx` and `.csv` move the modal to error state.
- Upload action requests a presigned URL with purpose `product_import`, the selected file content type, and file byte size.
- Upload action PUTs the selected file to the returned `uploadUrl` with `requiredHeaders`.
- Upload success stores the selected file name and the returned `objectKey` as the import handoff value, then switches to confirmation.
- Confirmation `취소` clears the uploaded file state and returns to the method view.
- `분석 시작` calls `POST /v1/owners/markets/{marketId}/products/import` with `excelFileUrl` set to the uploaded file handoff value. The current presigned contract provides this as `objectKey`.
- If `marketId` or `excelFileUrl` is missing, the page keeps the confirmation view and shows the same file-analysis start failure toast instead of sending a guessed request.
- Import start success stores the returned `jobId` and switches to progress view.
- Import start failure keeps the confirmation view and shows `파일 분석을 시작하지 못했습니다. 다시 시도해주세요.` as toast feedback.
- Progress simulation starts at 24% with `상품명 등록` processing, then advances through 44%, 64%, 84%, and 100% at one-second intervals.
- The 100% frame remains visible for one interval before navigating to `/products/registration-result`.
- Progress `취소` returns to confirmation view, unmounts the simulation hook, and clears the pending timeout so delayed progress or navigation cannot occur.
- `엑셀 양식 다운로드` shows the success toast. Actual file download/API failure mapping is out of scope.
- `전단지 업로드` shows the Figma toast feedback. Actual leaflet image upload/API is out of scope.
- Toast feedback uses the shared toast runtime. The page passes the Figma status icon through the toast `icon` slot and uses a stable toast id for registration action feedback so triggering a new toast replaces the visible toast and resets the runtime timer.
- The page does not own toast viewport positioning or sidebar-width correction.
- The POS guide panel behaves as a modal dialog through `usePosGuideModalBehavior`: Escape and backdrop click close it, focus moves to the close button on open and returns to the previously focused trigger on close, Tab focus is kept inside the panel, and body scroll is locked while open.
- The POS guide panel uses a CSS-only open animation from `translateX(100%)` to `translateX(0)` and disables the animation for `prefers-reduced-motion: reduce`.
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
- drag & drop: dropping a file on the modal body is an alternate pointer input path; keyboard users keep the existing file select button path.
- toast: shared toast runtime renders design-system `Toast`, which supplies status/alert roles and live region defaults; page-supplied icons are decorative.
- POS guide: the right panel is a modal dialog labelled by its visible title (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) with Escape/backdrop close, focus move-to/return, Tab containment, and body scroll lock.
- analysis items: `AI 분석 항목` label and list semantics are preserved.
- analysis progress: `AI 분석 진행 현황` ordered list and `AI 분석 진행률` progressbar semantics are preserved.
- analysis motion: the spinner Lottie is decorative and hidden from the accessibility tree; current state remains available through `aria-current` and visible status text.

## Verification

- [x] `/products/event-discount/new` initial view renders `상품 등록`
- [x] route renders excel and leaflet upload cards
- [x] clicking `엑셀 업로드` opens the upload modal in default state
- [x] `.xlsx` or `.csv` file selection enables upload action
- [x] dropping a file on the upload modal enables upload action
- [x] unsupported file selection or drop renders upload modal error state
- [x] clicking enabled upload action resolves an excel file URL and switches to file confirmation
- [x] file confirmation renders selected file name and analysis items
- [x] `분석 시작` posts the resolved excel file URL to the product import endpoint
- [x] product import success switches to the AI analysis progress section
- [x] AI analysis progress section renders step status labels and progressbar value
- [x] the current processing step renders the supplied spinner Lottie with autoplay and loop enabled
- [x] completed AI analysis progress disables cancel action
- [x] fixture progress advances at one-second intervals and reaches the completed frame
- [x] completed fixture analysis navigates to `/products/registration-result`
- [x] canceling progress clears the timer and prevents delayed navigation
- [x] clicking `엑셀 양식 다운로드` renders toast feedback with icon
- [x] clicking POS guide link opens the modal panel; close button, Escape, and backdrop click close it
- [x] clicking `전단지 업로드` renders toast feedback with icon
- [x] route renders sidebar complementary landmark
- [x] sidebar `행사 할인 상품 등록` link has `aria-current="page"`
