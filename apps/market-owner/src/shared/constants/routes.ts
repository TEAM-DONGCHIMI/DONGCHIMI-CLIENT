export const MARKET_OWNER_ROUTES = {
  home: '/',
  notFound: '*',
} as const;

export type MarketOwnerRouteTypes = (typeof MARKET_OWNER_ROUTES)[keyof typeof MARKET_OWNER_ROUTES];
