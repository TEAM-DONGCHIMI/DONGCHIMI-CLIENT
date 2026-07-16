# Not Found Page Spec

## Metadata

- Jira: DCMCL-27
- Screen ID: `모웹_404`
- Route: client의 존재하지 않는 경로
- Owner: `apps/client`
- Status: Implemented

## Purpose

- 존재하지 않는 client 경로에 진입한 사용자에게 오류 상태를 안내합니다.
- 사용자가 홈으로 이동해 탐색을 다시 시작할 수 있는 action을 제공합니다.

## Source Of Truth

- 화면: DCMCL-27에 전달된 404 QA 캡처
- 이미지: `src/shared/assets/images/img_404.svg`

## Scope

- 404 일러스트와 오류 안내 문구를 표시합니다.
- 홈으로 돌아가기 링크를 제공합니다.
- 모바일 viewport와 safe area에 대응합니다.
- 화면의 수직 정렬과 콘텐츠 그룹은 디자인시스템 `Stack` primitive를 사용합니다.

## Out Of Scope

- API 404 응답 처리
- 도메인별 error UI
- 로그인 및 인증 redirect 정책 변경

## Layout Measurements

- 기준 viewport: `375px × 812px`
- horizontal gutter: `20px`
- illustration: `200px × 200px`
- illustration-message gap: `40px`
- title-description gap: `12px`
- bottom action: 최대 `335px`, 하단 `60px`

## Behavior

- Next.js App Router가 일치하는 route를 찾지 못하면 이 화면을 렌더링합니다.
- `홈으로 돌아가기`는 client root route인 `/`로 이동합니다.
- 디자인시스템 component public barrel에 client-only 컴포넌트가 함께 포함되어 있어, `Stack`을 사용하는 화면 컴포넌트는 client boundary로 선언합니다.

## Accessibility

- 오류 제목은 `h1`으로 제공합니다.
- 일러스트는 동일한 오류 정보를 반복하므로 접근성 트리에서 제외합니다.
- 홈 이동 action은 링크 semantics와 keyboard focus 상태를 제공합니다.

## Responsive

- 화면은 client mobile shell 너비 안에서 렌더링됩니다.
- 좌우 `2rem`, 하단 `6rem`을 기준으로 safe area를 반영합니다.
- 세로 공간이 짧으면 상단 여백을 줄이고 action과 콘텐츠가 겹치지 않게 합니다.

## Verification

- [x] client lint
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [x] `git diff --check`
- [ ] browser: unknown route, mobile viewport
- [x] local route: unknown route가 HTTP 404와 최종 문구를 반환
