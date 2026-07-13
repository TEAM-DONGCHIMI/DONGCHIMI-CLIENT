# Presigned Upload API Spec

## Metadata

- Jira: `DCMSM-50`
- API helper: `createPresignedUploadUrl`
- Owner: `apps/market-owner/src/shared/api`
- Status: Implemented

## Purpose

- 파일을 S3 임시 저장소에 직접 업로드하기 전에 Presigned URL과 후속 리소스 생성에 필요한 `objectKey`를 발급받습니다.

## API Contract

- endpoint: `POST /v1/uploads/presigned-url`
- request:
  - `purpose: string`
  - `contentType: string`
  - `contentLength: number`
- response data:
  - `uploadUrl: string`
  - `objectKey: string`
  - `expiresAt: string`
  - `requiredHeaders: Record<string, string>`
- error:
  - `400 INVALID_INPUT`
  - `401 UNAUTHORIZED`
  - `413 FILE_SIZE_EXCEEDED`

## Behavior

- 요청 타입은 공통 OpenAPI generated `PresignedUploadRequest`를 사용합니다.
- 성공 응답은 API boundary에서 검증하고 후속 S3 PUT에 필요한 `data`만 반환합니다.
- HTTP 오류는 기존 `normalizeApiError` 경로로 전달하며 조용히 삼키지 않습니다.
- `createPresignedUploadUrl`은 S3 PUT, 상품 등록 mutation, cache invalidation을 수행하지 않습니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner test:unit -- src/shared/api/presigned-upload.test.ts`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner build`
