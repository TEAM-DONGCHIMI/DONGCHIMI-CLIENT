export type GeolocationErrorCodeTypes =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED';

export type UseGeolocationOptionsTypes = Readonly<{
  enableHighAccuracy?: boolean;
  timeout?: number;
}>;

export type CoordinatesTypes = Readonly<{
  lat: number;
  lng: number;
}>;

export type UseGeolocationResultTypes = Readonly<{
  coordinates: CoordinatesTypes | null;
  errorCode: GeolocationErrorCodeTypes | null;
  isLoading: boolean;
  retry: () => void;
}>;
