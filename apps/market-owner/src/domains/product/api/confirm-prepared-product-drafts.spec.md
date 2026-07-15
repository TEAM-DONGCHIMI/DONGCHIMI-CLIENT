# API Spec: Confirm Prepared Product Drafts

## Metadata

- App: `market-owner`
- Domain: `product`
- Jira: `DCMSM-83`
- Method: `POST`
- Endpoint: `/v1/owners/markets/{marketId}/products`

## Purpose

`등록완료` 상태의 임시 상품을 현재 마트의 실제 상품으로 일괄 전환한다. 서버는 전체 상품이 유효할 때만 저장하는 all-or-nothing 규칙을 적용한다.

## Contract

- Path parameter: 인증된 마트의 `marketId`
- Request body: 없음
- Success: `{ success: true, code: 'SUCCESS', message: string }`
- Error: `UNAUTHORIZED`(401), `MARKET_ACCESS_DENIED`(403), `MARKET_NOT_FOUND`(404), `DRAFT_NOT_COMPLETED`(409)
- Contract mismatch: 전달받은 Notion 명세의 403 code는 `FORBIDDEN_MARKET_ACCESS`이지만 라이브 OpenAPI는 `MARKET_ACCESS_DENIED`이다. 화면은 code별 분기 없이 공통 HTTP client가 정규화한 서버 `message`를 표시한다.
- Response validation: 성공 응답은 `ConfirmDraftsData` 계약과 Zod schema로 검증한다.

## Integration

- 전단 최종 확인 화면에서 상품 최종 저장 성공 후에만 전단 발행 API를 호출한다.
- 상품 최종 저장 실패 시 전단 발행 API를 호출하지 않는다.
- 상품 최종 저장 성공 후 전단 발행만 실패한 경우, 같은 화면에서의 재시도는 발행 단계부터 다시 시작한다.
- 페이지를 새로고침한 뒤의 재시도 안전성은 서버의 최종 저장 멱등성 계약 확인이 필요하다.
