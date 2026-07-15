export const marketQueryKeys = {
  all: ['markets'] as const,
  detail: (marketId?: number) => [...marketQueryKeys.all, 'detail', marketId] as const,
};
