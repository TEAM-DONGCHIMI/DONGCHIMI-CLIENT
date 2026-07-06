---
name: form-flow-workflow
description: 필드 검증, submit, mutation, error, disabled/loading/success 상태가 있는 프론트엔드 폼 흐름을 구현할 때 사용합니다.
---

# 폼 작업 흐름

## 목적

폼, validation, multi-step input, submit interaction, server error handling을 구현할 때 사용합니다.

## 입력 점검

### 필수 입력

- 필드 목록과 input type
- validation rules와 error messages
- submit 동작과 성공/실패 UX

### 있으면 좋은 입력

- 에러 노출 시점: touched, dirty, submitted, server response
- submit API, request body, server error shape
- disabled/loading/success 조건
- Figma URL, 이미지, 스크린샷, 또는 상세 화면 설명
- 접근성 요구: label, description, error association, focus handling

필드, 검증, submit 요구가 불명확하면 구현 전에 질문합니다.

## 읽기 전략

- 항상 읽기:
  - `recipes/add-form.md`
- 조건부 읽기:
  - `recipes/add-api-query.md`: submit이 API mutation을 호출할 때
  - `docs/workflows/spec-writing.md`: 새 spec 작성 또는 갱신이 필요할 때
  - `docs/code-quality/frontend-fundamentals.md`: form state, validation, submit side effect의 응집도/결합도 self-check가 필요할 때
  - 가까운 form/page/hook 구현

## 메인 작업 흐름

1. form owner를 결정합니다: page, route-local component, shared component.
2. 필요한 spec을 작성 또는 갱신합니다.
3. validation, submit logic, API mutation, navigation/toast side effects를 분리합니다.
4. disabled 조건과 error message visibility 조건을 분리합니다.
5. layout shift, keyboard interaction, labels, focus-visible, disabled states를 확인합니다.
6. Frontend Fundamentals 기준으로 field/form 응집도, side effect 위치, hook return shape, 예측 가능성을 self-check합니다.

## 완료 기준

- validation behavior가 요구사항과 맞습니다.
- submit disabled state와 error visibility가 분리되어 있습니다.
- server error가 표시되거나 의도적으로 처리됩니다.
- loading, failure, success 상태가 일관됩니다.
- Frontend Fundamentals 기준 self-check를 수행했고, 비자명한 form flow면 `frontend-fundamentals-review`를 추가로 적용했습니다.

## 예외

- component가 길다는 이유만으로 form hook을 추출하지 않습니다.
- submit error를 조용히 삼키지 않습니다.
- business rule이 없으면 cross-field validation을 추가하지 않습니다.
