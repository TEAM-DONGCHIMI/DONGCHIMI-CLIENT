# Domain Component Spec: `ProductImageUploadField`

## Purpose

`ProductImageUploadField`는 product domain에서 상품 이미지 업로드/수정 영역을 표시하는 공통 컴포넌트입니다.

## Ownership

- 위치: `apps/market-owner/src/domains/product/components/product-image-upload-field`
- 사용처: 오늘의 특가 등록 페이지, 상품 수정 modal

## Behavior

- `registration` variant는 안내 문구, dashed empty upload box, preview dimmer, 숨겨진 file input을 제공합니다.
- `editModal` variant는 수정 modal의 checkerboard image placeholder와 `IcCameraDefault` badge를 표시합니다.
- 이미지 preview가 있으면 registration/editModal variant 모두 dimmer를 표시합니다.
- file input이 연결된 경우 이미지 카드 전체를 클릭하거나 keyboard로 활성화해 파일 선택창을 엽니다.
- 실제 이미지 파일 검증과 object URL 생성/정리는 호출부 hook/model이 담당합니다.
