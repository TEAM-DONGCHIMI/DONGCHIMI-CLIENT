import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  nearbyMarketsSuccessResponseSchema,
  resolveNearbyMarketsLocationParams,
  resolveNearbyMarketsResponse,
  type NearbyMarketsListParamsTypes,
  type NearbyMarketsLocationParamsTypes,
  type NearbyMarketsParamsTypes,
  type NearbyMarketsResponseDataTypes,
} from '../model/nearby-markets-schema';

export type { NearbyMarketsListParamsTypes, NearbyMarketsParamsTypes };

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_RADIUS_METERS = 1000;
const MARKER_PAGE_SIZE = 50;

const toNearbyMarketsSearchParams = ({
  cursor,
  lat,
  lng,
  radius = DEFAULT_RADIUS_METERS,
  size = DEFAULT_PAGE_SIZE,
}: NearbyMarketsLocationParamsTypes) => ({
  cursor,
  lat,
  lng,
  radius,
  size,
});

export const getNearbyMarkets = async (
  rawParams: NearbyMarketsParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  const params = resolveNearbyMarketsLocationParams(rawParams);
  const endpoint = API_ENDPOINTS.user.markets.location(toNearbyMarketsSearchParams(params));
  const response = await httpClient.get<unknown>(endpoint);
  const nearbyMarketsResponse = validateApiResponse(nearbyMarketsSuccessResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseCursorSliceResponseNearbyMarketResponse',
  });

  return resolveNearbyMarketsResponse(nearbyMarketsResponse);
};

export const getNearbyMarketMarkers = async (
  rawParams: NearbyMarketsListParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  return getNearbyMarkets({
    ...rawParams,
    size: rawParams.size ?? MARKER_PAGE_SIZE,
  });
};
