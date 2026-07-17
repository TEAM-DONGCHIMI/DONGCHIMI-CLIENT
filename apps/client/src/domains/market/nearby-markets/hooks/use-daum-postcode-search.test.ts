import { afterEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook, waitFor } from '@/test';

import { resolveDaumPostcodeMapAddress, useDaumPostcodeSearch } from './use-daum-postcode-search';

const postcodeData = {
  address: 'Seoul Mapo Mangwon 123-45',
  jibunAddress: 'Seoul Mapo Mangwon 123-45',
  roadAddress: 'Seoul Mapo Mangwon-ro 1',
};

describe('resolveDaumPostcodeMapAddress', () => {
  it('uses road address first for map geocoding', () => {
    expect(resolveDaumPostcodeMapAddress(postcodeData)).toBe('Seoul Mapo Mangwon-ro 1');
  });

  it('falls back to the main address when road address is empty', () => {
    expect(resolveDaumPostcodeMapAddress({ ...postcodeData, roadAddress: '' })).toBe(
      'Seoul Mapo Mangwon 123-45',
    );
  });
});

describe('useDaumPostcodeSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.getElementById('daum-postcode-script')?.remove();
  });

  it('opens Daum postcode search and returns the clicked address text as the search keyword', async () => {
    const open = vi.fn();
    const onSelectAddress = vi.fn();

    class Postcode {
      constructor({ oncomplete }: { oncomplete: (data: typeof postcodeData) => void }) {
        oncomplete(postcodeData);
      }

      open = open;
    }

    vi.stubGlobal('daum', { Postcode });

    const { result } = renderHook(() =>
      useDaumPostcodeSearch({
        enabled: true,
        onSelectAddress,
      }),
    );

    act(() => {
      result.current();
    });

    await waitFor(() => {
      expect(open).toHaveBeenCalledTimes(1);
      expect(onSelectAddress).toHaveBeenCalledWith({
        mapAddress: 'Seoul Mapo Mangwon-ro 1',
        searchKeyword: 'Seoul Mapo Mangwon 123-45',
      });
    });
  });

  it('calls onError when Postcode is unavailable once the script has loaded', async () => {
    const onError = vi.fn();
    const onSelectAddress = vi.fn();

    class Postcode {
      open = vi.fn();
    }

    const daumStub: { Postcode: typeof Postcode | null } = { Postcode };

    vi.stubGlobal('daum', daumStub);

    const { result } = renderHook(() =>
      useDaumPostcodeSearch({
        enabled: true,
        onError,
        onSelectAddress,
      }),
    );

    act(() => {
      result.current();
      daumStub.Postcode = null;
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });

    expect(onError).toHaveBeenCalledWith(new Error('Daum postcode constructor is unavailable'));
    expect(onSelectAddress).not.toHaveBeenCalled();
  });

  it('does not call onSelectAddress or onError when disabled', () => {
    const onError = vi.fn();
    const onSelectAddress = vi.fn();

    const { result } = renderHook(() =>
      useDaumPostcodeSearch({
        enabled: false,
        onError,
        onSelectAddress,
      }),
    );

    act(() => {
      result.current();
    });

    expect(onSelectAddress).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('passes the load failure to onError when the postcode script fails to load', async () => {
    const onError = vi.fn();
    const onSelectAddress = vi.fn();

    vi.stubGlobal('daum', undefined);

    renderHook(() =>
      useDaumPostcodeSearch({
        enabled: true,
        onError,
        onSelectAddress,
      }),
    );

    const script = document.getElementById('daum-postcode-script');

    act(() => {
      script?.dispatchEvent(new Event('error'));
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(new Error('Failed to load Daum postcode script'));
    });

    expect(onSelectAddress).not.toHaveBeenCalled();
  });
});
