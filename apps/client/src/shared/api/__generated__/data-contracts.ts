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

export interface OAuthLoginRequest {
  /** 소셜 제공자로부터 발급받은 인가 코드(authorization code) */
  code: string;
}

export interface ApiResponseOAuthLoginResponse {
  success: boolean;
  code: string;
  message: string;
  data?: OAuthLoginResponse | null;
}

export interface OAuthLoginResponse {
  /** 동치미 서비스 access token (JWT) */
  accessToken: string;
}

export interface ApiResponseMarketDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data?: MarketDetailResponse | null;
}

export interface BusinessHourResponse {
  /** 요일 목록 (MONDAY ~ SUNDAY) */
  days: string[];
  /** 영업일 여부. 휴무면 false */
  isOpen: boolean;
  /** 오픈 시각 (HH:mm). 휴무면 null */
  open?: string | null;
  /** 마감 시각 (HH:mm). 휴무면 null */
  close?: string | null;
}

export interface MarketDetailResponse {
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
  businessHours: BusinessHourResponse[];
  /** 마트 대표 전화번호 1 */
  marketPhone1: string;
  /** 마트 전화번호 2 (없으면 null) */
  marketPhone2?: string | null;
  /** 사장님 전화번호 */
  ownerPhone: string;
  /** 인기 상품 TOP 3 */
  top3: PopularProductResponse[];
}

export interface PopularProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /**
   * 할인가
   * @format int32
   */
  discountedPrice: number;
  /**
   * 할인율(%). 0이면 할인 없음
   * @format int32
   */
  discountRate: number;
}

export interface ApiResponseProductDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ProductDetailResponse | null;
}

export interface ProductDetailResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** PERIODIC(기간 할인) / DAILY(오늘의 특가) */
  dealType: 'PERIODIC' | 'DAILY';
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
  /** 마트 이름 */
  marketName: string;
}

export interface ApiResponseCursorSliceResponsePeriodicProductResponse {
  success: boolean;
  code: string;
  message: string;
  data?: CursorSliceResponsePeriodicProductResponse | null;
}

export interface CursorSliceResponsePeriodicProductResponse {
  /** 조회 결과 목록 */
  content: PeriodicProductResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /**
   * 다음 페이지 조회용 커서. 없으면 null
   * @format int64
   */
  nextCursor?: number | null;
}

export interface PeriodicProductResponse {
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
}

export interface ApiResponseDailyProductListResponse {
  success: boolean;
  code: string;
  message: string;
  data?: DailyProductListResponse | null;
}

export interface DailyProductListResponse {
  /**
   * 오늘의 특가 상품 총 개수 (= products 길이)
   * @format int32
   */
  totalCount: number;
  /** 오늘의 특가 상품 전체 목록 (최근 등록순) */
  products: DailyProductResponse[];
}

export interface DailyProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL (없으면 null) */
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

export interface ApiResponseFlyerShareResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FlyerShareResponse | null;
}

export interface FlyerShareResponse {
  /**
   * 마트 id
   * @format int64
   */
  marketId: number;
  /** 마트명 */
  marketName: string;
  /** 공유용 URL slug */
  slug: string;
  /** QR코드 이미지 (Base64 인코딩) */
  qrCode: string;
}

export interface ApiResponseCursorSliceResponseNearbyMarketResponse {
  success: boolean;
  code: string;
  message: string;
  data?: CursorSliceResponseNearbyMarketResponse | null;
}

export interface CursorSliceResponseNearbyMarketResponse {
  /** 조회 결과 목록 */
  content: NearbyMarketResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /**
   * 다음 페이지 조회용 커서. 없으면 null
   * @format int64
   */
  nextCursor?: number | null;
}

export interface NearbyMarketResponse {
  /**
   * 마트 id
   * @format int64
   */
  marketId: number;
  /** 마트명 */
  name: string;
  /** 마트 slug */
  slug: string;
  /** 마트 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 마트 기본 주소 */
  address: string;
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
  /** 현재 영업중 여부 */
  isOpen: boolean;
  /**
   * 진행 중인 할인 상품 개수
   * @format int32
   */
  productCount: number;
  /** 미리보기 상품 목록 (최신순 3개) */
  previewProducts: PreviewProductResponse[];
}

export interface PreviewProductResponse {
  /**
   * 상품 id
   * @format int64
   */
  productId: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 이미지 URL (없으면 null) */
  thumbnailUrl?: string | null;
  /**
   * 정가
   * @format int32
   */
  originalPrice: number;
  /**
   * 할인가
   * @format int32
   */
  discountedPrice: number;
  /**
   * 할인율(%). 0이면 할인 없음
   * @format int32
   */
  discountRate: number;
}

export type LoginData = ApiResponseOAuthLoginResponse;

export type GetDetailData = ApiResponseMarketDetailResponse;

export type GetDetail1Data = ApiResponseProductDetailResponse;

export type GetPeriodicDealsData = ApiResponseCursorSliceResponsePeriodicProductResponse;

export type GetDailyProductsData = ApiResponseDailyProductListResponse;

export type GetShareInfoData = ApiResponseFlyerShareResponse;

export type GetNearbyMarketsData = ApiResponseCursorSliceResponseNearbyMarketResponse;
