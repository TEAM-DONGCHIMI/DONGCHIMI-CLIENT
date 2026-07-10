import { paginateByCursor, wait } from '@/shared/utils';

import {
  resolveNearbyMarketsParams,
  resolveNearbyMarketsResponse,
  type NearbyMarketDtoTypes,
  type NearbyMarketsListParamsTypes,
  type NearbyMarketsParamsTypes,
  type NearbyMarketsResponseDataTypes,
} from '../model/nearby-markets-schema';
import { MOCK_NEARBY_MARKETS } from './nearby-markets-api.mock';

export type { NearbyMarketsListParamsTypes, NearbyMarketsParamsTypes };

const DEFAULT_PAGE_SIZE = 5;
const MOCK_NETWORK_DELAY_MS = 400;
const MOCK_SUCCESS_CODE = 'SUCCESS';
const MOCK_SUCCESS_MESSAGE = '요청에 성공했습니다.';
const EARTH_RADIUS_METERS = 6371000;

const filterMarketsByKeyword = (
  markets: readonly NearbyMarketDtoTypes[],
  keyword?: string,
): NearbyMarketDtoTypes[] => {
  const normalizedKeyword = keyword?.trim().toLowerCase();

  if (!normalizedKeyword) {
    return [...markets];
  }

  return markets.filter(
    (market) =>
      market.name.toLowerCase().includes(normalizedKeyword) ||
      market.address.toLowerCase().includes(normalizedKeyword),
  );
};

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const calculateDistanceMeters = (
  origin: { lat: number; lng: number },
  market: NearbyMarketDtoTypes,
): number => {
  const deltaLat = toRadians(market.latitude - origin.lat);
  const deltaLng = toRadians(market.longitude - origin.lng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(market.latitude)) *
      Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const sortMarketsByDistance = (
  markets: readonly NearbyMarketDtoTypes[],
  origin: { lat: number; lng: number },
): NearbyMarketDtoTypes[] => {
  return [...markets].sort(
    (marketA, marketB) =>
      calculateDistanceMeters(origin, marketA) - calculateDistanceMeters(origin, marketB),
  );
};

export const getNearbyMarkets = async (
  rawParams: NearbyMarketsParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  const {
    cursor,
    keyword,
    lat,
    lng,
    size = DEFAULT_PAGE_SIZE,
  } = resolveNearbyMarketsParams(rawParams);

  await wait(MOCK_NETWORK_DELAY_MS);

  const filteredMarkets = filterMarketsByKeyword(MOCK_NEARBY_MARKETS, keyword);
  const sortedMarkets =
    lat === undefined || lng === undefined
      ? filteredMarkets
      : sortMarketsByDistance(filteredMarkets, { lat, lng });
  const page = paginateByCursor(sortedMarkets, { cursor, pageSize: size });

  return resolveNearbyMarketsResponse({
    code: MOCK_SUCCESS_CODE,
    data: {
      contents: page.items,
      hasNext: page.nextCursor !== null,
      nextCursor: page.nextCursor,
    },
    message: MOCK_SUCCESS_MESSAGE,
    success: true,
  });
};
