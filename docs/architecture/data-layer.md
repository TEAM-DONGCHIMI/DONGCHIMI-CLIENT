# Data Layer

서버 상태와 HTTP 통신은 앱별로 조립하되, 재사용 가능한 보조 코드만 shared package로 승격합니다.

## Current Direction

아직 실제 dependency가 확정되지 않았습니다. 현재 workflow 문서는 아래 조합을 기본 후보로 둡니다.

- 서버 상태: TanStack Query 후보
- HTTP client: Ky 또는 fetch wrapper 후보
- API base URL: app별 environment variable 후보

dependency가 실제로 추가되면 이 문서와 `docs/conventions/package-management.md`를 함께 갱신합니다.

## Query Client

- QueryClient는 앱별 `src/shared/query` 후보 위치에서 구성합니다.
- 기본 옵션은 앱의 사용성 요구사항에 맞춰 명시합니다.
- query key에는 API 응답을 바꾸는 인자를 포함합니다.

## HTTP Client

- HTTP client는 앱별 `src/shared/api` 후보 위치에서 구성합니다.
- 인증, 에러 처리, retry 정책은 임의로 전역화하지 않습니다.
- 공통화가 필요해도 먼저 앱 요구사항을 확인합니다.

## Domain API Boundary

화면 도메인에 묶인 API helper, query/mutation hook, query key는 먼저 앱 page domain 안에 둡니다.

```text
apps/{app}/src/pages/{domain}/api/
apps/{app}/src/pages/{domain}/hooks/
apps/{app}/src/pages/{domain}/query-keys.ts
```

- `query-keys.ts`에는 response-changing params를 포함하는 named query key factory를 둡니다.
- page 폴더 아래에 API helper나 query hook을 만들지 않습니다.
- 여러 도메인 또는 여러 앱에서 실제로 재사용될 때만 앱 `src/shared` 또는 `packages/shared` 승격을 검토합니다.

## Promotion Rule

API 보조 코드가 여러 앱에서 동일하게 필요해질 때만 `packages/shared`로 이동합니다.
