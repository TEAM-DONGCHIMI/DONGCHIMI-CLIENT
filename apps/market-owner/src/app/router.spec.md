# Market Owner Routing Spec

## Metadata

- Jira: DCMSM-5
- Screen ID: Market Owner App Shell
- Route: `/`, `*`
- Owner: FE
- Status: Implemented

## Purpose

사장님 웹의 React SPA 라우팅 진입점을 React Router 기준으로 고정합니다.
초기 제품 요구사항이 확정되기 전까지는 root route와 fallback route만 제공하고, 실제 기능 페이지는 후속 DCMSM 이슈에서 추가합니다.

## Source Of Truth

- Jira: DCMSM-5
- Decision: README Tech Stack의 사장님 Route는 React Router 7로 결정합니다.
- Architecture: `docs/architecture/market-owner-app.md`, `docs/architecture/app-structure.md`

## Scope

- `apps/market-owner`에 React Router 7을 연결합니다.
- `src/app`은 app shell, provider, router assembly를 담당합니다.
- `src/domains/{domain}/{page}`는 route에 연결되는 app-local page component를 담당합니다.
- route path는 `src/shared/constants/routes.ts`에서 상수화합니다.
- `/`는 사장님 앱 bootstrap smoke 화면을 보여줍니다.
- 존재하지 않는 경로는 app 내부 Not Found 화면을 보여줍니다.

## Out Of Scope

- 인증, 권한별 protected route
- 제품 도메인 page, nested route, layout 설계
- API loader/action, TanStack Query 연동
- 디자인 토큰, vanilla-extract styling
- 서버 HTTP 404 응답 정책

## Layout And Sections

- `/`: `domains/home/overview/HomePage`가 `main` 안에 서비스 식별 text와 heading을 렌더링합니다.
- `*`: `domains/not-found/fallback/NotFoundPage`가 404 상태 안내와 홈 이동 링크를 렌더링합니다.

## States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 알 수 없는 route는 `NotFoundPage`에서 처리합니다.
- disabled: 이번 범위에서 다루지 않습니다.
- selected / active: 이번 범위에서 다루지 않습니다.

## Behavior

- navigation: 알 수 없는 path에서 홈 링크를 누르면 `/`로 이동합니다.
- interaction: 홈 링크 외의 사용자 상호작용은 없습니다.
- form / validation: 이번 범위에서 다루지 않습니다.
- API: 이번 범위에서 다루지 않습니다.

## Accessibility

- keyboard: Not Found 홈 링크는 키보드 focus와 Enter 이동이 가능해야 합니다.
- focus: 기본 브라우저 focus indicator를 제거하지 않습니다.
- accessible name: root heading과 Not Found heading은 화면 목적을 설명합니다.

## Responsive

- mobile: 기본 문서 흐름으로 내용이 잘리지 않아야 합니다.
- tablet: 기본 문서 흐름으로 내용이 잘리지 않아야 합니다.
- desktop: 기본 문서 흐름으로 내용이 잘리지 않아야 합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter market-owner lint`
- [ ] `pnpm --filter market-owner typecheck`
- [ ] `pnpm --filter market-owner build`
- [ ] browser route: `/`
- [ ] browser route: unknown path renders Not Found

## Open Questions

- 인증 이후 main layout, nested route, route group은 제품 IA 확정 후 후속 DCMSM 이슈에서 결정합니다.
