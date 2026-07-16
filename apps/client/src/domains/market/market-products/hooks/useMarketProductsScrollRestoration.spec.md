# Market Products Scroll Restoration Hook Spec

## Metadata

- Jira: DCMCL-24
- Hook: `useMarketProductsScrollRestoration`
- Owner: `apps/client/domains/market/market-products`
- Status: Ready

## Purpose

- TOP3, 오늘의 특가 또는 행사 할인 상품 상세에서 SPA 뒤로가기를 실행했을 때 목록 상태를 먼저 재구성하고 클릭 상품의 viewport 상대 위치를 복원합니다.
- 행사 할인 상품의 무한 목록 데이터는 별도로 복제하지 않고 기존 TanStack Query `pages/pageParams` 캐시를 재사용합니다.

## Source Of Truth

- Related page/component: `MarketProductsQueryContent`, `PopularProductsSection`, `TodaySpecialProductsSection`, `EventDiscountProductsSection`
- Related Jira: DCMCL-24

## Inputs

- params: market route의 `marketSlug`
- external state: route 단위 sessionStorage snapshot, 목록 history entry 복원 token, 브라우저 `popstate`, 상품 anchor DOM

## Returns

- data: 뒤로가기에서 읽은 section별 초기 복원 상태 또는 `null`
- status: 외부로 노출하지 않음
- actions: 저장은 section의 상품 link click handler가 route-local 저장 함수로 수행
- errors: sessionStorage 접근과 파싱 오류를 외부로 전파하지 않음

## Behavior

- initial state: 현재 history entry의 복원 token과 sessionStorage snapshot이 일치할 때만 저장 상태를 읽습니다.
- save: 일반적인 primary link click에서 상품/section/anchor/상대 위치/`scrollY`와 section 상태를 저장하고 현재 목록 history entry에 일회성 복원 token을 표시합니다.
- reused route: Next App Router가 목록 컴포넌트를 재사용하면 마운트된 hook이 `popstate`를 구독해 현재 history entry의 snapshot을 다시 읽습니다.
- restore state: 오늘의 특가는 전체보기, 행사 할인은 category와 category 더보기를 초기값으로 적용합니다.
- late restore state: 목록 component가 이미 마운트된 뒤 snapshot이 도착해도 `restorationId`별로 한 번만 section 상태에 적용합니다.
- cached list: 행사 할인은 복원 category와 동일한 query key를 사용해 기존 `pages/pageParams`를 그대로 렌더링합니다.
- anchor success: anchor의 현재 top과 저장한 viewport top 차이를 `auto` scroll로 보정하고 허용 오차 안에서 연속 frame 동안 안정된 뒤 snapshot을 제거합니다.
- anchor pending: 비동기 목록 렌더링 동안 제한된 시간 내에서 animation frame으로 anchor를 기다립니다.
- fallback: 제한 시간 내 anchor를 찾지 못하면 저장된 절대 `scrollY`를 사용하고 snapshot을 제거합니다.
- navigation scope: 브라우저 뒤로가기와 상세 헤더 `router.back()`으로 저장한 목록 history entry가 다시 활성화된 경우만 복원 대상으로 봅니다.
- stale state: TTL을 초과했거나 형식이 잘못된 snapshot은 제거하고 사용하지 않습니다.
- side effects: focus를 변경하지 않고 기본 link navigation을 막지 않습니다.

## Constraints

- cache: 행사 할인 infinite query의 `gcTime`은 30분이며 snapshot TTL도 동일하게 유지합니다.
- scroll container: 전역 page scroll은 Next.js와 browser history가 사용하는 `window/documentElement`가 소유하며 body를 별도 세로 scroll container로 만들지 않습니다.
- concurrency: route별 snapshot은 한 개이며 마지막 primary 상품 click이 이전 값을 덮어씁니다.
- cancellation: component unmount 시 예약한 animation frame을 취소합니다.
- accessibility impact: 기존 link semantics, accessible name, keyboard activation을 유지합니다.

## Verification

- [ ] `git diff --check`
- [ ] Frontend Fundamentals self-check
- [ ] Logic composition self-check
- [ ] 오늘의 특가 펼침 상태 복원
- [ ] 행사 할인 category와 cached pages 복원
- [ ] 상품 anchor 상대 위치 보정
- [ ] anchor 미발견 `scrollY` fallback
- [ ] sessionStorage 실패와 stale snapshot 처리
- [ ] 신규 route 진입에서 과거 snapshot 미적용
- [ ] 목록 컴포넌트 재사용 후 `popstate` 복원
- [ ] TOP3 상품 snapshot과 anchor 복원
- [ ] 실제 Next route에서 category, infinite pages, `window.scrollY`, anchor 상대 위치 복원

## Open Questions

- 없음
