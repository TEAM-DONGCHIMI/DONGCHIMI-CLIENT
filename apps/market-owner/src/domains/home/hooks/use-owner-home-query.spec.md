# React Hook Spec: `useOwnerHomeQuery`

## Metadata

- App: `market-owner`
- Domain: `home`
- Path: `apps/market-owner/src/domains/home/hooks/use-owner-home-query.ts`
- Jira: DCMSM-57
- Status: Implemented

## Purpose

사장님 홈 화면 조회 API의 캐시 키와 React Query 호출을 한 곳에 모읍니다. 페이지는 이 hook의
loading, error, data 상태만 소비하고 HTTP 요청 세부 사항을 알지 않습니다.

## Contract

- endpoint: `GET /v1/owners/home`
- query key: `homeQueryKeys.ownerHome()`
- request parameter: 없음
- response: 생성된 `ApiResponseOwnerHomeResponse`와 동기화한 Zod schema를 통과한 홈 데이터
- retry/cache: app `QueryClient` 기본 정책을 사용합니다.
- error: 홈 대시보드가 `role="alert"` 및 재시도 UI를 렌더링하도록 `throwOnError: false`를 설정합니다.

## Boundaries

- 인증 token을 hook, helper, 컴포넌트에서 직접 읽거나 Authorization header를 주입하지 않습니다.
- mutation, invalidation, QR 코드 UI와 상품 검색은 이 hook 범위가 아닙니다.
- query key는 현재 응답 변화 parameter가 없으므로 market ID나 category를 포함하지 않습니다.

## Verification

- query key와 query function이 각각 홈 도메인 key와 API helper를 사용한다.
- helper validation 오류와 HTTP 오류는 query error 상태로 전달된다.
- 성공 응답은 daily/periodic/flyer 대시보드 표시 모델로 변환 가능하다.
