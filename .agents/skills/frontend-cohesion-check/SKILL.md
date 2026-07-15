---
name: frontend-cohesion-check
description: 프론트엔드 구현 또는 리뷰 중 Toss Frontend Fundamentals의 응집도 기준으로 함께 수정되는 component, hook, type, fixture, spec, form 흐름 배치를 점검할 때 사용합니다.
---

# Frontend Cohesion Check

## 목적

프론트엔드 구현 또는 리뷰 중 Cohesion 기준만 집중해서 확인합니다.

이 skill은 통합 `$frontend-fundamentals-review`의 하위 기준입니다. 단일 기준만 빠르게 점검할 때 사용하고, 기준 간 tradeoff가 보이면 통합 리뷰로 되돌아갑니다.

## 입력 점검

- 작업 모드: 구현 self-check, diff review, 지정 파일 review 중 하나
- 대상 범위: 현재 diff, 특정 feature 폴더, 특정 form/API/page/component, 특정 PR hunk 중 하나
- 구현 중이면: 함께 바뀌는 파일, 상수, 타입, fixture, spec, validation, payload가 무엇인지

리뷰 대상이 없으면 먼저 현재 변경 범위를 확인합니다.

```bash
git status --short
git diff --name-only
```

## 읽기 전략

항상 읽습니다.

- `docs/code-quality/frontend-cohesion.md`
- 대상 파일 또는 현재 diff

필요하면 읽습니다.

- `docs/code-quality/frontend-fundamentals.md`
- 가까운 spec, story, fixture
- 같은 feature의 component, hook, type, API helper, form schema
- `docs/architecture/repo-structure.md`

## 메인 작업 흐름

1. 구현 중이면 변경 단위가 feature, field, form, API, page 중 어디인지 먼저 정합니다.
2. 리뷰면 변경 hunk와 같은 feature 경계의 주변 파일을 확인합니다.
3. component, hook, type, API helper, fixture, spec이 함께 수정되기 쉬운 위치에 있는지 확인합니다.
4. magic number, option 값, validation copy, submit payload가 분산되어 있지 않은지 확인합니다.
5. form은 field 단위 응집과 form 전체 응집 중 어떤 구조가 맞는지 확인합니다.
6. 구현 중이면 코드 배치나 spec 기록 방향을 제안하거나 적용합니다.
7. 리뷰면 파일/라인 근거가 있는 finding만 작성합니다.

## 출력 형식

구현 self-check:

```markdown
Cohesion self-check:
- 확인:
- 조정:
- 남은 tradeoff:
```

리뷰:

```markdown
## Frontend Cohesion Check

### Findings

- 없음

Residual risk:
- 확인하지 못한 범위와 이유
```

## 완료 기준

- `docs/code-quality/frontend-cohesion.md` 기준을 확인했습니다.
- 구현 중이면 함께 수정되는 파일과 값의 위치를 점검했습니다.
- 리뷰면 finding에 파일/라인 근거가 있습니다.
- 기준 밖 취향 문제를 finding으로 만들지 않았습니다.
- tradeoff가 보이면 `$frontend-fundamentals-review`로 통합 판단이 필요하다고 표시했습니다.

## 예외

- formatting-only 변경은 formatter 검증으로 충분하면 생략합니다.
- 변경 단위나 파일 배치가 바뀌지 않는 단순 copy 변경에는 강제하지 않습니다.
