# Recipe: Jira 디자인 기반 구현

프론트엔드 작업이 Jira와 Figma, 이미지, 사진, 스크린샷 근거에서 시작될 때 사용합니다.

이 절차는 작업 순서를 정의합니다. 실제 구현 세부 절차인 `add-design-system-component.md`, `add-app-shared-component.md`, `add-page.md`, `add-form.md`, `add-api-query.md`를 대체하지 않습니다.

Jira issue type, parent 참조, 하위 작업 분해, 본문 템플릿은 `docs/workflows/jira-issue-authoring.md`와 `templates/jira-issue-template.md`를 source of truth로 사용합니다.

## Flow

1. 요청 모드를 구분합니다.
   - Jira 작성: Jira 이슈를 만들거나 보강하는 데서 멈춥니다.
   - Jira 작업 착수: 구현 전에 Jira를 먼저 확인합니다.
   - 혼합 요청: 코드 수정 전에 Jira와 디자인 근거 확인을 끝냅니다.
2. 디자인 근거를 수집합니다.
   - Figma URL 또는 프레임 이름
   - 첨부 이미지, 사진, 스크린샷
   - 확인 가능한 variant와 상태
   - 반응형 또는 플랫폼 제약
   - 보이거나 명시된 접근성 요구
3. Jira를 작성하거나 보강합니다.
   - `docs/workflows/jira-issue-authoring.md` 기준으로 issue type, parent, child split을 결정합니다.
   - 배경, 목표, 작업 범위, 제외 범위, 디자인 근거, 완료 기준을 적습니다.
4. 구현 전에 Jira 이슈를 다시 확인하고, 작업을 시작할 경우 Jira 상태를 진행중으로 전환합니다.
   - key, 제목, 상태, 담당자, 현재 본문을 확인합니다.
   - 앱 변경이면 project key가 변경 범위와 맞는지 확인합니다.
   - Jira 요구사항과 Figma/이미지 근거를 비교합니다.
   - 요구사항이 서로 다르면 구현 전에 차이를 보고합니다.
5. 구현 workflow로 라우팅합니다.
   - 디자인시스템 컴포넌트: `design-system-component-workflow`
   - 앱 shared 컴포넌트: `app-shared-component-workflow`와 `recipes/add-app-shared-component.md`
   - 페이지 또는 라우트: `page-feature-workflow`
   - 앱 로컬 컴포넌트: `refactor-evaluator`와 `recipes/add-component.md`
   - API 조회 또는 변경 요청: `api-integration-workflow`
   - 폼 흐름: `form-flow-workflow`
   - Turbo generator 추가/수정: `turbo-generator-workflow`와 `docs/workflows/turbo-generators.md`
6. 필요하면 turbo generator로 파일을 생성합니다. generator가 아직 없으면 예정 위치를 spec에 기록하고 수동 생성 여부를 판단합니다.
7. `docs/workflows/spec-writing.md` 기준으로 스펙이 필요하면 구현 전에 가장 가까운 스펙을 작성하거나 갱신합니다.
8. Jira 완료 기준을 만족하는 가장 작은 범위로 구현합니다.
9. 개선 라운드를 실행합니다.
   - 스펙과 구현이 동기화되어 있습니다.
   - 컴포넌트는 story 또는 예시가 의미 있는 variant와 상태를 보여줍니다.
   - hook은 필요하면 단위 테스트 또는 동작 검증을 가집니다.
   - page는 로컬 route 확인 또는 검증 방법을 가집니다.
   - UI 상태가 의도적으로 처리되어 있습니다.
   - 접근성과 focus-visible 동작을 확인했습니다.
   - 긴 텍스트와 반응형 제약이 레이아웃을 깨지 않습니다.
10. 검증합니다.
   - 문서만 변경: `git diff --check`
   - package script가 있는 코드 변경: `docs/workflows/local-development.md` 기준 검증
11. 구조 개선이 필요하면 관련 없는 refactor와 분리해서 최소 범위로 수행합니다.
12. 커밋, 푸시, PR을 준비합니다.
13. Jira 이슈를 리뷰중 상태로 전환하고 코드 리뷰를 진행합니다.
14. 머지 후 Jira 이슈를 완료 상태로 전환합니다.

## Jira 작성 체크리스트

- [ ] 이슈 제목에 제품 영역과 구체적인 산출물이 드러납니다.
- [ ] issue type, parent 참조, 하위 작업 분해가 기준과 맞습니다.
- [ ] 배경에 작업이 필요한 이유가 설명되어 있습니다.
- [ ] 목표가 기대 결과를 정의합니다.
- [ ] 작업 범위가 포함할 일을 나열합니다.
- [ ] 제외 범위가 불필요한 확장을 막습니다.
- [ ] 디자인 근거에 Figma, 이미지, 사진, 스크린샷이 포함되어 있습니다.
- [ ] 완료 기준에 필요한 스펙, 테스트, 검증이 언급되어 있습니다.

## 구현 착수 체크리스트

- [ ] Jira key와 현재 이슈 본문을 확인했습니다.
- [ ] 변경 범위와 Jira project key가 맞습니다.
- [ ] Figma/이미지 근거를 확인했거나, 접근할 수 없는 근거를 보고했습니다.
- [ ] 요구사항 불일치를 구현 전에 드러냈습니다.
- [ ] 구현 workflow skill을 선택했습니다.
- [ ] 코드 변경 전에 스펙 필요 여부를 결정했습니다.

## 개선 체크리스트

- [ ] 구현이 여전히 Jira 완료 기준과 맞습니다.
- [ ] 스펙이 최종 public API, 상태, 동작과 맞습니다.
- [ ] Storybook 또는 예시가 의미 있는 상태와 variant를 다룹니다.
- [ ] 접근성 요구를 반영했거나 제외 범위로 명시했습니다.
- [ ] 긴 콘텐츠, overflow, 반응형 제약을 고려했습니다.
- [ ] 검증 명령과 생략한 검사를 기록했습니다.
