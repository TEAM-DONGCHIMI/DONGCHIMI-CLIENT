# React Page Spec: `OfflinePage`

## Metadata

- App: `client`
- Domain: `pwa`
- Page: `offline`
- Path: `apps/client/src/domains/pwa/offline/OfflinePage.tsx`
- Jira: DCMCL-28
- Status: Ready

## Purpose

- 네트워크 연결이 없어 요청한 화면을 열 수 없음을 설명합니다.
- 사용자가 네트워크 복구 후 같은 document navigation을 다시 시도할 수 있게 합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- Framework route entry or React Router route object, if needed, imports this page from `src/app`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- retry interaction stays in a page-local Client Component because it depends on `window.location.reload()`.
- the design-system `Button` owns button size, color, disabled, and focus-visible behavior.

## UI States

- loading: none
- empty: none
- error: offline heading, explanation, and retry action
- success: retry reloads the current document; the destination page renders when connectivity has recovered

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Accessibility

- heading order: one visible `h1` (`인터넷 연결을 확인해주세요`)
- keyboard: native button activation
- focus: design-system `Button` focus-visible outline remains visible

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] retry interaction unit test
- [x] `/offline` route smoke check at 320px and 375px
