# Hook Spec: `usePresignedUploadMutation`

## Metadata

- Jira: `DCMSM-50`
- Related API: `POST /v1/uploads/presigned-url`
- Hook: `usePresignedUploadMutation`
- Owner: `apps/market-owner/src/domains/product/hooks`
- Status: Implemented

## Purpose

- 상품 이미지 업로드 전에 Presigned URL을 발급받는 mutation 상태와 실행 함수를 UI 흐름에 제공합니다.
- 페이지나 컴포넌트가 `shared/api`의 HTTP helper를 직접 호출하지 않도록 product domain 경계를 제공합니다.

## Inputs

- `mutate` 또는 `mutateAsync` payload:
  - `purpose`
  - `contentType`
  - `contentLength`

## Returns

- TanStack Query의 mutation 객체를 그대로 반환합니다.
- 호출부는 `mutate`/`mutateAsync`, `isPending`, `isError`, `error`, `data`를 사용합니다.

## Behavior

- idle: Presigned URL을 요청하지 않은 상태입니다.
- pending: 중복 요청이나 제출을 막을 수 있도록 `isPending`을 제공합니다.
- success: S3 PUT에 필요한 `uploadUrl`, `requiredHeaders`와 후속 상품 API에 전달할 `objectKey`를 반환합니다.
- error: API 오류를 삼키지 않고 mutation의 `error`로 노출합니다.
- retry: 앱의 mutation 기본 정책에 따라 자동 재시도하지 않습니다.

## API Contract

- endpoint: `POST /v1/uploads/presigned-url`
- mutation function: `createPresignedUploadUrl`
- cache invalidation: 없음. URL 발급만으로 앱의 서버 리소스 캐시가 변경되지 않습니다.
- optimistic update: 없음.

## Constraints

- 이 hook은 Presigned URL 발급까지만 담당합니다.
- 실제 S3 PUT, 이미지 preview, 상품 등록 API 호출은 해당 화면의 업로드 flow hook이 조합합니다.
- 현재 사용 범위가 상품 이미지이므로 product domain에 두며, 다른 도메인의 실제 재사용이 생기면 shared 승격을 검토합니다.

## Verification

- [x] `git diff --check`
- [x] hook unit test
- [x] market-owner typecheck
- [x] API contract checked
- [x] Frontend Fundamentals / logic composition self-check
