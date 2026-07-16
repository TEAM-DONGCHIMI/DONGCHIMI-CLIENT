# React Page Spec: `EventDiscountRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-registration`
- Route: `/products/event-discount/new`
- Path: `apps/market-owner/src/domains/product/event-discount-registration/EventDiscountRegistrationPage.tsx`
- Jira: DCMSM-18, DCMSM-19, DCMSM-25, DCMSM-33, DCMSM-34, DCMSM-52, DCMSM-62, DCMSM-95, DCMSM-98
- Figma:
  - APPJAM registration method home node 3799:102468
  - APPJAM excel upload image node 3799:102479
  - APPJAM leaflet upload image node 3799:102497
  - APPJAM file upload modal states
  - APPJAM excel template download toast states
  - APPJAM POS excel guide panel node 3799:102635 and guide image node 3808:52574
  - APPJAM file analysis confirm/progress nodes 1553:114355, 1553:114358, 1553:114280, 1553:114305, 1553:114330
- Status: Implemented

## Purpose

행사 할인 상품 등록 flow의 첫 진입 화면에서 등록 방식을 선택하고, 엑셀 파일 업로드 UI 상태를 거쳐 AI 분석 진행 화면으로 이어집니다.
사장님 데스크탑 protected sidebar layout 안에서 렌더링하며, 다운로드 API와 분석 결과 확인 API는 후속 이슈에서 연결합니다.
엑셀 파일 선택 또는 드롭 시 presigned URL 발급과 storage PUT을 완료하고, 모달의 `파일 업로드` CTA 또는 취소 후 confirmation의 `분석 시작` CTA에서 파일 분석 시작 API를 호출합니다. 파일 분석 시작 API로 발급받은 `jobId`를 이용해 실제 분석 진행 SSE를 구독하고, 완료 이벤트 수신 시 상품 결과 등록 확인 route로 이동합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.
- Toast viewport placement is owned by the nearest `ToastProvider`; sidebar protected routes use `SidebarLayout` to show toast feedback at the viewport `top-center`.
- `RegistrationMethodSection` is page-local because upload method copy, CTA behavior, POS guide entry, and toast feedback are tied to this registration flow.
- `PosExcelGuidePanel` is page-local because its title and single guide image are specific to the event discount registration upload guide.
- `usePosGuideModalBehavior` stays page-local because the POS guide is an event discount registration specific modal with its own drawer positioning and modal behavior contract.
- `useExcelUploadFlow` stays page-local because it owns only the excel upload modal, uploaded excel URL and `jobId` handoff, and file-analysis view transitions for this route.
- `useProductImportProgress` stays page-local because it owns the SSE subscription, bounded reconnect, progress mapping, and cleanup lifecycle for this route.
- `startProductImport` stays page-local under `api/` because the owner product import endpoint is only used by this route.
- `useStartProductImportMutation` stays page-local because it wraps the analysis-start mutation without introducing cross-page cache behavior.
- `cancelProductImport` and `useCancelProductImportMutation` stay page-local because canceling an active import is specific to this flow and does not invalidate a cached query.
- `subscribeProductImportProgress` stays page-local because SSE is a long-lived transport connection rather than query cache state; it uses the app HTTP client's authenticated raw response path instead of a query key.
- `resolvePresignedExcelFileUrl` stays page-local because it orchestrates the flow-specific `PRODUCT_IMPORT_EXCEL` presigned upload purpose, S3 PUT, and S3 public URL handoff value.
- The page uses the optional `marketId` prop for isolated tests and otherwise reads the non-sensitive market id persisted from the owner login response; the access token remains memory-only.
- `useFileDrop` is reused from product domain hooks for file drop event handling; accepted extension validation stays in `useExcelUploadFlow` because `.xlsx/.csv` is specific to this flow.
- App-shared `UploadModal` is reused for the excel upload modal default/upload states.
- Shared `ToastProvider`/`useToast` runtime is reused for action feedback while design-system `Toast` remains the rendered UI.
- `FileAnalysisConfirmSection` and `FileAnalysisProgressSection` remain page-local flow steps for the uploaded file confirmation and AI analysis progress.
- `ProcessingStep` is reused from market-owner shared UI for the ordered analysis step list.
- The page passes the supplied `/public/lottie/spinner.lottie` asset through `ProcessingStep.iconSlot`; Lottie playback remains page-specific, while the dotLottie WASM runtime URL is configured once from the app bundle during bootstrap.
- App-shared `DesktopHeader` is reused for the breadcrumb header.
- Design-system `Flex` and `Button` are reused for internal layout and actions.
- No new shared/design-system component is introduced in this issue.

## Layout

- Page root owns background and vertical flow only. It does not apply global inline padding.
- `DesktopHeader` owns its Figma header spacing, including 64px height and 40px inline padding.
- The registration method heading uses `title-2-semibold`, its description uses `body-1-medium`, and
  the two lines keep a `0.4rem` gap. Typography token letter spacing is used without page-local reset.
- Method card titles use `heading-3-semibold`, descriptions use `caption-1-regular`, action labels use
  `body-3-semibold`, and both support lines use `caption-1-medium`. Both cards reserve the same 34px
  support area immediately above the bottom padding; a single support line aligns to that area's bottom.
- At the 1440×900 desktop viewport, the method section follows Figma node 3799:102468 with 90px
  top and 56px bottom padding. Its 550px method row uses 14px bottom padding, centers the 355×434px
  cards vertically, and keeps 36px between each card and the `또는` divider.
- `FileAnalysisConfirmSection` is rendered directly under the page root and keeps its card width,
  internal padding, and vertical centering responsibility.

## UI States

- initial/method: `/products/event-discount/new` first renders the registration method home with excel and leaflet upload cards.
- modal/default: clicking `엑셀 업로드` opens `UploadModal` with two-line guidance copy, a file format tooltip, and a disabled upload button.
- modal/upload: selecting or dropping a `.xlsx` or `.csv` file starts the presigned upload, shows the selected file name, and keeps the upload button disabled until the upload handoff value is ready.
- modal/error: selecting or dropping a file outside `.xlsx` or `.csv` shows the upload modal error state and keeps the upload button disabled.
- success/progress: clicking the enabled upload button calls the product import start API, closes the modal, and renders `FileAnalysisProgressSection`.
- cancel/confirm: canceling analysis progress renders `FileAnalysisConfirmSection` with the uploaded file name so the owner can restart analysis or return to the method view.
- loading/progress: product import start success from `파일 업로드` or confirmation `분석 시작` renders `FileAnalysisProgressSection` with pending steps, then applies each `progress` SSE event to the ordered step list and derives the progressbar value from completed steps.
- loading/progress motion: progressbar fill changes animate smoothly between progress increments; users with `prefers-reduced-motion: reduce` receive immediate fill updates.
- loading/icon: only the current `processing` step replaces the default progress icon with the autoplaying, looping spinner Lottie.
- completed: a `completed` SSE event sets progress to 100%, marks the visible steps complete, and navigates to the result route once.
- failed: a `failed` SSE event shows the server message and returns to file confirmation so analysis can be retried.
- canceling: cancel action is disabled as `취소 중` while the POST request is pending; after the cancel API succeeds, the view returns to file confirmation immediately.
- download: clicking `엑셀 양식 다운로드` opens the provided static `.xlsx` URL in a new tab with `noopener`, preserving the registration screen state.
- toast/error: the page can render error toast feedback with the error status icon; `전단지 업로드` currently shows Figma error-style feedback because the actual upload API is out of scope.
- guide line button: `POS에서 엑셀 파일 받는 방법 보기` keeps its visible action styling (`body-3-semibold`, neutral 60, underline) unchanged across default, hover, and focus-visible states.
- panel: clicking `POS에서 엑셀 파일 받는 방법 보기` opens the right POS guide modal panel with a right-to-left slide-in animation, a `2.8rem × 4rem` close button frame aligned at the panel's `1.8rem` top and offset `0.555rem` left from the `2.5rem` content grid, the two-line title (`POS에서 엑셀 파일을` / `이렇게 다운 받으시면 돼요.`), and the single 360×722 WebP guide image; Escape, backdrop click, or the close button hides it and restores focus.
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
  - `GET /v1/owners/markets/{marketId}/products/import/{jobId}/progress`
  - response content type: `text/event-stream`
  - event: `progress`, `completed`, `failed`, `canceled`
  - `POST /v1/owners/markets/{marketId}/products/import/{jobId}/cancel`
  - response: success envelope without data
- fixture:
  - `fileAnalysisConfirmFixture`
  - `fileAnalysisProgressFixtures`
- static registration-method, upload-modal, POS guide, toast copy, and the excel template download URL are colocated with the page that triggers them.
- dotLottie runtime: `@lottiefiles/dotlottie-web/dotlottie-player.wasm` is imported as a Vite asset and registered with `setWasmUrl` so preview deployments do not depend on the default CDN WASM fallback.
- registration method card assets are page-local `assets/img-excel-upload.svg` and `assets/img-leaflet-upload.svg`; both are pure-vector SVGs and render as decorative 80×80 images because the adjacent heading and description provide the card meaning.
- the POS guide asset is `/images/pos-excel-guide.webp` and renders at the Figma size of 360×722; it is informative and uses one alt text that preserves the three-step instructions.
- accepted excel extensions shown to users: `.xlsx`, `.csv`
- public S3 base URL: `VITE_PUBLIC_S3_BASE_URL`
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
- Upload action requests a presigned URL with purpose `PRODUCT_IMPORT_EXCEL`, the selected file content type, and file byte size.
- Upload action PUTs the selected file to the returned `uploadUrl` with `requiredHeaders`.
- Upload success stores the selected file name and a public S3 URL built from `VITE_PUBLIC_S3_BASE_URL` plus the returned `objectKey` while keeping the modal open.
- The modal `파일 업로드` action stays disabled until the presigned upload handoff value is ready.
- Confirmation `취소` clears the uploaded file state and returns to the method view.
- The modal `파일 업로드` action calls `POST /v1/owners/markets/{marketId}/products/import` with `excelFileUrl` set to the uploaded file's public S3 URL.
- Confirmation `분석 시작` uses the same product import start API when the owner returns from canceled progress.
- If `marketId` or `excelFileUrl` is missing, the page keeps the current modal or confirmation view and shows the same file-analysis start failure toast instead of sending a guessed request.
- Import start success stores the returned `jobId`, closes the modal, switches to progress view, and subscribes to the matching progress endpoint.
- Import start failure keeps the current modal or confirmation view and shows the normalized server message for `ApiError`; non-API failures use `파일 분석을 시작하지 못했습니다. 다시 시도해주세요.` as fallback toast feedback.
- Progress events map backend step codes and statuses to the existing `ProcessingStep` labels and UI statuses. The visible progress value is derived from completed step count in 20% increments across the five analysis steps instead of trusting the backend `progress` number.
- The SSE request uses `Accept: text/event-stream`, keeps the app's Authorization/401 refresh policy, disables the normal request timeout, and aborts on unmount.
- If the stream ends with a network error before a terminal event, the hook reconnects at most three total attempts with a one-second delay. Auth, validation, and other non-network errors are surfaced immediately without reconnecting or silently starting a new import job.
- Unknown SSE event names and comment heartbeat frames are ignored. Malformed known event data is treated as a validation error.
- A `completed` terminal event navigates once to `/products/registration-result`; `failed` and `canceled` terminal events do not navigate to the result route.
- Progress `취소` posts the current `marketId` and string `jobId` to the cancel endpoint. API success returns to confirmation and shows completed feedback immediately; a later SSE `canceled` event must not duplicate the return behavior.
- Cancel API failure keeps the progress stream active, unlocks cancel, and shows the normalized server message when available.
- `엑셀 양식 다운로드` opens the provided static `.xlsx` URL in a new tab with `noopener`; browser download behavior follows the static server response and the current registration screen remains unchanged.
- `전단지 업로드` shows the Figma toast feedback. Actual leaflet image upload/API is out of scope.
- Toast feedback uses the shared toast runtime. The page passes the Figma status icon through the toast `icon` slot and uses a stable toast id for registration action feedback so triggering a new toast replaces the visible toast and resets the runtime timer.
- The page does not own toast viewport positioning or sidebar-width correction.
- The POS guide panel behaves as a modal dialog through `usePosGuideModalBehavior`: Escape and backdrop click close it, focus moves to the close button on open and returns to the previously focused trigger on close, Tab focus is kept inside the panel, and body scroll is locked while open.
- The POS guide panel uses a CSS-only open animation from `translateX(100%)` to `translateX(0)` and disables the animation for `prefers-reduced-motion: reduce`.
- The registration method cards render the Figma vector-frame SVG assets at 80×80 without changing card spacing, actions, or support copy.
- The POS guide panel renders the supplied WebP as one responsive 360×722 image. It keeps the original aspect ratio, uses at most the 36rem panel content width, and exposes the complete three-step guidance through one accessible image description.
- Analysis items are read-only static labels until repeated reuse or API mapping is confirmed.
- Analysis progress value is derived from completed analysis steps, then clamped and rounded for display while completion checks use terminal events or completed step status.

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
- [x] excel and leaflet cards render the Figma 80×80 SVG assets as decorative images
- [x] clicking `엑셀 업로드` opens the upload modal in default state
- [x] `.xlsx` or `.csv` file selection starts presigned upload and enables upload action after upload completion
- [x] dropping a file on the upload modal starts presigned upload and enables upload action after upload completion
- [x] unsupported file selection or drop renders upload modal error state
- [x] clicking enabled upload action posts the resolved excel file URL to the product import endpoint
- [x] product import success closes the upload modal and switches to the AI analysis progress section
- [x] canceling analysis progress renders file confirmation with selected file name and analysis items
- [x] AI analysis progress section renders step status labels and progressbar value
- [x] the current processing step renders the supplied spinner Lottie with autoplay and loop enabled
- [x] completed AI analysis progress disables cancel action
- [x] progress SSE updates progress and ordered step status from the current `jobId`
- [x] completed SSE analysis navigates to `/products/registration-result`
- [x] failed SSE analysis shows the server message and returns to confirmation
- [x] cancel posts the current `marketId` and `jobId`, locks duplicate actions, and returns to confirmation after API success
- [x] canceled SSE analysis returns to confirmation without duplicating cancel completion behavior
- [x] premature disconnect retries at most three attempts and unmount aborts the active stream
- [x] clicking `엑셀 양식 다운로드` opens the provided static `.xlsx` URL without changing the registration screen state
- [x] clicking POS guide link opens the modal panel; close button, Escape, and backdrop click close it
- [x] POS guide panel renders the Figma 360×722 guide as one informative WebP image
- [x] clicking `전단지 업로드` renders toast feedback with icon
- [x] route renders sidebar complementary landmark
- [x] sidebar `행사 할인 상품 등록` link has `aria-current="page"`
