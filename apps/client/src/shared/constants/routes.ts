const encodeRouteSegment = (segment: string) => encodeURIComponent(segment);

export const CLIENT_ROUTES = {
  login: '/login',
  market: (marketSlug: string) => `/markets/${encodeRouteSegment(marketSlug)}`,
  marketProduct: (marketSlug: string, productId: string) =>
    `/markets/${encodeRouteSegment(marketSlug)}/products/${encodeRouteSegment(productId)}`,
  markets: '/markets',
  oauthCallback: '/oauth/callback',
  root: '/',
} as const;
