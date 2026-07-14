# Data Layer

서버 상태와 HTTP 통신은 앱별로 조립하되, 재사용 가능한 보조 코드만 shared package로 승격합니다.

## Current Direction

`apps/client`의 REST API와 서버 상태 관리는 아래 조합을 기준으로 합니다.

- 서버 상태: TanStack Query
- HTTP client: Ky
- browser API base URL: `/api`
- backend API base URL: server-only `API_BASE_URL`

브라우저의 Ky client는 같은 origin의 `/api` Route Handler만 호출합니다. Route Handler와 Server Action의 Ky client는 server-only `API_BASE_URL`을 사용해 동치미 백엔드를 호출합니다. Next.js의 server-side fetch cache 또는 `revalidate` 동작이 필요한 경로에서는 Next `fetch`를 직접 사용합니다.

## Query Client

- QueryClient는 앱별 `src/shared/query` 위치에서 구성합니다.
- `apps/client` 기본 옵션은 `staleTime: 30_000`, `retry: 2`, `refetchOnWindowFocus: false`입니다.
- 인증/검증 에러는 기본 retry 대상에서 제외합니다.
- mutation 기본 retry는 끕니다.
- query key에는 API 응답을 바꾸는 인자를 포함합니다.
- React Query Devtools는 초기 baseline dependency에 포함하지 않습니다. 실제 디버깅 필요가 생기면 별도 dependency로 추가합니다.

## HTTP Client

- HTTP client는 앱별 `src/shared/api` 위치에서 실행 환경별로 분리합니다.
- `browser-client.ts`는 `/api`를 prefix로 사용하며 token에 직접 접근하지 않습니다.
- `server-client.ts`는 server-only `API_BASE_URL`과 HttpOnly access token cookie를 사용합니다.
- request timeout은 10초로 둡니다.
- Ky transport retry는 기본 0회로 두고, query retry는 TanStack Query에서 제어합니다.
- API error는 `auth`, `configuration`, `network`, `server`, `unknown`, `validation`으로 정규화합니다.
- 인증 cookie 설정·삭제와 refresh는 Route Handler 또는 Server Action에서 처리합니다.
- 공통화가 필요해도 먼저 앱 요구사항을 확인합니다.

## Domain API Boundary

화면 도메인에 묶인 API helper, query/mutation hook, query key는 먼저 앱 domain 안에 둡니다.

```text
apps/{app}/src/domains/{domain}/api/
apps/{app}/src/domains/{domain}/hooks/
apps/{app}/src/domains/{domain}/model/
apps/{app}/src/domains/{domain}/query-keys.ts
```

- `query-keys.ts`에는 response-changing params를 포함하는 named query key factory를 둡니다.
- `model/`에는 domain type, API response/request type, schema, mapper 후보를 둡니다.
- page 폴더 아래에 API helper, query hook, domain model을 만들지 않습니다.
- client endpoint helper는 `browserApi`로 Route Handler를 호출하고, hook은 endpoint helper를 query/mutation function으로 사용합니다.
- Route Handler는 `createServerApi`로 백엔드 endpoint를 호출합니다.
- 여러 도메인 또는 여러 앱에서 실제로 재사용될 때만 앱 `src/shared` 또는 `packages/shared` 승격을 검토합니다.

## API Contract Helpers

공통 OpenAPI generated type, endpoint path 상수, zod 응답 검증 helper는 `@dongchimi/shared/api`에서 제공합니다.
사용자와 점주 전용 OpenAPI generated type은 각각 owning app의 `src/shared/api/__generated__`에서 제공합니다.
이 helper들은 API contract를 표현할 뿐, 앱별 transport 정책을 소유하지 않습니다.

- endpoint path: `API_ENDPOINTS`
- query string 조립: `buildApiPath`
- response validation: `validateApiResponse`, `createApiResponseValidator`
- validation error guard: `isApiResponseValidationError`

앱의 domain API helper는 아래 순서를 따릅니다.

1. `API_ENDPOINTS`로 path를 만든다.
2. browser helper는 앱의 `browserApi`로 BFF 응답을 받고, Route Handler는 `createServerApi`로 백엔드 응답을 받는다.
3. API boundary 가까이에 둔 zod schema로 `validateApiResponse`를 실행한다.
4. hook은 검증된 반환 타입만 사용한다.

generated API client 함수와 generated React Query hook은 현재 경계에서 사용하지 않습니다.

## Promotion Rule

API 보조 코드가 여러 앱에서 동일하게 필요해질 때만 `packages/shared`로 이동합니다.
