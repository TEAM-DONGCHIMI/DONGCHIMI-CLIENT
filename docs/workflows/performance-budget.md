# Performance Budget

DONGCHIMI-CLIENT는 Lighthouse CI로 앱별 초기 성능 예산을 수집하고 PR에서 성능 변화가 보이도록 관리합니다.

## Source Of Truth

- Jira: [DCMFE-32](https://dongchimi.atlassian.net/browse/DCMFE-32)
- Lighthouse CI config: `lighthouserc.cjs`
- Workflow file: `.github/workflows/performance.yml`
- Local server helper: `scripts/performance/serve-apps.mjs`

## Why Lighthouse CI

성능 예산은 번들 크기만 보는 작업이 아니라 실제 페이지 로딩에서 어떤 리소스가 얼마나 쓰였고, LCP, FCP, CLS, TBT 같은 사용자 체감 지표가 어떻게 변했는지를 함께 봐야 합니다.
Lighthouse CI는 Chrome 기반으로 페이지를 수집하고, metric assertion과 resource budget을 같은 흐름에서 확인할 수 있으며, GitHub Actions artifact로 HTML report를 남길 수 있습니다.
초기 세팅 단계에서는 제품 기능이 아직 작고 측정 노이즈도 크기 때문에 PR을 즉시 막는 hard budget보다 warning budget으로 기준선을 만들고 추이를 관찰합니다.
현재 예산 기준은 `lighthouserc.cjs`의 `assert.assertions`에 둡니다.
Lighthouse 12 결과에서 별도 `performance-budget` audit이 생성되지 않아, CI에서 실제로 경고를 발생시키는 category, metric, resource-summary assertion을 source of truth로 사용합니다.

Reference:

- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)

## Scope

현재 성능 검증 대상은 두 웹 앱의 첫 화면 smoke입니다.

| App                 | URL                     | Server command                       |
| ------------------- | ----------------------- | ------------------------------------ |
| `apps/client`       | `http://127.0.0.1:3000` | `pnpm --filter client start`         |
| `apps/market-owner` | `http://127.0.0.1:5173` | `pnpm --filter market-owner preview` |

Lighthouse CI는 root에서 실행하지만, 앱 서버는 각 workspace의 production serve command를 사용합니다.
포트는 로컬 개발 기준과 동일하게 고정하며, 자동 fallback을 허용하지 않습니다.

## Commands

의존성이나 lockfile이 바뀐 뒤에는 install을 먼저 실행합니다.

```bash
pnpm install
```

로컬에서 전체 앱을 빌드한 뒤 Lighthouse 수집과 assertion을 실행합니다.

```bash
pnpm build
pnpm perf
```

수집과 assertion을 나눠 확인해야 할 때는 아래 명령을 사용합니다.

```bash
pnpm perf:collect
pnpm perf:assert
```

## Budget Policy

초기 threshold는 warning으로 둡니다.
이 값은 제품 시나리오, 이미지 정책, 폰트 정책, API mock/seeding 기준이 정해지기 전의 기준선입니다.
성능 수치가 안정화되면 후속 Jira에서 critical threshold로 승격할 수 있습니다.

현재 기준:

- Performance score: `0.70` 이상 권장
- Accessibility score: `0.90` 이상 권장
- Best Practices score: `0.90` 이상 권장
- SEO score: `0.80` 이상 권장
- FCP: `2500ms` 이하 권장
- LCP: `4000ms` 이하 권장
- CLS: `0.1` 이하 권장
- TBT: `600ms` 이하 권장
- Script total: `1200KB` 이하 권장
- Stylesheet total: `250KB` 이하 권장
- Image total: `500KB` 이하 권장

## CI

`.github/workflows/performance.yml`은 기본 CI와 분리합니다.
기본 CI는 format, lint, typecheck, build처럼 항상 deterministic한 검증을 담당하고, performance workflow는 빌드된 앱을 실제 브라우저로 열어 metric과 report를 남깁니다.

Trigger:

- `pull_request`
- `push` to `main`
- `push` to `develop`
- `workflow_dispatch`

리포트 산출물:

- `lighthouse-report`
- `.lighthouseci`

산출물은 Git에 커밋하지 않습니다.
PR에서는 측정 완료 후 Lighthouse 요약 댓글을 남깁니다.
댓글은 같은 PR 안에서 누적 생성하지 않고, `dongchimi-performance-report` 마커가 있는 기존 댓글을 업데이트합니다.
댓글 작성에는 workflow `issues: write`, `pull-requests: write` 권한이 필요합니다.

## Review Rule

성능 관련 PR은 PR 본문 Evidence의 Performance 항목에 Lighthouse 결과를 적습니다.
자동화된 PR 댓글은 CI에서 측정한 최신 결과를 확인하는 용도로 사용합니다.
수치가 악화되었지만 threshold가 warning이라 CI가 통과한 경우에도 악화 이유나 후속 작업을 남깁니다.

## Follow-up

- 실제 핵심 user flow가 생기면 URL 대상을 첫 화면에서 주요 route로 확장합니다.
- 이미지 최적화 정책이 확정되면 image budget을 앱별로 조정합니다.
- 성능 수치가 안정화되면 일부 assertion을 `warn`에서 `error`로 승격합니다.
