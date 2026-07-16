# Provider Spec: `PwaInstallProvider`

## Metadata

- App: `client`
- Path: `apps/client/src/shared/pwa/PwaInstallProvider.tsx`
- Jira: DCMCL-28, DCMCL-34
- Status: Implemented

## Purpose

- 앱이 로드될 때 `beforeinstallprompt`를 보관해 이후 사용자 제스처에서 설치 프롬프트를 열 수 있게 합니다.
- standalone 실행 여부와 `appinstalled` 이벤트를 앱 공용 상태로 제공합니다.
- 제품 문구나 특정 route UI를 포함하지 않고 브라우저 PWA 설치 capability만 소유합니다.

## Public API

- `PwaInstallProvider`: `src/app/providers.tsx`에서 한 번 조립합니다.
- `usePwaInstall()`:
  - `availability`: `prompt`, `unavailable`, `installed` 중 현재 상태입니다.
  - `requestInstall()`: 보관한 프롬프트를 한 번 호출하고 `accepted`, `dismissed`, `unavailable`, `already-installed` 결과를 반환합니다.
- 제품 UI는 `requestInstall()`을 사용자 CTA에서 직접 호출하며, prompt 미지원 상태를 별도 앱 내부 설치 플로우로 확장하지 않습니다.

## States

- `prompt`: 설치 가능한 브라우저가 `beforeinstallprompt`를 전달한 상태입니다.
- `unavailable`: 프로그래밍 방식 설치 프롬프트가 없는 상태입니다.
- `installed`: standalone으로 실행 중이거나 현재 세션에서 `appinstalled`가 발생한 상태입니다.

## Behavior

- `beforeinstallprompt`의 기본 mini-infobar를 막고 이벤트를 메모리에만 보관합니다.
- 이벤트의 `prompt()`는 반드시 `requestInstall()`을 호출한 사용자 액션에서 실행합니다.
- 한 번 사용한 prompt는 수락/거절과 무관하게 제거합니다.
- `appinstalled` 또는 display-mode 변경 시 `installed`로 동기화합니다.
- SSR과 `matchMedia`가 없는 테스트 환경에서도 `unavailable` 상태로 안전하게 동작합니다.

## Accessibility

- Provider는 DOM을 만들지 않습니다.
- 접근 가능한 안내와 버튼 label은 소비 UI가 담당합니다.

## Verification

- [x] prompt 수락/거절 단위 테스트
- [x] unavailable/installed 상태 단위 테스트
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
