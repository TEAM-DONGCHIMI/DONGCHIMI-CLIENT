---
name: frontend-readability-check
description: 프론트엔드 구현 또는 리뷰 중 Toss Frontend Fundamentals의 가독성 기준으로 맥락, 이름, 조건부 렌더링, JSX 흐름을 점검할 때 사용합니다.
---

# Frontend Readability Check

## 목적

프론트엔드 구현 또는 리뷰 중 Readability 기준만 집중해서 확인합니다.

이 skill은 통합 `$frontend-fundamentals-review`의 하위 기준입니다. 단일 기준만 빠르게 점검할 때 사용하고, 기준 간 tradeoff가 보이면 통합 리뷰로 되돌아갑니다.

## 입력 점검

- 작업 모드: 구현 self-check, diff review, 지정 파일 review 중 하나
- 대상 범위: 현재 diff, 특정 파일, 특정 컴포넌트/hook, 특정 PR hunk 중 하나
- 구현 중이면: 지금 결정해야 하는 분기, 추상화, 조건부 렌더링, 이름 붙이기 지점

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/frontend-readability.md`
- 대상 파일 또는 현재 diff

필요하면 읽습니다.

- `docs/code-quality/frontend-fundamentals.md`
- 가까운 spec, story, fixture
- 대상 컴포넌트가 사용하는 hook 또는 child component

## 메인 작업 흐름

1. 구현 중이면 대상 코드의 사용자 흐름과 분기 수를 먼저 확인합니다.
2. 리뷰면 변경 hunk와 직접 의존 코드부터 읽습니다.
3. 동시에 실행되지 않는 분기, 중첩 삼항, JSX 내부 IIFE/switch/중첩 return, 복잡한 boolean 조건을 확인합니다.
4. 의미 있는 이름을 붙여야 할 조건, magic number, 표시 규칙을 찾습니다.
5. 추상화가 호출부를 실제로 쉽게 읽게 만드는지 확인합니다.
6. 구현 중이면 코드 변경 방향을 제안하거나 적용합니다.
7. 리뷰면 파일/라인 근거가 있는 finding만 작성합니다.

## 출력 형식

구현 self-check:

```markdown
Readability self-check:
- 확인:
- 조정:
- 남은 tradeoff:
```

리뷰:

```markdown
## Frontend Readability Check

### Findings

- 없음

Residual risk:
- 확인하지 못한 범위와 이유
```

## 완료 기준

- `docs/code-quality/frontend-readability.md` 기준을 확인했습니다.
- 구현 중이면 분기, 조건, JSX 흐름, 추상화 위치를 점검했습니다.
- 리뷰면 finding에 파일/라인 근거가 있습니다.
- 기준 밖 취향 문제를 finding으로 만들지 않았습니다.
- tradeoff가 보이면 `$frontend-fundamentals-review`로 통합 판단이 필요하다고 표시했습니다.

## 예외

- formatting-only 변경은 formatter 검증으로 충분하면 생략합니다.
- 한 줄 copy 변경처럼 조건/흐름/맥락이 바뀌지 않는 변경에는 강제하지 않습니다.
