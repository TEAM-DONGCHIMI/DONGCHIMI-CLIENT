export const homeQueryKeys = {
  all: ['home'] as const,
  ownerHome: () => [...homeQueryKeys.all, 'owner-home'] as const,
};
