---
name: verify-design-system-styles
description: @dongchimi/design-system/styles public boundary, vanilla-extract style helper, recipe utility 문서를 검증할 때 사용합니다.
---

# 디자인시스템 스타일 검증

## 목적

디자인시스템 style helper와 vanilla-extract authoring 경계가 흐려지는 것을 막습니다.

- `packages/design-system/src/styles`의 public boundary를 확인합니다.
- `./styles` export가 필요한 변경인지 확인합니다.
- `cn`, recipe helper, type helper를 추가한 경우 사용 예시와 타입 의도를 문서화했는지 확인합니다.
- token/theme contract가 확정되기 전에 임의 palette나 semantic token을 만들지 않았는지 확인합니다.

## 입력 점검

```bash
git diff --name-only HEAD -- packages/design-system/src/styles packages/design-system/package.json pnpm-workspace.yaml docs/architecture/styling-and-design-tokens.md
```

스타일 helper 변경이 없으면 `SKIP`으로 보고합니다.

## 읽기 전략

1. `docs/architecture/styling-and-design-tokens.md`를 읽습니다.
2. `packages/design-system/src/styles/README.md`를 읽습니다.
3. `packages/design-system/package.json`의 exports와 dependency를 확인합니다.
4. helper를 추가한 경우 근처 spec 또는 README 예시를 확인합니다.

## Workflow

### Step 1: 적용 대상 확인

`packages/design-system/src/styles/index.ts` 또는 style helper 파일이 생긴 경우 public style boundary 검증을 실행합니다.

```bash
test -f packages/design-system/src/styles/index.ts && echo "styles public entry exists" || echo "SKIP: no public styles entry"
```

### Step 2: package export 확인

public entry가 있으면 `packages/design-system/package.json`에 `./styles` export가 있어야 합니다.

```bash
node -e 'const p=require("./packages/design-system/package.json"); if (require("fs").existsSync("packages/design-system/src/styles/index.ts") && !p.exports?.["./styles"]) { console.error("missing ./styles export"); process.exit(1) }'
```

### Step 3: dependency와 책임 경계 확인

- recipe helper가 `@vanilla-extract/recipes`를 사용하면 workspace dependency가 선언되어야 합니다.
- `cn`은 className composition helper로 설명되어야 하며, component style policy로 과장하지 않습니다.
- color, typography, spacing token 또는 theme contract가 새로 생기면 별도 Jira/문서 근거가 있어야 합니다.

### Step 4: 문서/예시 확인

- `packages/design-system/src/styles/README.md`에 public helper 사용 예시가 있는지 확인합니다.
- type helper가 있으면 왜 export되는지 README 또는 spec에 적혀 있는지 확인합니다.
- consumer app이 import할 path는 `@dongchimi/design-system/styles`처럼 subpath 기준으로 설명합니다.

### Step 5: 검증 명령

```bash
pnpm --filter @dongchimi/design-system lint
pnpm --filter @dongchimi/design-system typecheck
pnpm --filter @dongchimi/design-system build
```

## 완료 기준

- style helper가 없으면 `SKIP`입니다.
- public entry가 있으면 package export, docs, typecheck/build가 일치합니다.
- token/theme contract는 확정된 문서나 Jira 없이 추가되지 않습니다.

## 예외

- `layers.css.ts` 같은 package-local scaffold만 있는 경우 `./styles` export를 강제하지 않습니다.
- app bundler plugin 설정은 해당 app 변경이 있을 때만 확인합니다.
- design-system component 자체 구현은 `design-system-component-workflow` 또는 별도 verify 대상입니다.
