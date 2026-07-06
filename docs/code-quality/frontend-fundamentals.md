# Frontend Fundamentals

이 문서는 Toss Frontend Fundamentals의 코드 품질 원칙을 DONGCHIMI-CLIENT에서 구현 self-check와 리뷰에 사용하는 repo-local 기준입니다.

원문과 플러그인:

- Frontend Fundamentals: https://frontend-fundamentals.com/code-quality/code/
- Claude Code plugin: https://github.com/toss/frontend-fundamentals/tree/main/frontend-fundamentals-plugin
- Codex skill: `.agents/skills/frontend-fundamentals-review/SKILL.md`

원문의 자세한 사례와 최신 설명은 위 링크를 기준으로 확인합니다. 이 문서는 Codex가 repo 안에서 일관되게 읽을 수 있도록 실전 가이드의 핵심 판단 기준을 옮긴 adapter입니다.

## 참조 방식

Codex skill은 리뷰할 때 사이트를 자동으로 열거나 fetch하지 않습니다.
`$frontend-fundamentals-review`는 이 로컬 문서를 먼저 읽고, 사이트 링크는 기준의 출처와 최신 원문 확인용으로만 사용합니다.

사이트의 실전 가이드가 바뀌면 이 문서를 갱신해야 skill의 리뷰 기준도 바뀝니다.

## 적용 방식

- 페이지, 컴포넌트, hook/state, API query/mutation, form flow 구현 직후에는 이 문서를 self-check 기준으로 사용합니다.
- 비자명한 변경, shared/public API 변경, PR 전 품질 점검, 코드 리뷰 요청 시 `$frontend-fundamentals-review`가 이 문서를 읽습니다.
- 단순 copy, import 정리, formatting-only 변경은 formatter와 정적 검증으로 충분하면 이 기준을 별도 리뷰 단계로 강제하지 않습니다.
- 브라우저 PR 리뷰에서 FE 코드 diff가 있으면 `browser-pr-review-workflow`로 PR 상태와 기존 review thread를 먼저 분리한 뒤 이 기준을 적용합니다.
- lint, typecheck, build를 대체하지 않습니다.
- finding은 파일/라인 근거가 있을 때만 작성합니다.
- CodeRabbit 또는 기존 reviewer thread가 이미 같은 문제를 다뤘다면 중복 코멘트를 만들지 않습니다.
- 기준 밖 취향 문제나 아직 없는 요구사항은 finding으로 만들지 않습니다.

## 1. Readability

코드가 적은 맥락으로 읽히는지 확인합니다.

### 맥락 줄이기

#### 같이 실행되지 않는 코드 분리하기

- 동시에 실행되지 않는 분기 로직을 한 컴포넌트나 함수에 섞어두지 않습니다.
- 최상위 분기에서 역할을 나누고, 하위 컴포넌트는 단일 시나리오만 담당하게 합니다.
- 목표는 한 번에 읽는 맥락 수를 줄이는 것입니다.

#### 구현 상세 추상화하기

- 페이지 컴포넌트는 페이지 목적 중심으로 읽혀야 합니다.
- 인증 체크, redirect, 권한 검사, overlay 제어처럼 도메인 목적과 직접 관련 없는 제어 로직은 wrapper, hook, adapter로 분리합니다.
- 추상화는 호출부를 더 쉽게 읽게 만들 때만 둡니다.

#### 로직 종류에 따라 합쳐진 함수 쪼개기

- 페이지 전체 상태를 전부 다루는 hook을 만들지 않습니다.
- query param, API 상태, form 상태, UI flag를 무조건 한 덩어리로 묶지 않습니다.
- 책임 경계를 좁혀 가독성, 성능, 변경 영향 범위를 함께 개선합니다.

### 이름 붙이기

#### 복잡한 조건에 이름 붙이기

- 중첩된 `filter`, `some`, `map`과 복합 boolean 조건이 섞이면 의미 변수나 함수로 분리합니다.
- 읽는 사람이 조건의 의도를 바로 알 수 있어야 합니다.
- 재사용 또는 테스트 가능성이 있으면 별도 함수로 분리합니다.

#### 매직 넘버에 이름 붙이기

- 시간, 개수, 임계값, 상태코드는 이름 있는 상수로 선언합니다.
- 상수명에는 가능하면 단위를 포함합니다: `_MS`, `_SECONDS`, `_COUNT`.
- 같은 값이 여러 의미를 갖는다면 같은 상수로 묶지 않습니다.

### 위에서 아래로 읽히게 하기

#### 시점 이동 줄이기

- 동작을 이해하기 위해 파일, 함수, 상수 정의를 여러 번 왕복하지 않게 작성합니다.
- 단순한 권한, 분기, 표시 규칙은 사용 지점 근처에 둡니다.
- 추상화는 복잡도를 실제로 줄일 때만 사용합니다.

#### 삼항 연산자 단순하게 하기

- 중첩 삼항 연산자는 피합니다.
- 조건 분기가 2단계 이상이면 `if`, early return, 작은 함수로 펼칩니다.
- JSX 내부 삼항은 단일 조건 전환까지만 허용합니다.

#### 조건부 렌더링 의도 드러내기

- else 분기가 `null`뿐이면 boolean 조건의 `&&` 렌더링을 우선 검토합니다.
- 조건값이 number, string, object처럼 React가 렌더할 수 있는 값이면 `items.length > 0`, `value != null`처럼 boolean으로 명시합니다.
- 양쪽 분기가 모두 의미 있는 UI이면 삼항 연산자를 사용합니다.
- 조건 분기가 2단계 이상이면 JSX 내부 중첩 삼항보다 named variable, early return, 작은 컴포넌트 분리를 우선합니다.

#### JSX 내부 절차형 로직 줄이기

- JSX 안 IIFE, switch, 중첩 return은 렌더링 선언부에 절차형 흐름을 숨기므로 피합니다.
- 분기 계산은 JSX 위에서 이름 있는 값으로 정리하고, JSX는 화면 구조가 먼저 보이게 둡니다.
- 같은 조건을 여러 위치에서 반복하면 조건 이름을 붙이거나 하위 컴포넌트로 분리합니다.
- 분기용 하위 컴포넌트는 실제로 읽는 맥락을 줄일 때만 만들고, 한 줄 조건을 과도하게 숨기지 않습니다.

#### 왼쪽에서 오른쪽으로 읽히게 하기

- 범위 조건은 시작값에서 끝값으로 읽히게 작성합니다.
- 권장 형태: `min <= value && value <= max`
- 조건식 자체가 요구사항 문장처럼 읽히는지 확인합니다.

### Readability 체크 질문

- 동시에 실행되지 않는 분기 로직이 한 컴포넌트나 함수에 얽혀 있지 않은가
- 중첩 삼항, 복잡한 boolean 조건, 긴 inline expression이 의미 있는 이름 없이 노출되지 않았는가
- `condition ? <A /> : null`처럼 else가 `null`인 단순 렌더링이 불필요하게 삼항으로 작성되지 않았는가
- JSX 내부 IIFE, switch, 중첩 return이 렌더링 흐름을 숨기지 않는가
- 읽는 순서가 위에서 아래로 자연스러운가
- 구현 상세가 호출부를 불필요하게 흐리지 않는가
- 주석으로 나쁜 구조를 설명하는 대신 코드 구조로 의도를 드러냈는가
- 버튼, 뷰, 상태의 조건을 파악하려고 여러 정의를 왕복해야 하는가
- 간단하고 자명한 로직까지 과도하게 분리해 오히려 읽기 흐름을 깨지 않았는가

## 2. Predictability

이름, 인자, 반환 타입만 보고 동작을 예측할 수 있는지 확인합니다.

### 일관된 인터페이스

#### 이름 겹치지 않게 관리하기

- 같은 이름이면 같은 수준의 책임과 동작을 가져야 합니다.
- 라이브러리 wrapper는 원본과 다른 이름을 사용해 추가 동작을 드러냅니다.
- 인증, logging, retry, cache mutation 등 부가 동작은 함수명이나 호출부에서 보이게 합니다.

#### 같은 종류의 함수는 반환 타입 통일하기

- 같은 계층 또는 같은 역할의 hook은 같은 shape를 반환합니다.
- React Query hook은 팀 규칙으로 query 객체를 그대로 반환합니다.
- 검증 함수는 `boolean` 또는 `ValidationResult` 중 하나로 통일하고 혼용하지 않습니다.

권장 result shape:

```ts
type ValidationResult = { ok: true } | { ok: false; reason: string };
```

#### 숨은 로직 드러내기

- 함수 이름, 파라미터, 반환 타입에서 예측되지 않는 부수효과를 넣지 않습니다.
- logging, tracking, toast, navigation은 호출 지점 또는 명시적 wrapper로 분리합니다.
- 필요하면 `fetchBalanceWithLogging`처럼 부수효과를 이름으로 노출합니다.

### React 상태와 렌더링 예측 가능성

- 렌더 중 toast, navigation, logging, mutation, storage write 같은 부수효과를 실행하지 않습니다.
- props나 state에서 바로 계산 가능한 값은 `useEffect`와 별도 state로 동기화하지 않습니다.
- props를 state로 복사할 때는 "초기값만 쓰는 uncontrolled 상태"인지, "props 변경을 따라가는 controlled 상태"인지 public API에서 명확히 합니다.
- hook은 조건부로 호출하지 않고, 조건은 hook option이나 내부 guard로 전달합니다.
- list key는 stable id를 사용합니다. 순서가 변할 수 있는 list의 index key와 매 렌더마다 바뀌는 random key는 피합니다.
- `useMemo`와 `useCallback`은 참조 안정성 또는 계산 비용이 실제 요구될 때만 사용하고, 단순 값을 습관적으로 감싸지 않습니다.

### Predictability 체크 질문

- `get`, `fetch`, `calculate`, `use*` 이름과 실제 부수 효과가 어긋나지 않는가
- 같은 종류의 validator, parser, mapper, API helper가 일관된 반환 타입을 갖는가
- 숨은 logging, storage write, navigation, mutation이 호출부에서 보이지 않게 실행되지 않는가
- 라이브러리나 도메인 개념과 헷갈리는 이름을 쓰지 않는가
- hook return shape이 호출부에서 오해하기 어렵게 고정되어 있는가
- 함수 내부 부수효과가 실패해도 핵심 로직 실패로 전이되지 않게 분리됐는가
- 렌더 중 부수효과, derived state 동기화 effect, props-state 복사가 동작을 예측하기 어렵게 만들지 않는가
- hook 호출 순서, list key 안정성, memoization 사용 이유가 React 동작 규칙과 맞는가

### UI semantics 예측 가능성

디자인시스템, shared UI, 앱 공통 컴포넌트는 이름과 public API만 보고 DOM 의미와 상호작용을 예측할 수 있어야 합니다.

- `role`은 컴포넌트가 해당 keyboard/focus behavior를 실제로 제공할 때만 사용합니다.
- `role="checkbox"`를 쓰면 `aria-checked`, Space key toggle, focus target이 함께 맞아야 합니다.
- toggle button은 상태 전환 command이면 `aria-pressed`, 선택 항목 모델이면 listbox/menu/checkbox 등 더 맞는 semantics를 검토합니다.
- `role="menu"`와 `role="listbox"`는 arrow key navigation, active option, focus management를 소유할 때만 사용합니다.
- navigation은 link semantics를, mutation/action은 button semantics를 사용합니다. 스타일 때문에 link와 button을 바꾸지 않습니다.
- 새 React 19 기준 디자인시스템 컴포넌트는 React 18 호환 요구가 없으면 `forwardRef`보다 `ref` prop 패턴을 우선 검토합니다.
- Storybook/Chromatic wrapper 배경, preview connection loss, Node engine warning은 component behavior finding과 분리합니다.

## 3. Cohesion

함께 수정되는 코드가 함께 있는지 확인합니다.

### 함께 바뀌는 코드는 함께 둔다

#### 함께 수정되는 파일을 같은 디렉토리에 두기

- 타입별 대분류만으로 끝내지 말고 기능 또는 도메인 단위로 묶습니다.
- 특정 기능 삭제 시 관련 파일을 디렉토리 단위로 함께 삭제할 수 있어야 합니다.
- 도메인 간 직접 import는 피하고, 필요하면 상위 경계에서 조합합니다.

#### 매직 넘버 없애기

- 숫자 값과 그 값을 요구하는 맥락을 분리하지 않습니다.
- 변경 시 함께 바뀌어야 하는 값은 의미 상수로 끌어올려 같은 모듈에 둡니다.
- 상수는 사용처 근처 또는 도메인 상수 파일에 배치해 동시 수정을 유도합니다.

#### 폼의 응집도 생각하기

- 폼 설계 전에 변경 단위가 필드 중심인지 폼 전체인지 먼저 정합니다.
- 필드 단위 응집은 각 필드의 독립 검증, 비동기 검증, 재사용 요구가 클 때 선택합니다.
- 폼 전체 응집은 필드 간 의존성, 단계형 흐름, 단일 비즈니스 기능 완결성이 클 때 선택합니다.
- 한 폼 안에서 두 방식을 혼합할 때는 기준을 spec에 기록합니다.

### Cohesion 체크 질문

- 같은 feature의 component, hook, type, API helper, fixture, spec이 지나치게 흩어져 있지 않은가
- 같은 의미의 상수, magic number, option 값이 여러 파일에서 따로 관리되지 않는가
- form field, validation, error copy, submit payload가 서로 다른 위치에서 따로 바뀌어야 하지 않는가
- 타입 정의가 실제 사용처와 너무 멀어 변경 누락을 만들지 않는가
- import 경로가 길어질 만큼 관련 코드가 멀리 떨어져 있지 않은가
- 기능 제거 시 폴더 단위 삭제만으로 잔여 코드 없이 정리 가능한가
- 폼 변경 단위가 현재 구조와 일치하는가

## 4. Coupling

변경 영향 범위가 작고 예측 가능한지 확인합니다.

### 변경 영향 범위를 줄인다

#### 책임을 하나씩 관리하기

- 페이지의 모든 상태를 한 hook에서 관리하는 구조를 피합니다.
- query param, form state, API state, UI state를 기능 단위 hook으로 분리합니다.
- 책임이 작은 hook은 변경 영향이 좁고 회귀 범위도 예측 가능합니다.

#### 중복 코드 허용하기

- 공통화는 현재 비슷함이 아니라 앞으로도 동일하게 변함이 확인될 때만 합니다.
- 페이지별 정책, logging, copy, 후속 동작 차이가 예상되면 중복을 허용해 결합을 끊습니다.
- 공통 모듈 수정 시 영향 대상이 빠르게 열거되지 않으면 공통화가 과한 신호입니다.

공통화 전 체크:

- 동작이 페이지마다 동일한가
- logging, copy, 후속 동작이 동일한가
- 가까운 미래에도 동일하게 변할 가능성이 높은가

#### Props Drilling 지우기

- 데이터 전달만 하는 중간 컴포넌트가 늘어나면 결합도가 높아집니다.
- 1차 선택은 composition 또는 `children`으로 전달 깊이를 줄이는 것입니다.
- 2차 선택은 context 승격입니다. 단, 역할을 드러내는 props까지 무조건 숨기지 않습니다.

### Coupling 체크 질문

- props가 3개 이상 계층을 통과하기만 하고 중간 컴포넌트에서 쓰이지 않는가
- 하나의 hook이 page state, query param, mutation, UI flag를 과하게 함께 반환하지 않는가
- 진짜 전역 관심사가 아닌 값을 context나 shared util로 올리지 않았는가
- shared/design-system 코드가 app-specific copy, route, API, role 정책을 알지 않는가
- 중복 제거가 오히려 여러 화면을 같이 깨뜨리는 결합을 만들지 않는가
- 공통 hook 또는 컴포넌트 수정 후 확인해야 할 호출부가 과도하게 많은가
- composition으로 해결 가능한 문제를 context로 과하게 확장하지 않았는가

## Tradeoff

네 기준은 항상 동시에 극대화되지 않습니다.

- 응집도를 높이려고 공통화하면 가독성이 떨어질 수 있습니다.
- 중복을 허용하면 결합도는 낮아질 수 있지만 응집도가 떨어질 수 있습니다.
- 추상화는 변경 누락을 줄일 수 있지만 호출부 이해 비용을 늘릴 수 있습니다.

리뷰에서는 "이번 Jira scope에서 어떤 기준이 유지보수 리스크를 가장 크게 줄이는가"를 먼저 판단합니다.

## Output Severity

- Critical: 실제 버그, API 계약 위반, 숨은 부수 효과, 리뷰/검증을 막는 구조
- Warning: 가까운 시점에 유지보수 비용을 키울 가능성이 높은 구조
- Suggestion: 지금 고치면 읽기 쉬워지지만 PR을 막지는 않는 개선
