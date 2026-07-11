import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderHook, waitFor } from '@/test';

import { useKakaoAddressGeocoder } from './use-kakao-address-geocoder';

class Geocoder {
  addressSearch(
    address: string,
    callback: (result: { x: string; y: string }[], status: string) => void,
  ) {
    if (address === 'invalid address') {
      callback([], 'ZERO_RESULT');

      return;
    }

    callback([{ x: '126.978', y: '37.5665' }], 'OK');
  }
}

describe('useKakaoAddressGeocoder', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves coordinates for a geocoded address and notifies the caller', async () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onCoordinatesChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoAddressGeocoder({ address: '서울시청', onCoordinatesChange, ready: true }),
    );

    await waitFor(() => {
      expect(result.current.coordinates).toEqual({ lat: 37.5665, lng: 126.978 });
      expect(result.current.isError).toBe(false);
      expect(onCoordinatesChange).toHaveBeenCalledWith({ lat: 37.5665, lng: 126.978 });
    });
  });

  it('reports an error and clears coordinates when the address cannot be geocoded', async () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onCoordinatesChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoAddressGeocoder({ address: 'invalid address', onCoordinatesChange, ready: true }),
    );

    await waitFor(() => {
      expect(result.current.coordinates).toBeNull();
      expect(result.current.isError).toBe(true);
      expect(onCoordinatesChange).toHaveBeenCalledWith(null);
    });
  });

  it('does nothing while not ready', () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onCoordinatesChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoAddressGeocoder({ address: '서울시청', onCoordinatesChange, ready: false }),
    );

    expect(result.current.coordinates).toBeNull();
    expect(onCoordinatesChange).not.toHaveBeenCalled();
  });
});
