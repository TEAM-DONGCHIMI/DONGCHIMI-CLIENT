import type {
  NearbyMarketsListParamsTypes,
  NearbyMarketsLocationParamsTypes,
} from '../api/nearby-markets-api';

const isFiniteCoordinate = (coordinate: unknown): coordinate is number => {
  return Number.isFinite(coordinate);
};

export const hasNearbyMarketsLocationParams = (
  params: NearbyMarketsListParamsTypes,
): params is NearbyMarketsLocationParamsTypes => {
  return isFiniteCoordinate(params.lat) && isFiniteCoordinate(params.lng);
};
