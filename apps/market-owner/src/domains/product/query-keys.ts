export const productQueryKeys = {
  all: ['product'] as const,
  search: ['product', 'search'] as const,
  detail: ['product', 'detail'] as const,
  list: ['product', 'list'] as const,
} as const;
