export const MARKET_OWNER_ROUTES = {
  eventDiscountEdit: '/products/event-discount/edit',
  eventDiscountRegistration: '/products/event-discount/new',
  home: '/',
  leafletShare: '/leaflets/share',
  login: '/login',
  marketInformationRegistration: '/markets/information-registration',
  notFound: '*',
  registrationResult: '/products/registration-result',
  signup: '/signup',
  todaySpecialEdit: '/products/today-special/edit',
  todaySpecialRegistration: '/products/today-special/new',
} as const;

export type MarketOwnerRouteTypes = (typeof MARKET_OWNER_ROUTES)[keyof typeof MARKET_OWNER_ROUTES];
