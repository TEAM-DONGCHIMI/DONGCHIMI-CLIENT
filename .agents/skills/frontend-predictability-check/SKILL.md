---
name: frontend-predictability-check
description: 프론트엔드 구현 또는 리뷰 중 Toss Frontend Fundamentals의 예측 가능성 기준으로 이름, 반환 타입, side effect, React 상태, UI semantics를 점검할 때 사용합니다.
---

# Frontend Predictability Check

## 목적

프론트엔드 구현 또는 리뷰 중 Predictability 기준만 집중해서 확인합니다.

이 skill은 통합 `$frontend-fundamentals-review`의 하위 기준입니다. 단일 기준만 빠르게 점검할 때 사용하고, 기준 간 tradeoff가 보이면 통합 리뷰로 되돌아갑니다.

## 입력 점검

- 작업 모드: 구현 self-check, diff review, 지정 파일 review 중 하나
- 대상 범위: 현재 diff, 특정 파일, 특정 컴포넌트/hook/API helper, 특정 PR hunk 중 하나
- 구현 중이면: 이름, 반환 shape, side effect, DOM semantics, React 상태 설계 중 어떤 결정을 내려야 하는지

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/frontend-predictability.md`
- 대상 파일 또는 현재 diff

필요하면 읽습니다.

- `docs/code-quality/frontend-fundamentals.md`
- 가까운 spec, story, fixture
- 대상 hook/API helper의 usage site
- 디자인시스템 또는 shared UI public API 문서

## 메인 작업 흐름

1. 구현 중이면 public API, 함수명, hook return shape, DOM semantics를 먼저 정리합니다.
2. 리뷰면 변경 hunk와 usage site를 함께 확인합니다.
3. 이름과 실제 동작, 반환 타입, side effect가 어긋나지 않는지 확인합니다.
4. 렌더 중 side effect, derived state effect, props-state 복사, 조건부 hook 호출, unstable key, 불필요한 memoization을 확인합니다.
5. shared/design-system UI는 role, aria state, keyboard/focus behavior가 public API와 맞는지 확인합니다.
6. 구현 중이면 코드 변경 방향을 제안하거나 적용합니다.
7. 리뷰면 파일/라인 근거가 있는 finding만 작성합니다.

## 출력 형식

구현 self-check:

```markdown
Predictability self-check:
- 확인:
- 조정:
- 남은 tradeoff:
```

리뷰:

```markdown
## Frontend Predictability Check

### Findings

- 없음

Residual risk:
- 확인하지 못한 범위와 이유
```

## 완료 기준

- `docs/code-quality/frontend-predictability.md` 기준을 확인했습니다.
- 구현 중이면 이름, 반환 shape, side effect, React 상태, UI semantics를 점검했습니다.
- 리뷰면 finding에 파일/라인 근거가 있습니다.
- 기준 밖 취향 문제를 finding으로 만들지 않았습니다.
- tradeoff가 보이면 `$frontend-fundamentals-review`로 통합 판단이 필요하다고 표시했습니다.

## 예외

- formatting-only 변경은 formatter 검증으로 충분하면 생략합니다.
- DOM behavior, public API, side effect가 바뀌지 않는 단순 copy 변경에는 강제하지 않습니다.
