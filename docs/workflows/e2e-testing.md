# E2E Testing

DONGCHIMI-CLIENT의 E2E 테스트는 Playwright를 기준으로 운영합니다. 초기 목표는 제품 상세 시나리오 검증이 아니라 두 앱이 지정 포트에서 부팅되고 root route가 실제 브라우저에서 렌더링되는지 확인하는 smoke test입니다.

## Structure

E2E 실행 정책과 CI는 root에 둡니다. 앱별 테스트 파일은 owning app 가까이에 둡니다.

```text
playwright.config.ts
.github/workflows/e2e.yml
apps/client/e2e/*.spec.ts
apps/market-owner/e2e/*.spec.ts
```

공통 helper는 v1에서 만들지 않습니다. 두 앱 이상에서 실제 중복이 생기면 `e2e/support` 또는 `tests/e2e/support` 같은 root helper를 별도 이슈로 검토합니다.

## Decision

Playwright config는 root에 둡니다. 여러 앱을 하나의 test harness에서 실행해야 하고, app별 browser project, web server, report, CI artifact 기준을 한 곳에서 관리하는 편이 모노레포 운영에 맞기 때문입니다.

Spec은 각 app 아래에 둡니다. 테스트가 검증하는 화면과 가까운 위치에 있어야 app 변경 시 owner가 함께 갱신하기 쉽고, app별 route와 smoke 기준이 섞이지 않습니다.

Package는 만들지 않습니다. 현재 E2E는 재사용 런타임 라이브러리가 아니라 repo test harness입니다. 실제 helper 중복이 생기기 전까지는 shared package로 승격하지 않습니다.

## App Ports

로컬 E2E는 앱별 고정 포트를 사용합니다. 자동 fallback은 사용하지 않습니다.

| App                 | Port   | Base URL                | Spec path                         |
| ------------------- | ------ | ----------------------- | --------------------------------- |
| `apps/client`       | `3000` | `http://127.0.0.1:3000` | `apps/client/e2e/*.spec.ts`       |
| `apps/market-owner` | `5173` | `http://127.0.0.1:5173` | `apps/market-owner/e2e/*.spec.ts` |

`apps/market-owner`는 Vite `strictPort: true`로 fallback을 차단합니다. `apps/client`도 Playwright `webServer`가 `3000`을 기다리므로 다른 포트로 뜨면 테스트는 실패해야 합니다.

## Commands

로컬 browser dependency 설치:

```bash
pnpm e2e:install
```

PR smoke와 같은 Chromium 테스트:

```bash
pnpm e2e:smoke
```

전체 browser project 실행:

```bash
pnpm e2e
```

디버깅 UI:

```bash
pnpm e2e:ui
```

HTML report 확인:

```bash
pnpm e2e:report
```

## CI

E2E workflow는 `.github/workflows/e2e.yml`에서 실행합니다.

`pull_request`에서는 Chromium smoke만 실행합니다. 초기 단계의 목적은 모든 브라우저 호환성 검증보다 app bootstrap 회귀를 빠르게 잡는 것입니다.

`workflow_dispatch`에서는 전체 Playwright project를 실행합니다. Chromium, Firefox, WebKit까지 확인해야 하는 변경은 수동 workflow로 실행합니다.

실패하면 `playwright-report`와 `test-results`를 artifact로 업로드합니다. branch protection에서 필수 check로 둘지는 GitHub repository 설정에서 별도로 결정합니다.

## Writing Tests

테스트는 사용자 관점의 locator를 우선 사용합니다.

좋은 우선순위:

```text
getByRole
getByLabel
getByText
getByTestId
CSS selector
```

`data-testid`는 접근 가능한 이름이나 role로 안정적으로 찾기 어려운 경우에만 추가합니다. 이 경우 테스트 편의만을 위해 production 의미를 흐리지 않아야 합니다.

초기 smoke test는 root route가 열리고 핵심 heading/text가 보이는지만 확인합니다. 인증, API seeding, MSW, screenshot snapshot, visual regression은 이번 범위에 포함하지 않습니다.

## Flaky Test Policy

flaky test는 retry를 늘려 덮지 않습니다. 먼저 원인을 분류합니다.

네트워크 또는 server startup 문제이면 `webServer` timeout과 app dev script를 확인합니다.

selector 문제이면 role, label, text 기준으로 다시 작성합니다.

비동기 UI 문제이면 Playwright auto-waiting과 `expect` assertion을 우선 사용하고, 임의 sleep은 사용하지 않습니다.

제품 시나리오가 아직 안정되지 않았다면 해당 테스트는 PR blocking smoke에 넣지 않고 manual workflow 또는 후속 이슈로 분리합니다.
