---
name: frontend-coupling-check
description: 프론트엔드 구현 또는 리뷰 중 Toss Frontend Fundamentals의 결합도 기준으로 hook 책임, props drilling, shared/design-system 승격, context, 중복 제거를 점검할 때 사용합니다.
---

# Frontend Coupling Check

## 목적

프론트엔드 구현 또는 리뷰 중 Coupling 기준만 집중해서 확인합니다.

이 skill은 통합 `$frontend-fundamentals-review`의 하위 기준입니다. 단일 기준만 빠르게 점검할 때 사용하고, 기준 간 tradeoff가 보이면 통합 리뷰로 되돌아갑니다.

## 입력 점검

- 작업 모드: 구현 self-check, diff review, 지정 파일 review 중 하나
- 대상 범위: 현재 diff, 특정 page/hook/shared component/design-system component, 특정 PR hunk 중 하나
- 구현 중이면: 책임 분리, props drilling, shared 승격, context 도입, 중복 제거 중 어떤 결정을 내려야 하는지

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/frontend-coupling.md`
- 대상 파일 또는 현재 diff

필요하면 읽습니다.

- `docs/code-quality/frontend-fundamentals.md`
- 가까운 spec, story, fixture
- 호출부와 usage site
- `docs/architecture/app-structure.md`
- `docs/architecture/design-system-components.md`

## 메인 작업 흐름

1. 구현 중이면 변경 영향 범위와 확인해야 할 호출부를 먼저 열거합니다.
2. 리뷰면 변경 hunk와 usage site를 함께 확인합니다.
3. 하나의 hook이 page state, query param, mutation, UI flag를 과하게 묶지 않았는지 확인합니다.
4. props drilling, context 남용, shared util 승격, design-system 승격이 실제로 결합을 줄이는지 확인합니다.
5. 중복 제거가 여러 화면을 함께 깨뜨리는 공통 결합을 만들지 않는지 확인합니다.
6. 구현 중이면 책임 분리나 중복 허용 방향을 제안하거나 적용합니다.
7. 리뷰면 파일/라인 근거가 있는 finding만 작성합니다.

## 출력 형식

구현 self-check:

```markdown
Coupling self-check:
- 확인:
- 조정:
- 남은 tradeoff:
```

리뷰:

```markdown
## Frontend Coupling Check

### Findings

- 없음

Residual risk:
- 확인하지 못한 범위와 이유
```

## 완료 기준

- `docs/code-quality/frontend-coupling.md` 기준을 확인했습니다.
- 구현 중이면 변경 영향 범위, 책임 분리, shared/design-system boundary, context/props 전달을 점검했습니다.
- 리뷰면 finding에 파일/라인 근거가 있습니다.
- 기준 밖 취향 문제를 finding으로 만들지 않았습니다.
- tradeoff가 보이면 `$frontend-fundamentals-review`로 통합 판단이 필요하다고 표시했습니다.

## 예외

- formatting-only 변경은 formatter 검증으로 충분하면 생략합니다.
- 변경 영향 범위가 바뀌지 않는 단순 copy 변경에는 강제하지 않습니다.
