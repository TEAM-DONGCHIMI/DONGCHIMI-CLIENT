# Local Development

현재 DONGCHIMI-CLIENT는 package manager와 app script가 확정되지 않았습니다. 이 문서는 확정 전후의 검증 기준을 나눠 기록합니다.

## Current Minimum

문서-only 변경:

```bash
git diff --check
```

문서 링크와 agent skill 구조를 바꾼 경우:

```bash
rg -n "docs/agent|\\.agents|templates/|recipes/" AGENTS.md README.md docs recipes templates
find .agents/skills -maxdepth 3 -name SKILL.md -print
git diff --check
```

## After Package Setup

package script가 생기면 아래 목적의 검증을 추가합니다.

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

실제 package manager가 npm이 아니면 명령을 해당 도구로 바꾸고, `docs/conventions/package-management.md`와 `.agents/skills/frontend-quality-verification/SKILL.md`를 함께 갱신합니다.

## Targeted Verification

workspace 구조가 생기면 변경 위치 기준으로 targeted 검증을 우선합니다.

```text
apps/client/** -> client lint/typecheck/build
apps/design-system-web/** -> design-system web lint/typecheck/build
apps/admin/** -> admin lint/typecheck/build, 앱이 생성된 뒤 적용
apps/mobile/** -> web check와 별도 mobile command
packages/design-system/** -> design-system lint/typecheck/build/storybook
packages/shared/** -> 소비 app build 필요 여부 확인
docs/**, recipes/**, templates/** -> git diff --check + format check
```

## Verification Log Rule

최종 요약 또는 PR에는 실제 실행한 명령만 적습니다.
실행하지 못한 검증은 이유와 남은 리스크를 별도 항목으로 남깁니다.
