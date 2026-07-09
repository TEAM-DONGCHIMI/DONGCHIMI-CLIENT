# Frontend Cohesion

이 문서는 Toss Frontend Fundamentals의 Cohesion 기준을 DONGCHIMI-CLIENT 구현 self-check와 리뷰에 적용하는 repo-local 기준입니다.

Cohesion은 함께 수정되는 코드가 함께 있는지 확인합니다. 구현 중에는 변경 단위를 먼저 정하고 관련 component, hook, type, fixture, spec, API helper가 같은 기능 경계에 모이는지 봅니다. 리뷰에서는 한 기능 변경을 위해 여러 위치를 따로 고쳐야 하는 구조를 찾습니다.

## 적용 시점

- feature-local 파일 배치와 폴더 경계를 정할 때
- form field, validation, error copy, submit payload의 변경 단위를 정할 때
- magic number, option 값, 상태코드, copy를 어디에 둘지 판단할 때
- 타입, fixture, spec, API helper가 사용처와 너무 멀어진 것처럼 보일 때

## 함께 바뀌는 코드는 함께 둔다

### 함께 수정되는 파일을 같은 디렉토리에 두기

- 타입별 대분류만으로 끝내지 말고 기능 또는 도메인 단위로 묶습니다.
- 특정 기능 삭제 시 관련 파일을 디렉토리 단위로 함께 삭제할 수 있어야 합니다.
- 도메인 간 직접 import는 피하고, 필요하면 상위 경계에서 조합합니다.

### 매직 넘버 없애기

- 숫자 값과 그 값을 요구하는 맥락을 분리하지 않습니다.
- 변경 시 함께 바뀌어야 하는 값은 의미 상수로 끌어올려 같은 모듈에 둡니다.
- 상수는 사용처 근처 또는 도메인 상수 파일에 배치해 동시 수정을 유도합니다.

### 폼의 응집도 생각하기

- 폼 설계 전에 변경 단위가 필드 중심인지 폼 전체인지 먼저 정합니다.
- 필드 단위 응집은 각 필드의 독립 검증, 비동기 검증, 재사용 요구가 클 때 선택합니다.
- 폼 전체 응집은 필드 간 의존성, 단계형 흐름, 단일 비즈니스 기능 완결성이 클 때 선택합니다.
- 한 폼 안에서 두 방식을 혼합할 때는 기준을 spec에 기록합니다.

## 구현 Self-Check

- 같은 feature의 component, hook, type, API helper, fixture, spec이 지나치게 흩어져 있지 않은가
- 같은 의미의 상수, magic number, option 값이 여러 파일에서 따로 관리되지 않는가
- form field, validation, error copy, submit payload가 서로 다른 위치에서 따로 바뀌어야 하지 않는가
- 타입 정의가 실제 사용처와 너무 멀어 변경 누락을 만들지 않는가
- import 경로가 길어질 만큼 관련 코드가 멀리 떨어져 있지 않은가
- 기능 제거 시 폴더 단위 삭제만으로 잔여 코드 없이 정리 가능한가
- 폼 변경 단위가 현재 구조와 일치하는가
- fixture와 spec이 실제 구현 변경을 따라가기 쉬운 위치에 있는가

## Review Finding 기준

- Critical: 관련 코드가 흩어져 실제 변경 누락, 잘못된 payload, 깨진 validation, 삭제 누락으로 이어진 경우
- Warning: 가까운 변경에서 관련 파일을 놓치거나 서로 다른 정책이 생길 가능성이 큰 경우
- Suggestion: 지금 모으면 변경 단위가 선명해지지만 동작 리스크는 낮은 경우
