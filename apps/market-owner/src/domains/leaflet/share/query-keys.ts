import type { ApiPathParamTypes } from '@dongchimi/shared/api';

export const leafletShareQueryKeys = {
  all: ['leaflet-share'] as const,
  periodicPreview: (marketId: ApiPathParamTypes) =>
    [...leafletShareQueryKeys.all, 'periodic-preview', marketId] as const,
};
