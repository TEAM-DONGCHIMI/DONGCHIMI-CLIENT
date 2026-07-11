import { afterEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook, waitFor } from '@/test';

import {
  formatDaumPostcodeAdministrativeAddress,
  resolveDaumPostcodeMapAddress,
  useDaumPostcodeSearch,
} from './use-daum-postcode-search';

const postcodeData = {
  address: 'Seoul Mapo Mangwon 123-45',
  bname: 'Mangwon',
  jibunAddress: 'Seoul Mapo Mangwon 123-45',
  roadAddress: 'Seoul Mapo Mangwon-ro 1',
  sido: 'Seoul',
  sigungu: 'Mapo',
};

describe('formatDaumPostcodeAdministrativeAddress', () => {
  it('formats the selected address with administrative district fields', () => {
    expect(formatDaumPostcodeAdministrativeAddress(postcodeData)).toBe('Seoul Mapo Mangwon');
  });

  it('falls back to the full address when administrative district fields are empty', () => {
    expect(
      formatDaumPostcodeAdministrativeAddress({
        ...postcodeData,
        bname: '',
        sido: '',
        sigungu: '',
      }),
    ).toBe('Seoul Mapo Mangwon 123-45');
  });
});

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
  });

  it('opens Daum postcode search and returns search keyword with map address', async () => {
    const open = vi.fn();
    const onSelectAddress = vi.fn();

    class Postcode {
      constructor({
        oncomplete,
      }: {
        oncomplete: (data: Parameters<typeof formatDaumPostcodeAdministrativeAddress>[0]) => void;
      }) {
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
        searchKeyword: 'Seoul Mapo Mangwon',
      });
    });
  });
});
