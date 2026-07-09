# Frontend Predictability

이 문서는 Toss Frontend Fundamentals의 Predictability 기준을 DONGCHIMI-CLIENT 구현 self-check와 리뷰에 적용하는 repo-local 기준입니다.

Predictability는 이름, 인자, 반환 타입, public API, DOM 의미만 보고 동작을 예측할 수 있는지 확인합니다. 구현 중에는 숨은 side effect와 일관되지 않은 인터페이스를 만들지 않는지 보고, 리뷰에서는 호출부가 실제 동작을 오해할 여지를 찾습니다.

## 적용 시점

- hook, API helper, validator, parser, mapper의 반환 shape를 정할 때
- 함수명과 실제 side effect가 어긋나는지 확인할 때
- 디자인시스템, shared UI, 앱 공통 컴포넌트의 DOM semantics와 public API를 설계할 때
- React 상태, key, memoization, hook 호출 순서가 React 동작 규칙과 맞는지 확인할 때

## 일관된 인터페이스

### 이름 겹치지 않게 관리하기

- 같은 이름이면 같은 수준의 책임과 동작을 가져야 합니다.
- 라이브러리 wrapper는 원본과 다른 이름을 사용해 추가 동작을 드러냅니다.
- 인증, logging, retry, cache mutation 등 부가 동작은 함수명이나 호출부에서 보이게 합니다.

### 같은 종류의 함수는 반환 타입 통일하기

- 같은 계층 또는 같은 역할의 hook은 같은 shape를 반환합니다.
- React Query hook은 팀 규칙으로 query 객체를 그대로 반환합니다.
- 검증 함수는 `boolean` 또는 `ValidationResult` 중 하나로 통일하고 혼용하지 않습니다.

권장 result shape:

```ts
type ValidationResult = { ok: true } | { ok: false; reason: string };
```

### 숨은 로직 드러내기

- 함수 이름, 파라미터, 반환 타입에서 예측되지 않는 부수효과를 넣지 않습니다.
- logging, tracking, toast, navigation은 호출 지점 또는 명시적 wrapper로 분리합니다.
- 필요하면 `fetchBalanceWithLogging`처럼 부수효과를 이름으로 노출합니다.

## React 상태와 렌더링 예측 가능성

- 렌더 중 toast, navigation, logging, mutation, storage write 같은 부수효과를 실행하지 않습니다.
- props나 state에서 바로 계산 가능한 값은 `useEffect`와 별도 state로 동기화하지 않습니다.
- props를 state로 복사할 때는 "초기값만 쓰는 uncontrolled 상태"인지, "props 변경을 따라가는 controlled 상태"인지 public API에서 명확히 합니다.
- hook은 조건부로 호출하지 않고, 조건은 hook option이나 내부 guard로 전달합니다.
- list key는 stable id를 사용합니다. 순서가 변할 수 있는 list의 index key와 매 렌더마다 바뀌는 random key는 피합니다.
- `useMemo`와 `useCallback`은 참조 안정성 또는 계산 비용이 실제 요구될 때만 사용하고, 단순 값을 습관적으로 감싸지 않습니다.

## UI Semantics 예측 가능성

디자인시스템, shared UI, 앱 공통 컴포넌트는 이름과 public API만 보고 DOM 의미와 상호작용을 예측할 수 있어야 합니다.

- `role`은 컴포넌트가 해당 keyboard/focus behavior를 실제로 제공할 때만 사용합니다.
- `role="checkbox"`를 쓰면 `aria-checked`, Space key toggle, focus target이 함께 맞아야 합니다.
- toggle button은 상태 전환 command이면 `aria-pressed`, 선택 항목 모델이면 listbox/menu/checkbox 등 더 맞는 semantics를 검토합니다.
- `role="menu"`와 `role="listbox"`는 arrow key navigation, active option, focus management를 소유할 때만 사용합니다.
- navigation은 link semantics를, mutation/action은 button semantics를 사용합니다. 스타일 때문에 link와 button을 바꾸지 않습니다.
- 새 React 19 기준 디자인시스템 컴포넌트는 React 18 호환 요구가 없으면 `forwardRef`보다 `ref` prop 패턴을 우선 검토합니다.
- Storybook/Chromatic wrapper 배경, preview connection loss, Node engine warning은 component behavior finding과 분리합니다.

## 구현 Self-Check

- `get`, `fetch`, `calculate`, `use*` 이름과 실제 부수 효과가 어긋나지 않는가
- 같은 종류의 validator, parser, mapper, API helper가 일관된 반환 타입을 갖는가
- 숨은 logging, storage write, navigation, mutation이 호출부에서 보이지 않게 실행되지 않는가
- 라이브러리나 도메인 개념과 헷갈리는 이름을 쓰지 않는가
- hook return shape이 호출부에서 오해하기 어렵게 고정되어 있는가
- 함수 내부 부수효과가 실패해도 핵심 로직 실패로 전이되지 않게 분리됐는가
- 렌더 중 부수효과, derived state 동기화 effect, props-state 복사가 동작을 예측하기 어렵게 만들지 않는가
- hook 호출 순서, list key 안정성, memoization 사용 이유가 React 동작 규칙과 맞는가
- public props와 실제 DOM semantics, keyboard/focus behavior가 맞는가

## Review Finding 기준

- Critical: 이름/API/semantics와 실제 동작 불일치가 실제 버그, 접근성 결함, API 계약 위반으로 이어진 경우
- Warning: 호출부가 side effect, 반환 shape, DOM behavior를 오해할 가능성이 큰 경우
- Suggestion: 지금 고치면 예측 가능성이 높아지지만 동작 리스크는 낮은 경우
