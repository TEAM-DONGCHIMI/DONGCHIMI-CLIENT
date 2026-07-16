# Hook Spec: `useOwnerMarketDetailQuery`

## Metadata

- App: `market-owner`
- Domain: `market`
- Jira: DCMSM-79
- Path: `apps/market-owner/src/domains/market/hooks/use-owner-market-detail-query.ts`

## Purpose

로그인 세션의 현재 `marketId`로 점주 마켓 상세 정보를 조회해 마트 정보 관리 폼의 초기값을 제공합니다.

## Contract

- endpoint: `GET /v1/owners/markets/{marketId}`
- params: `marketId?: number`
- query key: `marketQueryKeys.detail(marketId)`
- enabled: `marketId`가 있을 때만 요청합니다.
- response: API boundary의 Zod schema를 통과한 마켓 상세 `data`. `isHolidayClosed`는 수정 폼의 공휴일 선택 상태를 복원하는 데 사용합니다.
- error: HTTP/validation 오류를 query error 상태로 전달하며 페이지가 `MARKET_ACCESS_DENIED`와 `MARKET_NOT_FOUND`를 구분합니다.

## Cache

- root key: `['markets']`
- 상세 캐시는 `marketId`별로 분리합니다.
- retry/cache 시간은 app `QueryClient` 기본 정책을 사용합니다.

## Usage

- pending: 관리 페이지가 조회 중 안내를 표시합니다.
- error: 오류 메시지와 다시 불러오기 action을 표시합니다.
- success: `createMarketInformationForm` mapper로 기존 등록 폼의 초기값을 생성합니다.

## Verification

- [x] `marketId`가 query key에 포함된다.
- [x] `marketId`가 없으면 요청하지 않는다.
- [x] 성공 응답을 API boundary에서 검증한다.
- [x] API 오류를 query state로 전달한다.
