export const productQueryKeys = {
  all: ['product'] as const,
  detail: ['product', 'detail'] as const,
  list: ['product', 'list'] as const,
  listByMarket: (marketId: number) => ['product', 'list', marketId] as const,
} as const;
