import { afterEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook, waitFor } from '@/test';

import {
  formatDaumPostcodeAdministrativeAddress,
  useDaumPostcodeSearch,
} from './use-daum-postcode-search';

describe('formatDaumPostcodeAdministrativeAddress', () => {
  it('formats the selected address with administrative district fields', () => {
    expect(
      formatDaumPostcodeAdministrativeAddress({
        address: '서울특별시 마포구 망원동 123-45',
        bname: '망원동',
        sido: '서울특별시',
        sigungu: '마포구',
      }),
    ).toBe('서울특별시 마포구 망원동');
  });

  it('falls back to the full address when administrative district fields are empty', () => {
    expect(
      formatDaumPostcodeAdministrativeAddress({
        address: '서울특별시 마포구 망원동 123-45',
        bname: '',
        sido: '',
        sigungu: '',
      }),
    ).toBe('서울특별시 마포구 망원동 123-45');
  });
});

describe('useDaumPostcodeSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens Daum postcode search and returns the selected administrative address', async () => {
    const open = vi.fn();
    const onSelectAdministrativeAddress = vi.fn();

    class Postcode {
      constructor({
        oncomplete,
      }: {
        oncomplete: (data: Parameters<typeof formatDaumPostcodeAdministrativeAddress>[0]) => void;
      }) {
        oncomplete({
          address: '서울특별시 마포구 망원동 123-45',
          bname: '망원동',
          sido: '서울특별시',
          sigungu: '마포구',
        });
      }

      open = open;
    }

    vi.stubGlobal('daum', { Postcode });

    const { result } = renderHook(() =>
      useDaumPostcodeSearch({
        enabled: true,
        onSelectAdministrativeAddress,
      }),
    );

    act(() => {
      result.current();
    });

    await waitFor(() => {
      expect(open).toHaveBeenCalledTimes(1);
      expect(onSelectAdministrativeAddress).toHaveBeenCalledWith('서울특별시 마포구 망원동');
    });
  });
});
