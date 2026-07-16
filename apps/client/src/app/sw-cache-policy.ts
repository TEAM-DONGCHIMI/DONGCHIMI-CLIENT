const NON_CACHEABLE_DIRECTIVES = ['no-store', 'private'] as const;

export const isPublicCacheableResponse = (response: Response) => {
  if (response.status !== 200) {
    return false;
  }

  const cacheControl = response.headers.get('cache-control')?.toLowerCase() ?? '';

  return NON_CACHEABLE_DIRECTIVES.every((directive) => !cacheControl.includes(directive));
};
