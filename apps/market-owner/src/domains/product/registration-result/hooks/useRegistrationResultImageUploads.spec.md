# Hook Spec: `useRegistrationResultImageUploads`

## Metadata

- Jira: DCMSM-80
- Hook: `useRegistrationResultImageUploads`
- Owner: `apps/market-owner` registration-result page
- Status: Implemented

## Purpose

- 상품 이미지의 Presigned URL 발급과 S3 PUT을 일반 field draft debounce 및 draft PUT/GET single-flight와 분리합니다.
- row별 최신 이미지 선택, 업로드 진행/실패 상태, draft에 전달할 S3 `objectKey`를 관리합니다.

## Source Of Truth

- API contract: Presigned upload 응답의 `objectKey`를 prepared product draft `thumbnailUrl`에 전달
- Related page: `RegistrationResultPage.spec.md`
- Related Jira: DCMSM-80, DCMSM-105

## Inputs

- `resolveProductImageFileObjectKey`: 파일을 Presigned URL로 업로드하고 S3 `objectKey`를 반환하는 함수
- `onUploadError`: 최신 업로드 실패를 화면 toast로 연결하는 callback

## Returns

- state: 진행 중 업로드 존재 여부, 실패한 최신 업로드 존재 여부
- actions: 이미지 업로드 시작, 선택 삭제 시 업로드 무효화, 현재 업로드 완료 `objectKey` snapshot 조회, 저장된 업로드 acknowledgment
- result: `uploadImage`는 최신 요청이 성공한 경우에만 `{ file, objectKey, productId }`를 반환하고 stale/실패/비활성 상태는 `null`을 반환

## Behavior

- initial: row별 업로드 상태와 `objectKey`가 없습니다.
- loading: 파일 선택 즉시 해당 row를 `uploading`으로 바꾸고 resolver를 실행합니다. 서로 다른 row 업로드는 병렬 실행할 수 있습니다.
- success: 현재 row의 request id와 일치하는 응답만 `uploaded`와 `objectKey`로 반영합니다.
- error: 최신 요청 실패만 `error` 상태와 `onUploadError`로 전달합니다. preview 소유권은 별도 preview hook에 둡니다.
- retry: 같은 row에서 새 파일을 선택하면 이전 요청을 무효화하고 새 업로드를 시작합니다.
- cleanup: row 삭제와 unmount 이후 도착한 응답은 상태를 변경하지 않습니다.
- acknowledgment: draft 요청에 포함된 `objectKey`와 현재 uploaded 상태가 같은 경우에만 업로드 상태를 제거합니다.

## API Contract

- endpoint: Presigned URL API + returned S3 upload URL
- method: API helper에 위임
- request: `File`
- response: S3 `objectKey`
- draft mapping: `preparedProducts[].thumbnailUrl`
- error mapping: page-local toast callback에 위임

## Constraints

- concurrency: S3 업로드는 draft PUT/GET single-flight를 점유하지 않습니다.
- race: row별 증가 request id로 마지막 선택만 유효하게 합니다.
- cancellation: S3 네트워크 요청 자체를 취소하지 않으며, 삭제/unmount/stale 응답의 상태 반영을 차단합니다.
- ownership: preview object URL 생성/해제는 `useRegistrationResultImagePreviews`가 담당합니다.

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] Logic composition self-check
- [x] immediate start, success, failure, retry state transitions covered
- [x] stale success and stale failure ignored
- [x] delete/unmount invalidation covered
- [x] draft `objectKey` acknowledgment checked

## Open Questions

- 실제 S3 요청 취소는 resolver가 `AbortSignal`을 지원할 때 별도 최적화로 추가합니다. 현재는 네트워크 완료를 허용하되 stale 결과를 무시합니다.
