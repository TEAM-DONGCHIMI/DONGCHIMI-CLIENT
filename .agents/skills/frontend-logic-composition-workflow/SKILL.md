---
name: frontend-logic-composition-workflow
description: 컴포넌트 내부 로직, custom hook 추출, orchestration hook, 공통 hook 승격 기준을 판단하고 구현 self-check에 적용할 때 사용합니다.
---

# Frontend Logic Composition Workflow

## 목적

컴포넌트 내부 로직과 custom hook 구조를 설계하거나 리팩터링할 때 책임, 응집도, 결합도, 예측 가능성을 기준으로 추출 단위를 결정합니다.

이 skill은 "컴포넌트를 얇게 만들기"가 아니라 "변경하기 쉬운 책임 구조 만들기"를 목표로 합니다.

## 입력 점검

- 대상: component, page/section, custom hook, form/API flow 중 하나
- 현재 문제: 컴포넌트 내부 로직 과밀, god hook, hook import 과다, premature shared hook, context 남용 중 하나
- 변경 목적: 구현 중 구조 결정, 리팩터링 판단, 리뷰 finding 수정, 공통 hook 승격 판단 중 하나
- 검증 근거: 가까운 spec, story, test, route, hook usage site

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/frontend-logic-composition.md`
- 대상 component 또는 hook

필요하면 읽습니다.

- `docs/code-quality/frontend-fundamentals.md`
- `docs/code-quality/frontend-readability.md`
- `docs/code-quality/frontend-predictability.md`
- `docs/code-quality/frontend-cohesion.md`
- `docs/code-quality/frontend-coupling.md`
- 가까운 spec, story, fixture, test
- hook usage site와 직접 호출부
- `docs/architecture/app-structure.md`
- `docs/architecture/repo-structure.md`

## 메인 작업 흐름

1. 현재 로직을 responsibility 단위로 분류합니다.
   - render-only derived value
   - event handler
   - validation
   - query param
   - API query/mutation
   - payload mapping
   - modal/overlay
   - navigation/toast/analytics
   - selection/pagination/filtering
2. 각 로직을 어디에 둘지 결정합니다.
   - 컴포넌트에 남김
   - 순수 함수로 분리
   - 단일 책임 hook으로 추출
   - orchestration hook에서 조합
   - 공통 hook으로 승격
3. 추출 후보가 하나의 책임과 변경 이유를 갖는지 확인합니다.
4. orchestration hook이 필요하면 하위 hook 조합 중심인지 확인합니다.
5. 공통 hook 승격이 필요하면 사용처 수보다 변경 이유 동일성을 확인합니다.
6. return shape이 호출부에서 예측 가능한지 확인합니다.
7. 변경 후 검증 포인트를 정합니다.

## 판단 기준

- 컴포넌트에 남김: JSX 한 곳에서만 쓰는 짧은 표시 조건, local handler, 단순 derived value
- 순수 함수: React state/lifecycle 없이 계산 가능한 mapping, formatting, validation, grouping
- 단일 책임 hook: 상태 전이, side effect, API lifecycle, form field, selection처럼 책임 이름이 붙는 단위
- orchestration hook: 여러 단일 책임 hook을 조합해 page/section view model과 action을 만드는 단위
- 공통 hook: 여러 사용처가 같은 이유로 동일하게 변하고, copy/route/API/logging 정책도 동일한 단위

## 완료 기준

- 컴포넌트 내부 로직과 hook 책임이 분류됐습니다.
- 추출 단위가 줄 수가 아니라 책임과 변경 이유 기준으로 정해졌습니다.
- god hook 또는 premature shared hook이 생기지 않았습니다.
- orchestration hook이 세부 로직 구현보다 하위 hook 조합을 담당합니다.
- return shape과 side effect 위치를 호출부가 예측할 수 있습니다.
- 필요한 spec, story, test, 검증 포인트가 갱신됐습니다.

## 출력 형식

```markdown
## Logic Composition Check

- 대상:
- 현재 책임:
- 권장 배치:
- 추출 후보:
- orchestration 필요 여부:
- 공통 hook 승격 여부:
- 검증 포인트:
- 남은 tradeoff:
```

## 예외

- 한 줄 조건이나 짧은 handler를 단지 분리 가능하다는 이유로 hook으로 추출하지 않습니다.
- 사용처가 하나인 hook도 page/section 흐름을 선명하게 만들면 허용합니다.
- 사용처가 여러 개인 hook도 변경 이유가 다르면 공통화하지 않습니다.
