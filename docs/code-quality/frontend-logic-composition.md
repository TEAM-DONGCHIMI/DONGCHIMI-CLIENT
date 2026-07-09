# Frontend Logic Composition

이 문서는 컴포넌트 내부 로직, custom hook 추출, orchestration hook, 공통 hook 승격을 판단하는 DONGCHIMI-CLIENT repo-local 기준입니다.

Frontend Fundamentals의 Readability, Predictability, Cohesion, Coupling 기준을 실제 구현 중 component와 hook 구조에 적용하기 위한 보조 기준입니다.

## 목적

컴포넌트나 hook이 길다는 이유만으로 코드를 옮기지 않습니다.
추출의 목적은 줄 수를 줄이는 것이 아니라 책임, 변경 단위, side effect 위치, 호출부 예측 가능성을 명확하게 만드는 것입니다.

## 적용 시점

- 컴포넌트 내부에 form, query param, mutation, modal, navigation, toast, analytics 흐름이 함께 섞일 때
- custom hook으로 뺐지만 여러 복잡한 흐름이 하나의 hook에 결합될 때
- page 또는 section에서 소비하는 hook import가 많아져 흐름 파악이 어려울 때
- 공통 hook으로 승격할지 page-local/domain-local hook으로 둘지 판단할 때
- 리팩터링 리뷰에서 "컴포넌트를 얇게 만들었지만 복잡도가 hook으로 이동한 것"인지 확인할 때

## 기본 원칙

- 컴포넌트는 화면 구조와 사용자 흐름이 먼저 읽혀야 합니다.
- custom hook은 하나의 책임과 변경 이유를 가져야 합니다.
- orchestration hook은 여러 작은 hook을 조합하는 계층이지, 복잡한 세부 로직을 새로 품는 장소가 아닙니다.
- 공통 hook 승격은 사용처 수가 아니라 변경 이유가 동일한지로 판단합니다.
- 추상화는 호출부와 변경 범위를 더 예측 가능하게 만들 때만 둡니다.

## 컴포넌트에 남겨도 되는 로직

아래 로직은 컴포넌트 안에 남겨도 됩니다.

- JSX 바로 위에서 읽히는 단순 표시 조건
- 해당 JSX 한 곳에서만 쓰는 짧은 derived value
- UI 구조 이해를 돕는 local event handler
- props를 화면 copy나 design-system props로 단순 연결하는 mapping
- 조건과 결과가 한 화면 안에서 바로 읽히는 loading, empty, error 분기

남겨도 되는 로직이라도 JSX 내부에 중첩 삼항, IIFE, switch, 긴 boolean expression으로 들어가면 `frontend-readability.md` 기준으로 정리합니다.

## 순수 함수로 분리할 로직

React state나 lifecycle이 필요 없는 계산은 hook보다 순수 함수를 먼저 검토합니다.

- payload mapping
- sort, group, filter, aggregate
- display label formatting
- validation rule 중 외부 상태가 필요 없는 부분
- 상태 enum 또는 option 변환

순수 함수는 hook보다 테스트와 재사용 비용이 낮습니다. `use*` 이름은 React hook 규칙과 side effect 기대를 만들기 때문에, React 기능이 없으면 hook으로 만들지 않습니다.

## 단일 책임 Hook으로 추출할 로직

아래 조건이면 단일 책임 custom hook 추출을 검토합니다.

- 상태 전이 규칙이 2개 이상입니다.
- validation, query param, mutation, modal, selection, pagination처럼 책임 이름을 붙일 수 있습니다.
- 같은 책임을 사용하는 컴포넌트가 여러 상태나 action을 함께 필요로 합니다.
- 테스트하거나 별도 fixture로 검증할 도메인 규칙이 있습니다.
- side effect 위치를 컴포넌트 렌더링과 분리해야 합니다.

좋은 단일 책임 hook은 이름만 보고 책임을 예측할 수 있어야 합니다.

```text
useProductSelection
useSalePeriodValidation
useEventDiscountMutation
useFileUploadState
```

## Orchestration Hook으로 추출할 로직

아래 조건이면 orchestration hook을 검토합니다.

- page 또는 section에서 여러 단일 책임 hook을 import하고, 조합 흐름 때문에 화면 구조가 읽히지 않습니다.
- submit, next step, disabled state처럼 여러 hook 결과를 조합한 page-level action이 필요합니다.
- 같은 page/section 흐름을 story, test, fixture에서 독립적으로 다뤄야 합니다.
- 사용처가 하나여도 page-level flow 이름을 붙이면 변경 단위가 명확해집니다.

orchestration hook은 아래처럼 동작해야 합니다.

- 하위 hook을 조합합니다.
- page/section이 소비할 view model과 action을 만듭니다.
- side effect 순서를 명시적으로 조율합니다.
- 세부 validation, payload mapping, API mutation 내부 로직을 직접 품지 않습니다.

나쁜 orchestration hook은 컴포넌트의 복잡도를 그대로 옮긴 `god hook`입니다.

```text
useEventDiscountRegistrationFlow
  - OK: useEventDiscountForm, useFileUploadState, useEventDiscountMutation을 조합
  - BAD: form schema, file parsing, mutation, toast, navigation, modal, analytics를 모두 직접 구현
```

## 공통 Hook으로 승격할 기준

사용처가 둘 이상이라는 이유만으로 공통 hook으로 올리지 않습니다.

공통 hook 승격 전 확인합니다.

- 변경 이유가 사용처마다 동일한가
- copy, route, API, logging, analytics, 후속 동작이 동일한가
- 호출부가 늘어나도 public API를 예측하기 쉬운가
- 공통 hook 수정 후 확인해야 할 화면을 빠르게 열거할 수 있는가
- app-specific 정책이 shared 또는 package 경계로 새지 않는가

사용처마다 정책이 달라질 가능성이 있으면 중복을 허용해 결합을 끊습니다.

## Import 수와 Orchestration 판단

컴포넌트가 여러 hook을 import하는 것 자체는 문제가 아닙니다.

- hook 1~3개를 직접 소비해도 화면 흐름이 잘 읽히면 그대로 둡니다.
- import 수가 많아도 hook들이 화면 구조와 1:1로 대응하면 그대로 둘 수 있습니다.
- 여러 hook 결과를 서로 엮는 glue code가 길어지면 orchestration hook을 검토합니다.
- 같은 조합이 여러 컴포넌트에 반복되면 orchestration 또는 공통 hook 승격을 검토합니다.

import 수가 아니라 조합 로직의 변경 이유와 읽기 비용이 판단 기준입니다.

## Return Shape 기준

hook return shape은 사용처가 오해하기 어렵게 고정합니다.

- 같은 종류의 hook은 같은 반환 패턴을 사용합니다.
- React Query wrapper는 팀 규칙에 따라 query 객체를 그대로 반환합니다.
- orchestration hook은 page/section이 바로 소비할 view model과 action 중심으로 반환합니다.
- 너무 많은 값을 납작하게 반환하면 grouping을 검토합니다.

권장 형태:

```ts
type RegistrationFlow = {
  form: FormState;
  file: FileUploadState;
  submit: {
    disabled: boolean;
    isPending: boolean;
    action: () => void;
  };
};
```

## Anti-Patterns

- 컴포넌트가 길다는 이유만으로 모든 로직을 `usePageSomething` 하나로 옮깁니다.
- 하나의 hook이 query param, form, mutation, modal, toast, navigation, analytics를 모두 직접 관리합니다.
- hook 이름은 `useValidation`인데 내부에서 mutation이나 navigation을 실행합니다.
- orchestration hook이 하위 hook 조합 대신 세부 로직을 직접 구현합니다.
- 공통 hook이 app-specific copy, route, API 정책을 알고 있습니다.
- 순수 함수로 충분한 계산을 hook으로 만들어 React 의존을 만듭니다.
- 호출부를 줄이려고 context를 도입했지만 실제 전역 관심사가 아닙니다.

## Self-Check

- 컴포넌트가 화면 구조보다 상태/side effect 흐름을 먼저 읽게 만들지 않는가
- 추출한 hook이 하나의 책임과 변경 이유를 갖는가
- hook 이름과 return shape만 보고 side effect를 예측할 수 있는가
- 세부 로직은 단일 책임 hook 또는 순수 함수에 있고, orchestration hook은 조합만 담당하는가
- 공통 hook 승격이 사용처의 변경 이유까지 동일해서 정당화되는가
- hook import 수가 아니라 조합 로직의 읽기 비용을 기준으로 판단했는가
- props drilling, context, shared hook 승격 중 composition으로 해결 가능한 부분은 없는가
- 추출 후 테스트 또는 검증 포인트가 더 선명해졌는가

## 관련 기준

- [Readability](./frontend-readability.md): 컴포넌트와 hook 호출부가 적은 맥락으로 읽히는지 확인합니다.
- [Predictability](./frontend-predictability.md): hook 이름, return shape, side effect가 호출부에서 예측 가능한지 확인합니다.
- [Cohesion](./frontend-cohesion.md): 함께 수정되는 form, validation, payload, fixture, spec이 같은 변경 단위에 있는지 확인합니다.
- [Coupling](./frontend-coupling.md): 공통 hook, context, orchestration hook이 변경 영향 범위를 줄이는지 확인합니다.
