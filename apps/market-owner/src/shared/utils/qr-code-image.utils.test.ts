import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadQrCodeImage, getQrCodeImageSource } from './qr-code-image.utils';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getQrCodeImageSource', () => {
  it('adds a PNG data URL prefix to a raw Base64 value', () => {
    expect(getQrCodeImageSource('base64-value')).toBe('data:image/png;base64,base64-value');
  });

  it('keeps an image data URL unchanged', () => {
    const dataUrl = 'data:image/png;base64,base64-value';

    expect(getQrCodeImageSource(dataUrl)).toBe(dataUrl);
  });
});

describe('downloadQrCodeImage', () => {
  it('clicks a download link with the QR image source', () => {
    const click = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      download: '',
      href: '',
    } as unknown as HTMLAnchorElement);

    downloadQrCodeImage('data:image/png;base64,base64-value', 'market-leaflet-qr.png');

    const downloadLink = createElementSpy.mock.results[0]?.value as HTMLAnchorElement;
    expect(downloadLink.download).toBe('market-leaflet-qr.png');
    expect(downloadLink.href).toBe('data:image/png;base64,base64-value');
    expect(click).toHaveBeenCalledOnce();
  });
});
