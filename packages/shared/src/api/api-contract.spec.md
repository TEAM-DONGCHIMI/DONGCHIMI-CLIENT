# API Contract

`@dongchimi/shared/api`는 OpenAPI에서 생성한 request/response 타입과 API path contract를 노출합니다.
실제 HTTP 요청, query key, cache, mutation side effect는 각 앱의 domain API helper와 TanStack Query hook이 소유합니다.

## Scope

- OpenAPI generated type export
- user / owner / common endpoint path 상수
- endpoint path parameter 인코딩
- query string 조립 helper
- zod 기반 API 응답 유효성 검증 helper

## Non-Owned Behavior

- app base URL 설정
- Ky instance와 인증 header
- ApiError 정규화 구현
- TanStack Query retry/cache/invalidation
- endpoint별 request body와 response schema 추측
- generated API client 함수 또는 generated React Query hook

## Endpoint Constants

- `API_ENDPOINTS.owner`는 점주 API path를 제공합니다.
- `API_ENDPOINTS.user`는 사용자 API path를 제공합니다.
- `API_ENDPOINTS.common`은 actor와 무관한 공통 API path를 제공합니다.
- path parameter는 `encodeURIComponent`로 인코딩합니다.
- query parameter는 `undefined`와 `null`을 제외하고 `URLSearchParams`로 직렬화합니다.

## Response Validation

`validateApiResponse`는 app/domain API helper가 `httpClient`로 받은 unknown response를 zod schema로 검증할 때 사용합니다.

- 성공: schema output 타입으로 파싱한 값을 반환합니다.
- 실패: `ApiResponseValidationError`를 던집니다.
- error는 `type: 'validation'`과 zod `issues`를 포함해 query/error boundary에서 구분할 수 있습니다.
- endpoint별 schema는 실제 API 명세 또는 OpenAPI generated type과 맞춰 API boundary 가까이에 둡니다.

## Usage

```ts
import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

const ownerHomeResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.unknown().nullable().optional(),
});

const response = await httpClient.get<unknown>(API_ENDPOINTS.owner.home);

return validateApiResponse(ownerHomeResponseSchema, response, {
  endpoint: API_ENDPOINTS.owner.home,
});
```

## Verification

- [ ] `pnpm --filter @dongchimi/shared test:unit`
- [ ] `pnpm --filter @dongchimi/shared typecheck`
- [ ] `pnpm --filter @dongchimi/shared lint`
