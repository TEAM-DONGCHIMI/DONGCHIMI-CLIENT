import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMarketAddressSearch } from './use-market-address-search';

describe('useMarketAddressSearch', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_KAKAO_MAP_APP_KEY', 'test-javascript-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    document.getElementById('daum-postcode-script')?.remove();
    document.getElementById('kakao-map-services-script')?.remove();
  });

  it('returns the selected road address with Kakao coordinates', async () => {
    class Postcode {
      constructor({ oncomplete }: { oncomplete: (data: object) => void }) {
        oncomplete({
          address: '서울특별시 중구 세종대로 110',
          jibunAddress: '서울특별시 중구 태평로1가 31',
          roadAddress: '서울특별시 중구 세종대로 110',
        });
      }

      open = vi.fn();
    }

    class Geocoder {
      addressSearch(
        address: string,
        callback: (results: { x: string; y: string }[], status: string) => void,
      ) {
        expect(address).toBe('서울특별시 중구 세종대로 110');
        callback([{ x: '126.978', y: '37.5665' }], 'OK');
      }
    }

    vi.stubGlobal('daum', { Postcode });
    vi.stubGlobal('kakao', {
      maps: { services: { Geocoder, Status: { OK: 'OK' } } },
    });

    const { result } = renderHook(() => useMarketAddressSearch());

    await expect(
      act(async () => {
        return result.current();
      }),
    ).resolves.toEqual({
      address: '서울특별시 중구 세종대로 110',
      latitude: 37.5665,
      longitude: 126.978,
    });
  });

  it('rejects when Kakao returns no matching coordinates', async () => {
    class Postcode {
      constructor({ oncomplete }: { oncomplete: (data: object) => void }) {
        oncomplete({ address: '검색되지 않는 주소', jibunAddress: '', roadAddress: '' });
      }

      open = vi.fn();
    }

    class Geocoder {
      addressSearch(
        _address: string,
        callback: (results: { x: string; y: string }[], status: string) => void,
      ) {
        callback([], 'ZERO_RESULT');
      }
    }

    vi.stubGlobal('daum', { Postcode });
    vi.stubGlobal('kakao', {
      maps: { services: { Geocoder, Status: { OK: 'OK' } } },
    });

    const { result } = renderHook(() => useMarketAddressSearch());

    await expect(
      act(async () => {
        return result.current();
      }),
    ).rejects.toThrow('Address search service is unavailable');
  });
});
