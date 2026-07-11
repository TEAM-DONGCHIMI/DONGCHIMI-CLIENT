# Page Spec

## Metadata

- Jira: DCMSM-26
- Screen ID: APPJAM node `1730:37537`
- Route: TBD
- Owner: FE
- Status: Implemented

## Purpose

- 회원가입을 완료한 마트 사장님이 온보딩 단계에서 마트명, 사업자 등록 번호, 주소, 영업 시간, 휴무일, 연락처를 입력해 마트 정보를 등록하는 페이지 UI를 제공합니다.
- 이번 범위에서는 API 연동 전 fixture 수준의 입력 UI와 disabled submit 조건을 고정합니다.

## Source Of Truth

- Figma: `https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=1730-37537&m=dev`
- Figma frame / Screen ID: `Frame 2147239929`, node `1730:37537`
- Target viewport: desktop `1440 x 675`, responsive fallback for narrow viewport
- FRS / SRS: TBD
- Decision / Meeting note: DCMSM-26 Jira 본문
- Related Jira: DCMSM-26, DCMSM-35, DCMDS-29

## Scope

- 상단 로고 header, 페이지 제목/설명, 마트 이미지 업로드 placeholder를 렌더링합니다.
- 마트 이미지 파일을 선택하면 선택한 이미지를 업로드 영역에 preview로 표시하고 오른쪽 위 camera icon을 표시합니다.
- 마트 이미지는 JPG/JPEG/PNG 형식과 최대 10MB 파일만 허용하고, 형식 오류·크기 초과·업로드 실패·네트워크 오류를 error Toast로 안내합니다.
- 마트명, 사업자 등록 번호, 주소, 상세주소, 영업 시간, 휴무일, 마트 번호, 점주 번호 입력 UI를 렌더링합니다.
- 마트명은 필수 입력이며 공백 포함 최대 15자까지 입력할 수 있고, 미입력 또는 첫 글자가 공백이면 에러 메시지를 표시합니다.
- 사업자 등록 번호는 선택 입력이며 숫자만 입력할 수 있고, 입력한 숫자에 따라 `000-00-00000` 형식으로 하이픈을 자동 적용합니다. 입력한 경우 숫자 10자리를 모두 채워야 하며 형식이 맞지 않으면 에러 메시지를 표시합니다.
- 주소는 필수 입력이며 주소 찾기를 통해 선택된 주소만 표시합니다. 직접 텍스트 입력은 막고, 미입력 안내는 후속 토스트 처리로 분리합니다.
- 상세주소는 필수 입력이며 공백 포함 최대 20자까지 입력할 수 있고, 미입력 상태에서는 에러 메시지를 표시합니다.
- 영업 요일은 월요일부터 일요일까지 선택 개수 제한 없이 다중 선택할 수 있고 선택한 요일을 trigger에 표시합니다.
- 영업 시간은 숫자만 입력받아 `00:00 - 00:00` 형식으로 자동 포맷하며, `00:00`부터 `23:59` 범위 안에서 종료 시간이 시작 시간보다 이후여야 합니다.
- 영업 요일 또는 영업 시간이 비어 있으면 `영업 요일과 영업시간을 입력해주세요.`를 표시하고, 영업 시간 형식이 올바르지 않으면 `올바른 시간을 입력해주세요.`를 표시합니다.
- 영업 시간과 마트 번호는 `+` action으로 추가 입력 row를 최대 1개 노출하고, 추가 row의 `-` action으로 제거합니다.
- 추가 영업 시간과 추가 마트 번호 row가 노출된 경우 기본 필드와 동일하게 blur 시점에 필수값과 형식을 검증하며, row를 제거하면 해당 값과 에러를 초기화합니다.
- 마트 번호는 필수 입력이며 숫자만 입력받아 일반전화, 휴대전화, 인터넷전화 번호 형식으로 하이픈을 자동 적용하고, 미입력 또는 전화번호 형식 오류 시 에러 메시지를 표시합니다.
- 점주 번호는 필수 입력이며 숫자만 입력받아 휴대전화 번호 형식으로 하이픈을 자동 적용하고, 미입력 또는 휴대전화 형식 오류 시 에러 메시지를 표시합니다.
- 점주 번호는 추가 입력 action 없이 1개만 입력할 수 있습니다.
- 필드는 입력 중에 에러 메시지를 노출하지 않고, 해당 필드 또는 입력 영역을 벗어날 때 검증합니다.
- 필수 입력값이 유효해지기 전 `등록하기` 버튼을 disabled 상태로 유지합니다.
- 필수 입력 표시 `*`에 hover하면 `* 표시는 필수로 입력해야 해요.` 툴팁을 표시하고, hover가 해제되면 닫습니다.
- 폼 상태와 touched/error 관리는 `react-hook-form`으로 처리하고, 필드 검증 규칙은 `zod` schema와 `zodResolver`로 관리합니다.
- 기존 design-system layout primitive와 form/button/input/chip/addable field 컴포넌트를 우선 조합합니다.

## Out Of Scope

- 실제 이미지 업로드 API 연동
- 카카오 주소 검색 외부 서비스 연동과 서비스 오류 처리
- 마트 정보 등록 API mutation
- 사업자 등록 번호 실사업자 인증
- 영업 시간/마트 번호 복수 row의 API payload 정책
- 신규 design-system public component 추가

## Layout And Sections

- Header: Figma의 `Header_upload page`와 맞춘 64px 로고 header를 page-local markup으로 렌더링합니다.
- Page heading: 중앙 정렬된 `마트 정보 등록` 제목과 설명을 렌더링합니다.
- Form content: 좌측 240px 이미지 업로드 영역과 우측 866px 입력 영역을 `Flex`, `Stack`, `Grid`로 조합합니다.
- Address: 주소 read-only 입력과 주소 찾기 버튼을 같은 행에 배치하고 상세주소는 다음 행 full width로 배치합니다.
- Business/contact: 영업 시간/휴무일과 마트 번호/점주 번호를 2열로 배치합니다. 영업 시간과 마트 번호 영역은 추가 row 슬롯 높이를 미리 확보해, 추가 row 노출 시 휴무일/점주 번호 영역이 아래로 밀리지 않게 합니다.
- Submit: 하단 중앙에 disabled 가능한 등록 버튼을 배치합니다.

## Routing And Access

- route path: TBD
- route params: none
- search params: none
- layout shell: TBD, 회원가입 후 마트 미등록 온보딩 flow에서 확정
- access rule: 첫 로그인 또는 회원가입 후 마트 미등록 상태에서 진입
- after action navigation: API 연동 전 없음

## Design System And Component Boundary

- design-system `ui` components: `TextInput`, `Button`, `AddableField`, `Chip`, `RequiredMark`
- design-system `layout` components: `Flex`, `Stack`, `Grid`
- design-system icons: `IcPlus`, `IcPlusSizeSmallColor60`, `IcLineHorizontalSizeSmall`, `IcClockSizeSmallColor60`, `IcPhoneSizeSmallColor60`, `IcChevronDown`
- app-shared components: none
- page-local components: section-local field composition
- not promoted to design-system: 마트 정보 등록 전용 header/logo placeholder와 field composition은 현재 단일 route 전용입니다.

## States

- loading: API 연동 전까지 별도 loading 없음
- empty: 이미지 미등록 placeholder와 각 input placeholder를 표시합니다.
- error: 마트명, 사업자 등록 번호, 상세주소, 영업 시간, 마트 번호, 점주 번호의 클라이언트 validation 메시지를 표시합니다. 주소 미입력 안내는 후속 토스트 처리로 분리합니다.
- toast error: 이미지 형식/크기/업로드/네트워크 오류, 주소 검색 서비스 오류, 등록 서버 오류 및 등록 실패 문구를 공통 `ToastProvider`로 표시합니다. 실제 서비스 오류는 각 API callback이 실패할 때 노출합니다.
- toast placement: 마트 정보 등록 페이지에서 발생한 Toast는 viewport 상단 중앙에서 24px 떨어진 위치에 표시합니다.
- disabled: 필수값이 미입력 또는 유효하지 않으면 submit button을 비활성화합니다.
- selected / active: select value로 영업 요일/휴무일 선택 상태를 관리합니다.

## Behavior

- navigation: 이번 UI-only 범위에서는 route 연결 없음
- interaction: 이미지 추가는 file input으로 이미지 파일 선택 창을 열고 선택한 이미지를 preview로 표시합니다. 주소 찾기는 외부 연동 전 placeholder action입니다. 영업 시간과 마트 번호의 추가 버튼은 추가 입력 row를 노출하고 추가 row의 제거 버튼은 해당 row를 숨깁니다.
- form / validation: 입력 중에는 에러 메시지를 노출하거나 갱신하지 않고, 필드에서 다른 영역으로 focus가 이동하는 blur 시점에 검증합니다. 영업 요일과 영업 시간은 하나의 입력 영역으로 취급해 영역 내부 이동 중에는 검증하지 않고 영역을 벗어날 때 함께 검증합니다.
- model: `model/*`에서 form type, 입력 포맷터, validator, zod validation schema를 page-local로 관리합니다.
- API: none

## Accessibility

- keyboard: input, select, button은 native keyboard interaction을 사용합니다.
- focus: page CSS와 design-system component focus-visible을 유지합니다.
- accessible name: 이미지 추가, select, 점주 번호 icon input은 aria-label을 제공합니다.

## Responsive

- viewport evidence: Figma desktop `1440 x 675`
- mobile: 좌측 이미지 업로드와 우측 입력 영역을 단일 컬럼으로 전환합니다.
- tablet: field pair와 address row가 폭에 따라 단일 컬럼으로 전환됩니다.
- desktop: Figma 기준 240px 이미지 영역, 866px 필드 영역, 50px column gap을 유지합니다.

## Publishing Evidence

- Figma mismatch: 실제 로고 asset은 repo에 없어서 page-local `DC` text logo placeholder를 사용합니다.
- browser route: TBD
- screenshot / preview: implementation verification 단계에서 확인합니다.
- visual notes: Figma의 development annotation 중 이미지 업로드 영역은 button placeholder로 구현합니다.

## Verification

- [ ] `git diff --check`
- [ ] Frontend Fundamentals self-check
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] browser route and viewport: 후속 라우팅 연결 후 확인

## Open Questions

- 첫 로그인 또는 회원가입 성공 후 마트 미등록 상태를 어떤 route/guard에서 판단할지는 후속 auth onboarding flow 이슈에서 확정합니다.
- 실제 로고 asset 위치가 확정되면 page-local placeholder를 교체합니다.
- 주소 찾기, 이미지 업로드 API, 등록 API는 후속 이슈에서 연결합니다.
