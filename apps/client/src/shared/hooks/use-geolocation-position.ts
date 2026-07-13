import type { CoordinatesTypes, GeolocationErrorCodeTypes } from './use-geolocation.types';

type RequestCurrentPositionParamsTypes = Readonly<{
  enableHighAccuracy: boolean;
  isActive: () => boolean;
  onError: (errorCode: GeolocationErrorCodeTypes) => void;
  onStart: () => void;
  onSuccess: (coordinates: CoordinatesTypes) => void;
  timeout: number;
}>;

const GEOLOCATION_ERROR_CODES: Record<number, GeolocationErrorCodeTypes> = {
  1: 'PERMISSION_DENIED',
  2: 'POSITION_UNAVAILABLE',
  3: 'TIMEOUT',
};

const getGeolocationPermissionState = async (): Promise<PermissionState | null> => {
  if (!navigator.permissions?.query) {
    return null;
  }

  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

    return permissionStatus.state;
  } catch {
    return null;
  }
};

const toCoordinates = (position: GeolocationPosition): CoordinatesTypes => {
  return { lat: position.coords.latitude, lng: position.coords.longitude };
};

const toGeolocationErrorCode = (error: GeolocationPositionError): GeolocationErrorCodeTypes => {
  return GEOLOCATION_ERROR_CODES[error.code] ?? 'POSITION_UNAVAILABLE';
};

const createPositionOptions = ({
  enableHighAccuracy,
  permissionState,
  timeout,
}: Pick<RequestCurrentPositionParamsTypes, 'enableHighAccuracy' | 'timeout'> & {
  permissionState: PermissionState | null;
}): PositionOptions => {
  const options: PositionOptions = { enableHighAccuracy };

  if (permissionState !== 'prompt') {
    options.timeout = timeout;
  }

  return options;
};

export const requestCurrentPosition = async ({
  enableHighAccuracy,
  isActive,
  onError,
  onStart,
  onSuccess,
  timeout,
}: RequestCurrentPositionParamsTypes) => {
  const permissionState = await getGeolocationPermissionState();

  if (!isActive()) {
    return;
  }

  onStart();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!isActive()) {
        return;
      }

      onSuccess(toCoordinates(position));
    },
    (error) => {
      if (!isActive()) {
        return;
      }

      onError(toGeolocationErrorCode(error));
    },
    createPositionOptions({ enableHighAccuracy, permissionState, timeout }),
  );
};
