import type { NearbyMarketDtoTypes } from '../../model/nearby-markets-schema';

const hasRegisteredProducts = (market: NearbyMarketDtoTypes) => {
  return market.productCount > 0;
};

export const filterVisibleNearbyMarkets = (
  markets: NearbyMarketDtoTypes[],
): NearbyMarketDtoTypes[] => {
  return markets.filter(hasRegisteredProducts);
};

export const getPrioritizedVisibleNearbyMarkets = (
  markets: NearbyMarketDtoTypes[],
): NearbyMarketDtoTypes[] => {
  return filterVisibleNearbyMarkets(markets).sort((currentMarket, nextMarket) => {
    if (currentMarket.isOpen === nextMarket.isOpen) {
      return 0;
    }

    return currentMarket.isOpen ? -1 : 1;
  });
};
