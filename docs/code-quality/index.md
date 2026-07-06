# Code Quality

이 문서는 DONGCHIMI-CLIENT에서 코드와 문서를 변경할 때의 기본 품질 기준입니다.

## Source Of Truth

- Frontend Fundamentals 상세 기준: [frontend-fundamentals.md](./frontend-fundamentals.md)
- Codex review skill: `.agents/skills/frontend-fundamentals-review/SKILL.md`
- Review recipe: `recipes/frontend-fundamentals-review.md`

## General

- 요구사항은 Jira, Figma, 첨부 이미지, 로컬 문서 중 확인 가능한 근거를 우선합니다.
- 새 app/package 구조는 실제 workspace, script, source of truth 문서를 확인한 뒤 적용합니다.
- 관련 없는 refactor와 metadata churn을 피합니다.
- 새 abstraction은 실제 중복, 책임 경계, 검증 가능성이 있을 때만 추가합니다.
- 민감 정보는 repo에 커밋하지 않습니다.

## Frontend

프론트엔드 코드가 생긴 뒤에는 아래 기준을 적용합니다.

- 가독성: 한 번에 고려해야 하는 맥락을 줄이고, 복잡한 조건과 분기는 이름 또는 구조로 드러냅니다.
- 예측 가능성: 함수, hook, component 이름과 반환 타입만 보고 동작을 예측할 수 있어야 합니다.
- 응집도: 함께 수정되는 파일, 상수, 타입, fixture, API helper는 가능한 한 가까이 둡니다.
- 결합도: 변경 영향 범위를 줄이고, prop drilling, god hook, 과도한 전역 context를 피합니다.
- UI 상태는 loading, empty, error, disabled, selected, invalid를 의도적으로 다룹니다.
- form, API, route, public props가 바뀌면 가까운 spec을 갱신합니다.
- 접근성은 keyboard, focus-visible, accessible name을 최소 기준으로 확인합니다.
- 반응형 레이아웃에서 텍스트 overflow와 클릭 영역을 확인합니다.
- 디자인시스템은 public API와 app wrapper 책임을 분리합니다.

## Tooling

- Prettier 설정은 root `prettier.config.mjs`를 source of truth로 삼습니다.
- ESLint 공통 설정은 `@dongchimi/eslint-config`의 `base`, `react`, `next` export를 사용합니다.
- TypeScript 공통 설정은 `@dongchimi/typescript-config`의 `base`, `nextjs` export를 사용합니다.
- TypeScript `target`은 Node 24 LTS와 Next 16 기준에 맞춰 `ES2022`를 사용합니다.

## Frontend Fundamentals Review

페이지, 컴포넌트, hook/state, API query/mutation, form flow 구현 후에는 [frontend-fundamentals.md](./frontend-fundamentals.md)를 self-check 기준으로 사용합니다.
비자명한 변경, shared/public API 변경, PR 전 품질 점검에는 필요에 따라 `$frontend-fundamentals-review`를 사용합니다.
이 review는 lint/typecheck/build를 대체하지 않습니다. 정적 검증은 실행 가능 여부를 확인하고, 이 review는 변경하기 쉬운 코드인지 판단합니다.

리뷰 결과는 findings-first로 작성합니다.

- Critical: 실제 버그, API 계약 위반, 숨은 부수 효과, 리뷰/검증을 막는 구조
- Warning: 가까운 시점에 유지보수 비용을 키울 가능성이 높은 구조
- Suggestion: 지금 고치면 읽기 쉬워지지만 PR을 막지는 않는 개선

문제가 없으면 "발견된 품질 이슈 없음"이라고 적고, 확인하지 못한 파일이나 런타임 상태를 residual risk로 남깁니다.

## Docs

- `AGENTS.md`는 허브로 유지하고 상세 규칙은 `docs/`, `recipes/`, `templates/`, `.agents/skills/`에 둡니다.
- 문서가 실제 코드나 script를 전제할 때는 해당 파일이 존재하는지 확인합니다.
- 실행한 검증과 실행하지 못한 검증을 분리해서 기록합니다.

## Verification

문서-only 변경:

```bash
git diff --check
```

전체 품질 검증:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

커밋 전에는 Husky가 `pnpm lint-staged`를 실행합니다. 이 검증은 staged 파일 기준의 빠른 가드이며, 전체 검증을 대체하지 않습니다.
