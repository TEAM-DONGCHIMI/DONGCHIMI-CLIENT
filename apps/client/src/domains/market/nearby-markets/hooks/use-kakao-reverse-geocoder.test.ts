import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderHook, waitFor } from '@/test';

import { useKakaoReverseGeocoder } from './use-kakao-reverse-geocoder';

class Geocoder {
  coord2Address(
    lng: number,
    lat: number,
    callback: (
      result: {
        address: { address_name: string } | null;
        road_address: { address_name: string } | null;
      }[],
      status: string,
    ) => void,
  ) {
    if (lat === 0 && lng === 0) {
      callback([], 'ZERO_RESULT');

      return;
    }

    callback(
      [
        {
          address: { address_name: '서울 마포구 망원동 123-45' },
          road_address: { address_name: '서울 마포구 망원로 1' },
        },
      ],
      'OK',
    );
  }
}

describe('useKakaoReverseGeocoder', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves the road address for the current coordinates and notifies the caller', async () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onAddressChange = vi.fn();

    const { rerender, result } = renderHook(() =>
      useKakaoReverseGeocoder({
        coordinates: { lat: 37.5665, lng: 126.978 },
        onAddressChange,
        ready: true,
      }),
    );

    await waitFor(() => {
      expect(result.current.address).toBe('서울 마포구 망원로 1');
      expect(onAddressChange).toHaveBeenCalledWith('서울 마포구 망원로 1');
    });

    rerender();

    expect(onAddressChange).toHaveBeenCalledTimes(1);
  });

  it('reports null and clears the address when the coordinates cannot be reverse-geocoded', async () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onAddressChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoReverseGeocoder({
        coordinates: { lat: 0, lng: 0 },
        onAddressChange,
        ready: true,
      }),
    );

    await waitFor(() => {
      expect(result.current.address).toBeNull();
      expect(onAddressChange).toHaveBeenCalledWith(null);
    });
  });

  it('does nothing while not ready', () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onAddressChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoReverseGeocoder({
        coordinates: { lat: 37.5665, lng: 126.978 },
        onAddressChange,
        ready: false,
      }),
    );

    expect(result.current.address).toBeNull();
    expect(onAddressChange).not.toHaveBeenCalled();
  });

  it('does nothing when coordinates are null', () => {
    vi.stubGlobal('kakao', { maps: { services: { Geocoder, Status: { OK: 'OK' } } } });
    const onAddressChange = vi.fn();

    const { result } = renderHook(() =>
      useKakaoReverseGeocoder({
        coordinates: null,
        onAddressChange,
        ready: true,
      }),
    );

    expect(result.current.address).toBeNull();
    expect(onAddressChange).not.toHaveBeenCalled();
  });
});
