---
name: api-integration-workflow
description: endpoint 문서를 기준으로 API helper, TanStack Query hook, 타입, 에러/cache 동작을 구현할 때 사용합니다.
---

# API 연동 작업 흐름

## 목적

API endpoint helper, query/mutation hook, request/response type, error handling, cache behavior를 구현할 때 사용합니다.

## 입력 점검

### 필수 입력

- 대상 앱 또는 package
- HTTP method와 path
- request params/search params/body
- response shape

### 있으면 좋은 입력

- Swagger/OpenAPI URL 또는 endpoint 문서
- error response shape
- cache key에 포함해야 할 response-changing params
- mutation 후 invalidation, optimistic update, retry 기대값
- 적용할 화면 또는 호출 위치

API 계약이 불명확하면 구현 전에 질문합니다. 서버 스펙이 확정되지 않은 필드는 임의로 강하게 고정하지 않습니다.

## 읽기 전략

- 항상 읽기:
  - `recipes/add-api-query.md`
- 조건부 읽기:
  - `docs/architecture/data-layer.md`
  - `docs/workflows/turbo-generators.md`
  - `templates/hook.spec.md`
  - `docs/workflows/spec-writing.md`
  - 가까운 API helper, query key, query/mutation hook

## 메인 작업 흐름

1. API ownership을 결정합니다: domain-local first, real reuse가 있을 때만 app shared 또는 `packages/shared`.
2. API boundary 가까이에 request/response schema 또는 type을 둡니다.
3. Query key에는 response-changing params를 모두 포함합니다.
4. error handling은 network/server/validation error를 구분 가능하게 유지합니다.
5. cache update는 `setQueryData`, `invalidateQueries`, optimistic update 중 필요한 최소 동작을 선택합니다.
6. invalidation, optimistic update, retry는 요구된 동작이 있거나 사용자 경험상 필요한 근거가 있을 때만 추가합니다.

## 완료 기준

- API contract가 boundary에 표현되어 있습니다.
- hook return shape가 사용 지점에서 읽기 쉽습니다.
- query key에 response-changing parameter가 모두 포함됩니다.
- mutation 후 cache update 방식이 명확히 선택되어 있습니다.
- API error를 조용히 삼키지 않습니다.

## 예외

- 요청이 없으면 generated OpenAPI tooling을 추가하지 않습니다.
- 실제 cross-app reuse 없이 app-specific API를 `packages/shared`로 옮기지 않습니다.
- optimistic update나 retry를 기본값으로 추가하지 않습니다.
