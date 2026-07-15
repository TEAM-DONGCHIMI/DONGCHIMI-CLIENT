# Hook Spec: `useIssueQrCodeMutation`

## Purpose

`market-owner` 전단 공유 화면에서 현재 마트의 전단 QR 코드를 발급하거나 기존 발급 이미지를 반환받습니다.

## API Contract

- Method: `POST`
- Path: `/v1/owners/markets/{marketId}/flyers/qr`
- Input: `marketId: number | string`
- Success data: `{ qrCode: string }`
- Request body: none

## Behavior

- `mutateAsync(marketId)`가 domain API helper를 호출합니다.
- 서버 응답은 API boundary의 Zod schema로 검증합니다.
- cache invalidation, optimistic update, retry override를 추가하지 않습니다.
- loading/error 상태와 사용자 피드백은 호출 페이지가 소유합니다.
- 페이지는 로그인 응답에서 auth store에 저장된 현재 `marketId`를 전달합니다.

## Verification

- 올바른 market endpoint로 POST 요청합니다.
- 성공 응답에서 `data.qrCode`만 반환합니다.
- 비어 있는 QR 코드 응답을 거부합니다.
- HTTP client 오류를 숨기지 않습니다.
