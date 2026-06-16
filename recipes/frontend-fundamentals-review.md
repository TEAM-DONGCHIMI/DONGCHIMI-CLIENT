# Recipe: Frontend Fundamentals Review

Toss Frontend Fundamentals 기준으로 프론트엔드 diff 또는 지정 파일을 리뷰하는 절차입니다.

## Source

- Frontend Fundamentals: https://frontend-fundamentals.com/code-quality/code/
- Claude Code plugin: https://github.com/toss/frontend-fundamentals/tree/main/frontend-fundamentals-plugin
- Repo 기준 문서: `docs/code-quality/frontend-fundamentals.md`
- Codex skill: `.agents/skills/frontend-fundamentals-review/SKILL.md`

Codex skill은 사이트를 자동으로 fetch하지 않습니다. 사이트의 실전 가이드 항목은 `docs/code-quality/frontend-fundamentals.md`에 반영된 내용만 리뷰 기준으로 사용됩니다.

## When To Use

- 구현 직후 코드 품질을 점검할 때
- PR 전 lint/typecheck/build와 별개로 유지보수성을 검토할 때
- 코드 리뷰 요청을 받았고 프론트엔드 변경이 포함되어 있을 때
- 반복 개선을 요청받았고 quality finding을 먼저 줄여야 할 때

## Steps

1. 리뷰 범위를 정합니다.

```bash
git status --short
git diff --name-only
```

2. 지정 파일이 있으면 지정 파일만, 없으면 현재 diff를 기준으로 봅니다.

3. 네 가지 기준으로 확인합니다.

자세한 판단 기준은 `docs/code-quality/frontend-fundamentals.md`를 따릅니다.

- Readability: 맥락이 적고 위에서 아래로 읽히는가
- Predictability: 이름, 인자, 반환 타입으로 동작을 예측할 수 있는가
- Cohesion: 함께 수정되는 코드가 가까이 있는가
- Coupling: 변경 영향 범위가 작고 불필요한 연결이 없는가

4. findings-first로 정리합니다.

```markdown
## Frontend Fundamentals Review

### Critical

- 없음

### Warnings

- **Readability** `path/to/file.tsx:L10` - 문제
  - Fix: 제안

### Suggestions

- 없음

Residual risk:
- 확인하지 못한 범위
```

5. 사용자가 수정을 요청하면 finding 단위로 고칩니다.

## Notes

- lint/typecheck/build 결과와 code quality review를 섞지 않습니다.
- 기준 밖 취향 문제를 finding으로 만들지 않습니다.
- 파일/라인 근거가 없으면 finding으로 쓰지 않습니다.
