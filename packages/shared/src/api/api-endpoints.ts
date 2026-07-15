export type ApiPathParamTypes = number | string;
export type ApiSearchParamPrimitiveTypes = boolean | number | string;
export type ApiSearchParamValueTypes =
  | ApiSearchParamPrimitiveTypes
  | null
  | undefined
  | readonly (ApiSearchParamPrimitiveTypes | null | undefined)[];
export type ApiSearchParamsTypes = Record<string, ApiSearchParamValueTypes>;

export interface OwnerDraftProductsSearchParamsTypes extends ApiSearchParamsTypes {
  category?: string;
  page?: number;
  search?: string;
  size?: number;
}

export type OwnerProductListTypeTypes = 'DAILY' | 'PERIODIC';
export type OwnerProductSortTypes = 'CATEGORY' | 'LATEST' | 'VIEW_COUNT';

export interface OwnerProductsSearchParamsTypes extends ApiSearchParamsTypes {
  sort?: OwnerProductSortTypes;
  type?: OwnerProductListTypeTypes;
}

export interface OwnerProductSearchParamsTypes extends ApiSearchParamsTypes {
  keyword: string;
  size?: number;
}

export interface UserMarketLocationSearchParamsTypes extends ApiSearchParamsTypes {
  lat: number;
  lng: number;
}

export interface UserPeriodicProductsSearchParamsTypes extends ApiSearchParamsTypes {
  category?: string;
  cursor?: number;
  size?: number;
}

const encodePathParam = (value: ApiPathParamTypes) => {
  return encodeURIComponent(String(value));
};

export const buildApiPath = (pathname: string, searchParams?: ApiSearchParamsTypes) => {
  if (!searchParams) {
    return pathname;
  }

  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      if (item === null || item === undefined) {
        return;
      }

      params.append(key, String(item));
    });
  });

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const API_ENDPOINTS = {
  common: {
    auth: {
      refresh: '/v1/auth/token/refresh',
    },
    uploads: {
      presignedUrl: '/v1/uploads/presigned-url',
    },
  },
  owner: {
    auth: {
      login: '/v1/owners/auth/login',
      signup: '/v1/owners/auth/signup',
    },
    flyers: {
      dailyPreview: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/flyers/preview/daily`,
      periodicPreview: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/flyers/preview/periodic`,
      publish: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/flyers`,
      qr: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/flyers/qr`,
    },
    home: '/v1/owners/home',
    markets: {
      detail: (marketId: ApiPathParamTypes) => `/v1/owners/markets/${encodePathParam(marketId)}`,
      root: '/v1/owners/markets',
    },
    products: {
      all: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/all`,
      collection: (marketId: ApiPathParamTypes, searchParams?: OwnerProductsSearchParamsTypes) =>
        buildApiPath(`/v1/owners/markets/${encodePathParam(marketId)}/products`, searchParams),
      daily: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/daily`,
      detail: (marketId: ApiPathParamTypes, productId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/${encodePathParam(productId)}`,
      discountPeriod: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/discount-period`,
      draft: (marketId: ApiPathParamTypes, searchParams?: OwnerDraftProductsSearchParamsTypes) =>
        buildApiPath(
          `/v1/owners/markets/${encodePathParam(marketId)}/products/draft`,
          searchParams,
        ),
      import: (marketId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/import`,
      importCancel: (marketId: ApiPathParamTypes, jobId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/import/${encodePathParam(jobId)}/cancel`,
      importProgress: (marketId: ApiPathParamTypes, jobId: ApiPathParamTypes) =>
        `/v1/owners/markets/${encodePathParam(marketId)}/products/import/${encodePathParam(jobId)}/progress`,
      search: (marketId: ApiPathParamTypes, searchParams: OwnerProductSearchParamsTypes) =>
        buildApiPath(
          `/v1/owners/markets/${encodePathParam(marketId)}/products/search`,
          searchParams,
        ),
    },
  },
  user: {
    auth: {
      socialLogin: (provider: ApiPathParamTypes) =>
        `/v1/users/login/oauth2/${encodePathParam(provider)}`,
    },
    flyers: {
      shared: (marketId: ApiPathParamTypes) =>
        `/v1/users/markets/${encodePathParam(marketId)}/flyers`,
    },
    markets: {
      detail: (slug: ApiPathParamTypes) => `/v1/users/markets/${encodePathParam(slug)}`,
      location: (searchParams: UserMarketLocationSearchParamsTypes) =>
        buildApiPath('/v1/users/markets/location', searchParams),
    },
    products: {
      daily: (marketId: ApiPathParamTypes) =>
        `/v1/users/markets/${encodePathParam(marketId)}/products/daily`,
      detail: (marketId: ApiPathParamTypes, productId: ApiPathParamTypes) =>
        `/v1/users/markets/${encodePathParam(marketId)}/products/${encodePathParam(productId)}`,
      periodic: (
        marketId: ApiPathParamTypes,
        searchParams?: UserPeriodicProductsSearchParamsTypes,
      ) =>
        buildApiPath(
          `/v1/users/markets/${encodePathParam(marketId)}/products/periodic`,
          searchParams,
        ),
    },
  },
} as const;
