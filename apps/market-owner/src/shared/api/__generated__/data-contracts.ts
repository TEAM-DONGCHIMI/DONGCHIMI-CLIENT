/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BusinessHourSlotRequest {
  /**
   * 요일 목록
   * @example ["MONDAY","TUESDAY"]
   */
  days?: string[] | null;
  /** 영업일 여부. 휴무면 false */
  isOpen?: boolean | null;
  /**
   * 오픈 시각 (HH:mm). 휴무면 생략
   * @example "13:00"
   */
  open?: string | null;
  /**
   * 마감 시각 (HH:mm). 휴무면 생략
   * @example "18:00"
   */
  close?: string | null;
}

export interface MarketUpdateRequest {
  /**
   * 마트명
   * @example "동치미 마트 강남점"
   */
  name: string;
  /** 마트 대표 이미지 URL. 미등록 시 기본 이미지 사용 */
  thumbnailUrl?: string | null;
  /** 주소 찾기로 검색된 기본 주소 */
  address: string;
  /** 상세 주소 (동/호수 등) */
  detailAddress?: string | null;
  /**
   * 위도
   * @format double
   */
  latitude: number;
  /**
   * 경도
   * @format double
   */
  longitude: number;
  /** 영업시간 (요일 묶음 배열) */
  businessHours: BusinessHourSlotRequest[];
  /** 마트 대표 전화번호 1 */
  marketPhone1: string;
  /** 마트 전화번호 2 (추가 등록 시) */
  marketPhone2?: string | null;
  /**
   * 마트 번호 중 대표 번호 지정 (1 또는 2)
   * @format int32
   */
  marketPhonePrimary: number;
  /** 점주 전화번호 */
  ownerPhone: string;
  /** 사업자등록번호 (000-00-00000 형식) */
  brn?: string | null;
}

export interface ApiResponseUnit {
  success: boolean;
  code: string;
  message: string;
}

export interface ProductUpdateRequest {
  /** 판매 유형 (상품의 기존 유형과 일치해야 함) */
  type: 'PERIODIC' | 'DAILY';
  /** 상품 이미지 URL (미입력 시 null 저장) */
  thumbnailUrl?: string | null;
  /** 상품명 */
  name: string;
  /** 상품 구분 */
  category:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 상품 한줄 홍보글 (선택) */
  promotionalPhrase?: string | null;
  /** 정가 (DAILY만 필수, PERIODIC은 받지 않음) */
  originalPrice?: number | null;
  /** 판매가 */
  discountedPrice: number;
  /**
   * 행사 시작일
   * @format date
   * @example "2026-06-30"
   */
  discountStartDate: string;
  /**
   * 행사 종료일
   * @format date
   * @example "2026-06-30"
   */
  discountEndDate: string;
}

export interface PreparedProductDraftRequest {
  /**
   * 임시저장 상품 ID
   * @format int64
   */
  preparedProductId: number;
  /** 상품명 (미입력이면 null) */
  name?: string | null;
  /** 썸네일 이미지 URL (미입력이면 null) */
  thumbnailUrl?: string | null;
  /** 정가 (discountedPrice와 함께 보내야 한다) */
  originalPrice?: number | null;
  /** 판매(할인) 가격 (originalPrice와 함께 보내야 한다) */
  discountedPrice?: number | null;
  /** 카테고리 코드 (미선택이면 null) */
  category?:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 홍보 문구 (선택) */
  promotionalPhrase?: string | null;
  /**
   * 할인 시작일 (discountEndDate와 함께 보내야 한다)
   * @format date
   * @example "2025-08-01"
   */
  discountStartDate?: string | null;
  /**
   * 할인 종료일 (discountStartDate와 함께 보내야 한다)
   * @format date
   * @example "2025-08-16"
   */
  discountEndDate?: string | null;
  /** 할인 유형 (미지정이면 PERIODIC) */
  dealType?: 'PERIODIC' | 'DAILY';
}

export interface PreparedProductDraftSaveRequest {
  /** 임시저장할 상품 목록 */
  preparedProducts: PreparedProductDraftRequest[];
}

export interface MarketRegisterRequest {
  /**
   * 마트명
   * @example "동치미 마트 강남점"
   */
  name: string;
  /** 마트 대표 이미지 URL. 미등록 시 기본 이미지 사용 */
  thumbnailUrl?: string | null;
  /** 주소 찾기로 검색된 기본 주소 */
  address: string;
  /** 상세 주소 (동/호수 등) */
  detailAddress?: string | null;
  /**
   * 위도
   * @format double
   */
  latitude: number;
  /**
   * 경도
   * @format double
   */
  longitude: number;
  /** 영업시간 (요일 묶음 배열) */
  businessHours: BusinessHourSlotRequest[];
  /** 마트 대표 전화번호 1 */
  marketPhone1: string;
  /** 마트 전화번호 2 (추가 등록 시) */
  marketPhone2?: string | null;
  /**
   * 마트 번호 중 대표 번호 지정 (1 또는 2)
   * @format int32
   */
  marketPhonePrimary: number;
  /** 점주 전화번호 */
  ownerPhone: string;
  /** 사업자등록번호 (000-00-00000 형식) */
  brn?: string | null;
}

export interface ProductImportRequest {
  /**
   * S3에 업로드한 엑셀 파일 URL
   * @example "https://cdn.dongchimi.kr/products/imports/2026/07/x.xlsx"
   */
  excelFileUrl: string;
}

export interface ApiResponseProductImportResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ProductImportResponse | null;
}

export interface ProductImportResponse {
  /** 실행 작업 아이디 */
  jobId: string;
}

export interface ApiResponseProductImportSyncResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ProductImportSyncResponse | null;
}

export interface ProductImportSyncResponse {
  /**
   * 전체 분석 상품 수
   * @format int32
   */
  totalCount: number;
  /**
   * 분석 성공(등록완료) 상품 수
   * @format int32
   */
  successCount: number;
  /**
   * 분석 실패(수정필요) 상품 수
   * @format int32
   */
  failCount: number;
  /**
   * download~persist 전체 소요시간(ms)
   * @format int64
   */
  elapsedMs: number;
  /** 단계별 소요시간(ms) */
  stageElapsedMs: StageElapsedMs;
}

export interface StageElapsedMs {
  /** @format int64 */
  download: number;
  /** @format int64 */
  parse: number;
  /** @format int64 */
  classify: number;
  /** @format int64 */
  match: number;
  /** @format int64 */
  persist: number;
}

export interface DailyProductRegisterRequest {
  /** 상품 이미지 URL (미입력 시 null 저장) */
  thumbnailUrl?: string | null;
  /** 상품명 */
  name: string;
  /** 상품 구분 */
  category:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 상품 한줄 홍보글 (선택) */
  promotionalPhrase?: string | null;
  /** 정가 (할인 전 가격) */
  originalPrice: number;
  /** 할인가 */
  discountedPrice: number;
  /**
   * 행사 시작일
   * @format date
   * @example "2026-06-30"
   */
  discountStartDate: string;
  /**
   * 행사 종료일
   * @format date
   * @example "2026-06-30"
   */
  discountEndDate: string;
}

export interface ApiResponseFlyerPublishResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FlyerPublishResponse | null;
}

export interface FlyerPublishResponse {
  /** 전단 공유 페이지 slug */
  slug: string;
}

export interface ApiResponseFlyerQrResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FlyerQrResponse | null;
}

export interface FlyerQrResponse {
  /** QR코드 이미지 (Base64 인코딩) */
  qrCode: string;
}

export interface OwnerSignupRequest {
  /**
   * 이메일
   * @example "ddongchiim@gmail.com"
   */
  email: string;
  /**
   * 비밀번호 (6~20자, 공백·한글 불가)
   * @example "password123!"
   */
  password: string;
}

export interface ApiResponseOwnerLoginResponse {
  success: boolean;
  code: string;
  message: string;
  data?: OwnerLoginResponse | null;
}

export interface OwnerLoginResponse {
  /** 액세스 토큰 (JWT) */
  accessToken: string;
  /**
   * 점주 id
   * @format int64
   */
  ownerId: number;
  /** 점주 이메일 */
  email: string;
  /**
   * 마트 id (미등록 시 null)
   * @format int64
   */
  marketId?: number | null;
  /** 마트 이름 (미등록 시 null) */
  marketName?: string | null;
  /** 마트 이미지 URL (미등록 시 null) */
  marketThumbnailUrl?: string | null;
}

export interface OwnerLoginRequest {
  /**
   * 이메일
   * @example "ddongchiim@gmail.com"
   */
  email: string;
  /**
   * 비밀번호
   * @example "password123!"
   */
  password: string;
  /**
   * 로그인 상태 유지(자동 로그인) 여부
   * @example true
   */
  isAutoLogin: boolean;
}

export interface ProductDiscountPeriodUpdateRequest {
  /**
   * 할인 시작일 (YYYY-MM-DD)
   * @format date
   * @example "2025-08-01"
   */
  discountStartDate: string;
  /**
   * 할인 종료일 (YYYY-MM-DD)
   * @format date
   * @example "2025-08-16"
   */
  discountEndDate: string;
  /**
   * 변경할 상품 id 목록
   * @example [1,2,3]
   */
  productIds: number[];
}

export interface ApiResponseCursorSliceResponseOwnerProductListItemResponse {
  success: boolean;
  code: string;
  message: string;
  data?: CursorSliceResponseOwnerProductListItemResponse | null;
}

export interface CursorSliceResponseOwnerProductListItemResponse {
  /** 조회 결과 목록 */
  content: OwnerProductListItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /**
   * 다음 페이지 조회용 커서. 없으면 null
   * @format int64
   */
  nextCursor?: number | null;
}

export interface OwnerProductListItemResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /** 카테고리 코드 */
  category:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 카테고리 표시명 */
  categoryName: string;
  /** 정가 */
  originalPrice: number;
  /** 할인가 */
  discountedPrice: number;
  /** 홍보 문구 (없으면 null) */
  promotionalPhrase?: string | null;
  /**
   * 할인 시작일
   * @format date
   */
  discountStartDate: string;
  /**
   * 할인 종료일
   * @format date
   */
  discountEndDate: string;
  /**
   * 조회수
   * @format int32
   */
  viewCount: number;
  /**
   * 상품 등록 일시
   * @format date-time
   */
  createdAt: string;
}

export interface ApiResponseOwnerProductDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data?: OwnerProductDetailResponse | null;
}

export interface OwnerProductDetailResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** PERIODIC(기간 할인) / DAILY(오늘의 특가) */
  dealType: 'PERIODIC' | 'DAILY';
  /** 상품 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /** 정가 */
  originalPrice: number;
  /** 할인가 */
  discountedPrice: number;
  /** 카테고리 코드 */
  category:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 카테고리 표시명 */
  categoryName: string;
  /** 홍보 문구 (없으면 null) */
  promotionalPhrase?: string | null;
  /**
   * 할인 시작일 (YYYY-MM-DD)
   * @format date
   */
  discountStartDate: string;
  /**
   * 할인 종료일 (YYYY-MM-DD)
   * @format date
   */
  discountEndDate: string;
}

export interface ApiResponseProductSearchResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ProductSearchResponse | null;
}

export interface ProductSearchItemResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 판매 유형 */
  dealType: 'PERIODIC' | 'DAILY';
}

export interface ProductSearchResponse {
  /** 검색된 상품 목록 */
  products: ProductSearchItemResponse[];
}

export interface SseEmitter {
  /** @format int64 */
  timeout?: number;
}

export interface ApiResponseOwnerPreparedProductDraftListResponse {
  success: boolean;
  code: string;
  message: string;
  data?: OwnerPreparedProductDraftListResponse | null;
}

export interface OwnerPreparedProductDraftListResponse {
  /**
   * 마트 전체 임시저장 상품 수
   * @format int64
   */
  totalCount: number;
  /**
   * 마트 전체 임시저장 중 성공(SUCCESS) 수
   * @format int64
   */
  successCount: number;
  /**
   * 마트 전체 임시저장 중 실패(FAIL) 수
   * @format int64
   */
  failCount: number;
  /** 검색·카테고리 필터 및 페이지네이션이 적용된 임시저장 상품 목록 */
  preparedProducts: OwnerPreparedProductDraftResponse[];
}

export interface OwnerPreparedProductDraftResponse {
  /**
   * 임시저장 상품 ID
   * @format int64
   */
  preparedProductId: number;
  /** 상품명 (없으면 null) */
  name?: string | null;
  /** 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /** 판매(할인) 가격 (없으면 null) */
  discountedPrice?: number | null;
  /** 카테고리 코드 (없으면 null) */
  category?:
    | 'VEGETABLE_FRUIT'
    | 'MEAT_EGG'
    | 'SEAFOOD'
    | 'DAIRY'
    | 'CONVENIENCE_FOOD'
    | 'PROCESSED_FOOD'
    | 'BEVERAGE_ALCOHOL'
    | 'HOUSEHOLD_GOODS'
    | 'ETC';
  /** 홍보 문구 (없으면 null) */
  promotionalPhrase?: string | null;
  /**
   * 할인 시작일 (없으면 null)
   * @format date
   */
  discountStartDate?: string | null;
  /**
   * 할인 종료일 (없으면 null)
   * @format date
   */
  discountEndDate?: string | null;
  /** SUCCESS / FAIL */
  draftStatus: 'SUCCESS' | 'FAIL';
  /** 실패 사유 (성공이면 null) */
  failReason?:
    | '이미지 누락'
    | '카테고리 미선택'
    | '상품명 미입력'
    | '판매가격 미입력'
    | '할인기간 미설정';
}

export interface ApiResponseFlyerPreviewResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FlyerPreviewResponse | null;
}

export interface FlyerPreviewBusinessHourResponse {
  /** 요일 목록 (MONDAY ~ SUNDAY) */
  days: string[];
  /** 영업일 여부. 휴무면 false */
  isOpen: boolean;
  /** 오픈 시각 (HH:mm). 휴무면 null */
  open?: string | null;
  /** 마감 시각 (HH:mm). 휴무면 null */
  close?: string | null;
}

export interface FlyerPreviewDailyProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 정가 */
  originalPrice: number;
  /** 할인가 */
  discountedPrice: number;
  /**
   * 할인율(%)
   * @format int32
   */
  discountRate: number;
}

export interface FlyerPreviewDailyResponse {
  /**
   * 오늘의 특가 상품 총 개수 (= products 길이)
   * @format int32
   */
  totalCount: number;
  /** 오늘의 특가 상품 전체 목록 (최근 등록순) */
  products: FlyerPreviewDailyProductResponse[];
}

export interface FlyerPreviewPreparedProductResponse {
  /**
   * 임시저장 상품 id
   * @format int64
   */
  preparedProductId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL */
  thumbnailUrl: string;
  /** 할인가 */
  discountedPrice: number;
}

export interface FlyerPreviewProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 할인가 */
  discountedPrice: number;
  /**
   * 할인율(%). 0이면 할인 없음
   * @format int32
   */
  discountRate: number;
}

export interface FlyerPreviewResponse {
  /**
   * 마트 id
   * @format int64
   */
  marketId: number;
  /** 마트명 */
  name: string;
  /** 마트 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 마트 기본 주소 */
  address: string;
  /** 현재 영업중 여부 */
  isOpenNow: boolean;
  /** 영업시간 (요일 묶음 배열) */
  businessHours: FlyerPreviewBusinessHourResponse[];
  /** 마트 대표 전화번호 1 */
  marketPhone1: string;
  /** 마트 전화번호 2 (없으면 null) */
  marketPhone2?: string | null;
  /** 사장님 전화번호 */
  ownerPhone: string;
  /** 인기 상품 TOP 3 */
  top3: FlyerPreviewProductResponse[];
  /** 오늘의 특가 */
  daily: FlyerPreviewDailyResponse;
  /** 발행 전 임시저장(기간 할인) 상품 목록 (draftStatus=SUCCESS만) */
  preparedProducts: FlyerPreviewPreparedProductResponse[];
}

export interface ApiResponseFlyerDailyPreviewResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FlyerDailyPreviewResponse | null;
}

export interface FlyerDailyPreviewResponse {
  /**
   * 마트 id
   * @format int64
   */
  marketId: number;
  /** 마트명 */
  name: string;
  /** 마트 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 마트 기본 주소 */
  address: string;
  /** 현재 영업중 여부 */
  isOpenNow: boolean;
  /** 영업시간 (요일 묶음 배열) */
  businessHours: FlyerPreviewBusinessHourResponse[];
  /** 마트 대표 전화번호 1 */
  marketPhone1: string;
  /** 마트 전화번호 2 (없으면 null) */
  marketPhone2?: string | null;
  /** 사장님 전화번호 */
  ownerPhone: string;
  /** 인기 상품 TOP 3 */
  top3: FlyerPreviewProductResponse[];
  /** 오늘의 특가 */
  daily: FlyerPreviewDailyResponse;
}

export interface ApiResponseOwnerHomeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: OwnerHomeResponse | null;
}

export interface HomeFlyerResponse {
  /**
   * 전단 id
   * @format int64
   */
  flyerId: number;
  /** 공유용 URL slug */
  slug: string;
  /** QR코드 이미지 (Base64 인코딩, 없으면 null) */
  qrCode?: string | null;
}

export interface HomeProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /** 상품명 */
  name: string;
  /** 정가 */
  originalPrice: number;
  /** 할인가 */
  discountedPrice: number;
  /**
   * 할인율(%)
   * @format int32
   */
  discountRate: number;
}

export interface OwnerHomeResponse {
  /**
   * 오늘 등록한 상품 수
   * @format int32
   */
  todayRegisteredCount: number;
  /**
   * 진행 중인 오늘의 특가 상품 총 개수
   * @format int32
   */
  dailyCount: number;
  /** 오늘의 특가 상품 미리보기 목록 */
  dailyProducts: HomeProductResponse[];
  /**
   * 진행 중인 기간 할인 상품 총 개수
   * @format int32
   */
  periodicCount: number;
  /** 기간 할인 상품 미리보기 목록 */
  periodicProducts: HomeProductResponse[];
  flyer?: HomeFlyerResponse | null;
}

export interface ProductBulkDeleteRequest {
  /**
   * 삭제할 상품 id 목록
   * @example [1,2,3]
   */
  productIds: number[];
  /**
   * 할인 기간 중이어도 삭제할지 여부
   * @example false
   */
  forceDelete: boolean;
}

export interface ProductDeleteRequest {
  /**
   * 할인 기간 중이어도 삭제할지 여부
   * @example false
   */
  forceDelete: boolean;
}

export interface ProductResetRequest {
  /**
   * 초기화할 할인 유형
   * @example "DAILY"
   */
  dealType: 'PERIODIC' | 'DAILY';
  /**
   * 할인 기간 중이어도 삭제할지 여부
   * @example false
   */
  forceDelete: boolean;
}

export type UpdateData = ApiResponseUnit;

export type GetDetailData = ApiResponseOwnerProductDetailResponse;

export type UpdateProductData = ApiResponseUnit;

export type DeleteData = ApiResponseUnit;

export type GetDraftsData = ApiResponseOwnerPreparedProductDraftListResponse;

export type SaveDraftsData = ApiResponseUnit;

export type RegisterData = ApiResponseUnit;

export type GetProductsData = ApiResponseCursorSliceResponseOwnerProductListItemResponse;

export type ConfirmDraftsData = ApiResponseUnit;

export type DeleteAllData = ApiResponseUnit;

export type StartImportData = ApiResponseProductImportResponse;

export type CancelImportData = ApiResponseUnit;

export type ImportSyncData = ApiResponseProductImportSyncResponse;

export type RegisterDailyProductData = ApiResponseUnit;

export type PublishData = ApiResponseFlyerPublishResponse;

export type IssueQrCodeData = ApiResponseFlyerQrResponse;

export type SignupData = ApiResponseOwnerLoginResponse;

export type LoginData = ApiResponseOwnerLoginResponse;

export type UpdateDiscountPeriodData = ApiResponseUnit;

export type SearchData = ApiResponseProductSearchResponse;

export type SubscribeProgressData = SseEmitter;

export type GetPeriodicPreviewData = ApiResponseFlyerPreviewResponse;

export type GetDailyPreviewData = ApiResponseFlyerDailyPreviewResponse;

export type GetHomeData = ApiResponseOwnerHomeResponse;

export type ResetData = ApiResponseUnit;
