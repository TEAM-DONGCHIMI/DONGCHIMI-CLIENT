# Deployment

DONGCHIMI-CLIENT는 하나의 GitHub monorepo를 유지하고, 사용자 웹과 사장님 웹은 Vercel Project를 앱별로 분리해서 배포합니다.

## Vercel Projects

| App                 | Vercel Project           | Framework | Root Directory      | Production URL                              |
| ------------------- | ------------------------ | --------- | ------------------- | ------------------------------------------- |
| `apps/client`       | `dongchimi-client`       | Next.js   | `apps/client`       | <https://dongchimi-client.vercel.app>       |
| `apps/market-owner` | `dongchimi-market-owner` | Vite      | `apps/market-owner` | <https://dongchimi-market-owner.vercel.app> |

공통 설정:

- Team: `Jangminsu's projects`
- Node.js: `22.x`
- `sourceFilesOutsideRootDirectory`: enabled
- `enableAffectedProjectsDeployments`: enabled
- Install/build/output command: framework auto-detect

## Strategy

- 저장소는 하나로 유지합니다.
- Vercel Project는 앱별로 분리합니다.
- 앱별 Project는 각각 독립 URL, 환경 변수, preview/prod deployment history를 가집니다.
- shared package 또는 root lockfile 변경은 Vercel의 affected project detection 기준으로 필요한 앱만 배포되도록 합니다.

## Manual Deployment

로컬 CLI는 최신 Vercel CLI를 임시 실행합니다. 전역 CLI가 오래되면 upload endpoint에서 실패할 수 있습니다.

```bash
pnpm dlx vercel@latest --version
```

사용자 웹:

```bash
vercel link --project dongchimi-client --yes --scope jangminsus-projects
pnpm dlx vercel@latest deploy --yes --scope jangminsus-projects
```

사장님 웹:

```bash
vercel link --project dongchimi-market-owner --yes --scope jangminsus-projects
pnpm dlx vercel@latest deploy --yes --scope jangminsus-projects
```

검증된 preview를 production으로 승격할 때:

```bash
pnpm dlx vercel@latest promote <preview-url> --scope jangminsus-projects --yes
```

## Verification

배포 전 로컬 검증:

```bash
pnpm format:check
pnpm lint
pnpm build
```

배포 후 확인:

- Vercel deployment state가 `READY`인지 확인합니다.
- `apps/client`는 `DONGCHIMI CLIENT` 텍스트가 보이는지 확인합니다.
- `apps/market-owner`는 `DONGCHIMI Market Owner` heading이 보이는지 확인합니다.
- 공개 production URL에서 브라우저 콘솔 error가 없는지 확인합니다.

## Current Blocker

GitHub 자동 배포 연결은 아직 완료되지 않았습니다.

`vercel git connect https://github.com/TEAM-DONGCHIMI/DONGCHIMI-CLIENT.git` 실행 시 Vercel GitHub App이 `TEAM-DONGCHIMI/DONGCHIMI-CLIENT` private repository에 접근하지 못해 실패했습니다.

해결 후 확인할 항목:

- Vercel GitHub App이 `TEAM-DONGCHIMI/DONGCHIMI-CLIENT` repository에 설치되어 있습니다.
- 두 Vercel Project가 같은 GitHub repository에 연결되어 있습니다.
- Production branch는 팀 배포 정책에 맞춰 `main` 또는 `develop` 중 하나로 고정되어 있습니다.
- PR preview deployment가 두 앱에 대해 자동 생성됩니다.
