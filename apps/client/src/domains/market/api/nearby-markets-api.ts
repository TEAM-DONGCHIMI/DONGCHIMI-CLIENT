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

// TODO: 백엔드 주변 마트 목록 endpoint가 나오면 httpClient.get 호출로 교체합니다.
export const getNearbyMarkets = async (
  rawParams: NearbyMarketsParamsTypes,
): Promise<NearbyMarketsResponseDataTypes> => {
  const { cursor, keyword, pageSize = DEFAULT_PAGE_SIZE } = resolveNearbyMarketsParams(rawParams);

  await wait(MOCK_NETWORK_DELAY_MS);

  const filteredMarkets = filterMarketsByKeyword(MOCK_NEARBY_MARKETS, keyword);
  const page = paginateByCursor(filteredMarkets, { cursor, pageSize });

  return resolveNearbyMarketsResponse({
    code: MOCK_SUCCESS_CODE,
    data: {
      hasNext: page.nextCursor !== null,
      markets: page.items,
      nextCursor: page.nextCursor,
      totalCount: filteredMarkets.length,
    },
    message: MOCK_SUCCESS_MESSAGE,
    success: true,
  });
};
