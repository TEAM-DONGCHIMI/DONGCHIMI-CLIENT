# Hook Spec: `useMarketThumbnailUploadMutation`

## Purpose

- 공통 Presigned URL API와 storage PUT helper를 조합해 마트 대표 이미지를 업로드합니다.

## Behavior

1. 파일의 MIME type과 byte size, `MARKET_THUMBNAIL` purpose로 Presigned URL을 발급받습니다.
2. 발급 응답의 `uploadUrl`, `requiredHeaders`로 파일을 PUT 업로드합니다.
3. 업로드 성공 시 마트 등록 payload에 사용할 `objectKey`를 반환합니다.
4. URL 발급 또는 storage PUT 실패를 mutation error로 전달합니다.
