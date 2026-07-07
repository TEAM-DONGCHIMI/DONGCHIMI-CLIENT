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
  /** 소셜 제공자로부터 발급받은 access token */
  accessToken: string;
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

export type LoginData = ApiResponseOAuthLoginResponse;
