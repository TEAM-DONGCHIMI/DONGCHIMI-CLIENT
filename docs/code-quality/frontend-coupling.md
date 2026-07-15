# Frontend Coupling

이 문서는 Toss Frontend Fundamentals의 Coupling 기준을 DONGCHIMI-CLIENT 구현 self-check와 리뷰에 적용하는 repo-local 기준입니다.

Coupling은 변경 영향 범위가 작고 예측 가능한지 확인합니다. 구현 중에는 shared/design-system 승격, context 도입, 공통 hook 분리, 중복 제거가 실제로 영향 범위를 줄이는지 봅니다. 리뷰에서는 한 변경이 관련 없는 화면이나 계층까지 같이 흔드는 구조를 찾습니다.

## 적용 시점

- page state, query param, API state, UI state를 한 hook에 묶을지 나눌지 판단할 때
- app-local, app-shared, design-system, package 경계를 정할 때
- props drilling을 composition이나 context로 줄일지 판단할 때
- 중복 제거가 여러 화면을 함께 깨뜨릴 위험이 있는지 확인할 때

## 변경 영향 범위를 줄인다

### 책임을 하나씩 관리하기

- 페이지의 모든 상태를 한 hook에서 관리하는 구조를 피합니다.
- query param, form state, API state, UI state를 기능 단위 hook으로 분리합니다.
- 책임이 작은 hook은 변경 영향이 좁고 회귀 범위도 예측 가능합니다.

### 중복 코드 허용하기

- 공통화는 현재 비슷함이 아니라 앞으로도 동일하게 변함이 확인될 때만 합니다.
- 페이지별 정책, logging, copy, 후속 동작 차이가 예상되면 중복을 허용해 결합을 끊습니다.
- 공통 모듈 수정 시 영향 대상이 빠르게 열거되지 않으면 공통화가 과한 신호입니다.

공통화 전 체크:

- 동작이 페이지마다 동일한가
- logging, copy, 후속 동작이 동일한가
- 가까운 미래에도 동일하게 변할 가능성이 높은가

### Props Drilling 지우기

- 데이터 전달만 하는 중간 컴포넌트가 늘어나면 결합도가 높아집니다.
- 1차 선택은 composition 또는 `children`으로 전달 깊이를 줄이는 것입니다.
- 2차 선택은 context 승격입니다. 단, 역할을 드러내는 props까지 무조건 숨기지 않습니다.

## 구현 Self-Check

- props가 3개 이상 계층을 통과하기만 하고 중간 컴포넌트에서 쓰이지 않는가
- 하나의 hook이 page state, query param, mutation, UI flag를 과하게 함께 반환하지 않는가
- 진짜 전역 관심사가 아닌 값을 context나 shared util로 올리지 않았는가
- shared/design-system 코드가 app-specific copy, route, API, role 정책을 알지 않는가
- 중복 제거가 오히려 여러 화면을 같이 깨뜨리는 결합을 만들지 않는가
- 공통 hook 또는 컴포넌트 수정 후 확인해야 할 호출부가 과도하게 많은가
- composition으로 해결 가능한 문제를 context로 과하게 확장하지 않았는가
- app-local로 충분한 코드를 shared/package로 승격하지 않았는가

## Review Finding 기준

- Critical: 결합 때문에 관련 없는 화면이 깨지거나 app/package boundary를 실제로 위반한 경우
- Warning: 공통화, context, god hook, props drilling이 가까운 변경의 영향 범위를 키우는 경우
- Suggestion: 지금 분리하면 변경 영향이 줄지만 동작 리스크는 낮은 경우
