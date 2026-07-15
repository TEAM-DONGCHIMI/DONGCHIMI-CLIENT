# Market Registration Mutation Spec

## Metadata

- Jira: DCMSM-61
- Owner: `apps/market-owner/src/domains/market`
- Endpoint: `POST /v1/owners/markets`

## Contract

- Input: generated `MarketRegisterRequest`
- Output: generated `ApiResponseUnit`, validated at the API boundary
- Cache: 최초 등록 mutation이므로 기존 query cache를 갱신하거나 invalidate하지 않습니다.
- Retry: app QueryClient의 mutation 기본값에 따라 재시도하지 않습니다.

## States And Side Effects

- pending: 등록 버튼을 비활성화하고 `등록 중...`을 표시합니다.
- success: 서버 message로 완료 Toast를 표시한 뒤 홈 route로 replace 이동합니다.
- `INVALID_INPUT`: 서버가 제공한 구체적인 입력 오류 message를 표시합니다.
- `MARKET_ALREADY_EXISTS`: 중복 마트 안내를 표시합니다.
- network / server: 재시도 안내를 표시합니다.
- 기타 오류: 일반 등록 실패 안내를 표시합니다.

## Payload Mapping

- 한 영업시간을 공유하는 요일은 하나의 `days` 배열로 묶습니다.
- 영업 요일은 `MONDAY`~`SUNDAY` enum 문자열로 변환합니다.
- 주간 휴무일은 `isOpen: false`, `open: null`, `close: null`로 변환합니다.
- `공휴일` 선택은 서버 계약에 공휴일 enum이 없으므로 payload에 포함하지 않습니다.
- 주소 검색 연동 전까지 latitude/longitude는 form owner가 제공하는 값을 그대로 전달합니다.

## Verification

- API helper request/response validation test
- form-to-request mapper test
- market-owner lint/typecheck/build
