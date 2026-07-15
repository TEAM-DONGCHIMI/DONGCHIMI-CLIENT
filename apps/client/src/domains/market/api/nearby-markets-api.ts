import { buildApiPath, validateApiResponse } from '@dongchimi/shared/api';

import { browserApi } from '@/shared/api';

import {
  nearbyMarketsSuccessResponseSchema,
  resolveNearbyMarketsLocationParams,
  resolveNearbyMarketsResponse,
  type NearbyMarketsListParamsTypes,
  type NearbyMarketsLocationParamsTypes,
  type NearbyMarketsResponseDataTypes,
} from '../model/nearby-markets-schema';

export type { NearbyMarketsListParamsTypes, NearbyMarketsLocationParamsTypes };

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_RADIUS_METERS = 1000;
const MARKER_PAGE_SIZE = 50;
const NEARBY_MARKETS_API_ROUTE = 'markets/location';

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
  rawParams: NearbyMarketsLocationParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  const params = resolveNearbyMarketsLocationParams(rawParams);
  const endpoint = buildApiPath(NEARBY_MARKETS_API_ROUTE, toNearbyMarketsSearchParams(params));
  const response = await browserApi.get<unknown>(endpoint);
  const nearbyMarketsResponse = validateApiResponse(nearbyMarketsSuccessResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseCursorSliceResponseNearbyMarketResponse',
  });

  return resolveNearbyMarketsResponse(nearbyMarketsResponse);
};

export const getNearbyMarketMarkers = async (
  rawParams: NearbyMarketsLocationParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  return getNearbyMarkets({
    ...rawParams,
    size: rawParams.size ?? MARKER_PAGE_SIZE,
  });
};
