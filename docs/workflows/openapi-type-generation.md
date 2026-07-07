# OpenAPI 타입 생성

## 목적

Swagger/OpenAPI를 백엔드 request/response contract의 source of truth로 사용합니다. 프론트엔드는 Swagger definition에서 TypeScript contract 타입을 생성하고, 실제 API 요청 함수는 각 app 안에 유지합니다.

## 명령

```bash
pnpm api:generate
```

이 명령은 `.env`, `.env.local`, shell environment에서 actor별 Swagger URL을 읽습니다.

```env
USER_SWAGGER_URL=
OWNER_SWAGGER_URL=
```

실제 Swagger URL은 커밋하지 않습니다. 저장소에는 `.env.example`에 필요한 환경변수 이름만 남깁니다.

## 생성 위치

생성된 API contract 타입은 아래 경로에 둡니다.

```text
packages/shared/src/api/__generated__/user/data-contracts.ts
packages/shared/src/api/__generated__/owner/data-contracts.ts
```

`__generated__` 디렉터리의 파일은 직접 수정하지 않습니다. API contract가 바뀌면 Swagger 기준으로 다시 생성합니다.

## 경계

- `packages/shared`는 생성된 request/response contract 타입만 소유합니다.
- Swagger definition이 actor별로 나뉘어 있으므로 사용자 API와 점주 API contract는 분리해서 생성합니다.
- `apps/client`와 `apps/market-owner`는 각 app의 `shared/api/http-client.ts`를 계속 사용합니다.
- API helper 함수는 app-local `httpClient`를 호출합니다.
- TanStack Query key, cache 동작, invalidation, retry, loading/error 처리는 app/domain 코드에서 관리합니다.
- 이 단계에서는 generated API client 함수와 generated React Query hook을 사용하지 않습니다.

## API Client를 생성하지 않는 이유

현재 저장소에는 app-local Ky client, `ApiError` 정규화, QueryClient 기본 정책이 이미 있습니다. 생성된 request 함수를 그대로 사용하면 이 경계를 우회하거나, 별도 custom template 유지보수가 필요할 수 있습니다. 따라서 이번 단계에서는 `swagger-typescript-api`의 client 생성을 비활성화하고 contract 타입 생성에만 사용합니다.

API helper 반복 비용이 커지면, app-local `httpClient`를 호출하는 template 기반 generated client를 후속 작업에서 검토합니다.

## Generic Response 복원

백엔드 OpenAPI 스펙이 `x-generic-base`, `x-generic-type-arg` extension을 제공하면 `scripts/swagger-typescript-api.config.mjs`의 `onParseSchema` hook이 flatten된 response 타입을 generic 타입 표현으로 복원합니다.

예를 들어 백엔드 스펙이 아래 extension을 포함하면:

```yaml
x-generic-base: ApiResponse
x-generic-type-arg: OAuthLoginResponse
```

생성 타입은 아래 형태로 복원될 수 있습니다.

```ts
export type ApiResponseOAuthLoginResponse = ApiResponse<OAuthLoginResponse>;
```

현재 스펙에 해당 extension이 없으면 이 설정은 아무 동작도 하지 않습니다. Generic response extension은 백엔드 `springdoc-generic-response` 적용 이후부터 효과가 있습니다.
