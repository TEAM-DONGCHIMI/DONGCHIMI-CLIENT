const encodeRouteSegment = (segment: string) => encodeURIComponent(segment);

export const CLIENT_ROUTES = {
  login: '/login',
  market: (marketId: string) => `/markets/${encodeRouteSegment(marketId)}`,
  marketProduct: (marketId: string, productId: string) =>
    `/markets/${encodeRouteSegment(marketId)}/products/${encodeRouteSegment(productId)}`,
  markets: '/markets',
  oauthCallback: '/oauth/callback',
  root: '/',
} as const;
