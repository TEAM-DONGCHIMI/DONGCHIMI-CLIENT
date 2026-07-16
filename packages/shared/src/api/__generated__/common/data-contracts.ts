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

export interface PresignedUploadRequest {
  /**
   * 업로드 용도
   * @example "product_thumbnail"
   */
  purpose: string;
  /**
   * 업로드할 파일의 Content-Type
   * @example "image/jpeg"
   */
  contentType: string;
  /**
   * 업로드할 파일 크기(바이트)
   * @format int64
   * @example 1048576
   */
  contentLength: number;
}

export interface PresignedUploadsRequest {
  /** 발급할 업로드 URL 목록 */
  uploads: PresignedUploadRequest[];
}

export interface ApiResponsePresignedUploadsResponse {
  success: boolean;
  code: string;
  message: string;
  data?: PresignedUploadsResponse | null;
}

export interface PresignedUploadResponse {
  /** S3에 직접 PUT할 업로드 URL */
  uploadUrl: string;
  /** 임시 저장 경로(tmp key). 리소스 확정 요청 시 그대로 되돌려줘야 한다 */
  objectKey: string;
  /**
   * 업로드 URL 만료 시각
   * @format date-time
   */
  expiresAt: string;
  /** PUT 요청 시 그대로 실어야 하는 헤더 */
  requiredHeaders: Record<string, string>;
}

export interface PresignedUploadsResponse {
  /** 발급된 업로드 URL 목록 */
  uploads: PresignedUploadResponse[];
}

export interface ApiResponsePresignedUploadResponse {
  success: boolean;
  code: string;
  message: string;
  data?: PresignedUploadResponse | null;
}

export interface ApiResponseReissueTokenResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ReissueTokenResponse | null;
}

export interface ReissueTokenResponse {
  /** 동치미 서비스 access token (JWT) */
  accessToken: string;
}

export interface ApiResponseUnit {
  success: boolean;
  code: string;
  message: string;
}

export type CreatePresignedUrlsData = ApiResponsePresignedUploadsResponse;

export type CreatePresignedUrlData = ApiResponsePresignedUploadResponse;

export type ReissueData = ApiResponseReissueTokenResponse;

export type LogoutData = ApiResponseUnit;
