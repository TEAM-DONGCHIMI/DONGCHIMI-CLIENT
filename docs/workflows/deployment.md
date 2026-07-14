# Deployment

DONGCHIMI-CLIENT는 하나의 GitHub monorepo를 유지하고, 사용자 웹과 사장님 웹은 Vercel Project를 앱별로 분리해서 배포합니다.

## Vercel Projects

| App                 | Vercel Project           | Framework | Root Directory      | Production URL                              |
| ------------------- | ------------------------ | --------- | ------------------- | ------------------------------------------- |
| `apps/client`       | `dongchimi-client`       | Next.js   | `apps/client`       | <https://dongchimi-client.vercel.app>       |
| `apps/market-owner` | `dongchimi-market-owner` | Vite      | `apps/market-owner` | <https://dongchimi-market-owner.vercel.app> |

공통 설정:

- Team: `Jangminsu's projects` (현재 연결된 Vercel Team입니다. 팀 공용 Vercel Team으로 이전하면 Team 이름과 CLI `--scope`를 함께 교체합니다.)
- Node.js: `24.x`
- `sourceFilesOutsideRootDirectory`: enabled
- `enableAffectedProjectsDeployments`: enabled
- Install/build/output command: framework auto-detect

## Strategy

- 저장소는 하나로 유지합니다.
- Vercel Project는 앱별로 분리합니다.
- 앱별 Project는 각각 독립 URL, 환경 변수, preview/prod deployment history를 가집니다.
- shared package 또는 root lockfile 변경은 Vercel의 affected project detection 기준으로 필요한 앱만 배포되도록 합니다.

## Market Owner API Routing

`apps/market-owner`의 인증 API는 refresh token을 HttpOnly cookie로 전달합니다. 브라우저와 API의 origin이 달라지는 Preview에서는 `SameSite=Lax` cookie를 안정적으로 사용하기 위해 Vercel deployment origin의 `/v1/*` 경로를 실제 API로 rewrite합니다.

| Environment | `VITE_PUBLIC_API_SERVER_BASE_URL` | Routing                                                                        |
| ----------- | --------------------------------- | ------------------------------------------------------------------------------ |
| Local       | `http://localhost:5173`           | Vite dev server가 `/v1/*`를 `https://api.dongchiimi.com`으로 proxy합니다.      |
| Preview     | `/`                               | Vercel이 `/v1/*`를 `https://api.dongchiimi.com/v1/*`로 external rewrite합니다. |
| Production  | `https://api.dongchiimi.com`      | 브라우저가 API origin을 직접 호출합니다.                                       |

- Preview 값에 `localhost`를 사용하지 않습니다.
- `VITE_*` 환경 변수는 Vite build 시점에 번들에 포함되므로 Vercel Preview 환경 변수 변경 후 새 deployment가 필요합니다.
- `/v1/*`는 인증 및 사용자별 응답을 포함하므로 external rewrite caching을 비활성화합니다.
- SPA의 unknown route `404` fallback은 기존 `routes` 설정에서 계속 관리합니다.

## Manual Deployment

로컬 CLI는 최신 Vercel CLI를 임시 실행합니다. 전역 CLI가 오래되면 upload endpoint에서 실패할 수 있습니다.
수동 배포는 앱별 Vercel Project link context가 섞이지 않도록 각 앱 디렉터리에서 실행합니다.

```bash
pnpm dlx vercel@latest --version
```

사용자 웹:

```bash
(cd apps/client && pnpm dlx vercel@latest link --project dongchimi-client --yes --scope jangminsus-projects)
(cd apps/client && pnpm dlx vercel@latest deploy --yes --scope jangminsus-projects)
```

사장님 웹:

```bash
(cd apps/market-owner && pnpm dlx vercel@latest link --project dongchimi-market-owner --yes --scope jangminsus-projects)
(cd apps/market-owner && pnpm dlx vercel@latest deploy --yes --scope jangminsus-projects)
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
- `apps/client`는 브라우저 title이 `DONGCHIMI Client`이고, root page에 `DONGCHIMI CLIENT` 텍스트가 보이는지 확인합니다.
- `apps/market-owner`는 `DONGCHIMI Market Owner` heading이 보이는지 확인합니다.
- `apps/market-owner`는 존재하지 않는 경로가 `404` status와 임시 not found 화면으로 응답하는지 확인합니다.
- 공개 production URL에서 브라우저 콘솔 error가 없는지 확인합니다.

## Git Integration

두 Vercel Project는 GitHub repository에 연결되어 있습니다.
배포는 GitHub Actions workflow가 아니라 Vercel Git Integration이 담당합니다.

- Repository: `TEAM-DONGCHIMI/DONGCHIMI-CLIENT`
- Production branch: `main`
- `dongchimi-client` preview check: `Vercel – dongchimi-client`
- `dongchimi-market-owner` preview check: `Vercel – dongchimi-market-owner`
- Vercel bot PR message는 앱별 최신 preview URL과 feedback URL을 한 곳에서 확인하기 위해 유지합니다. PR timeline 노이즈가 커지면 preview deployment 자체를 끄지 말고 각 Vercel Project의 Git settings에서 bot comment 노출 범위를 조정합니다.

GitHub 연동 확인 항목:

- Vercel GitHub App이 `TEAM-DONGCHIMI/DONGCHIMI-CLIENT` repository에 설치되어 있습니다.
- 두 Vercel Project가 같은 GitHub repository에 연결되어 있습니다.
- PR preview deployment가 두 앱에 대해 자동 생성됩니다.
- `main`에 push 또는 merge되면 production deployment가 생성됩니다.
- Production branch는 `main`입니다. 팀 정책상 `develop` merge를 production deploy로 볼 경우 Vercel Project settings에서 production branch를 변경합니다.
