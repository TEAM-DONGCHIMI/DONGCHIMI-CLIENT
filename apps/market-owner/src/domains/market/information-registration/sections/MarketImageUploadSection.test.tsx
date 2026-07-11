import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MarketImageUploadSection } from './MarketImageUploadSection';
import type { MarketImageUploadErrorTypes } from './MarketImageUploadSection';

const renderSection = ({
  onImageError = vi.fn<(error: MarketImageUploadErrorTypes) => void>(),
  onImageSelect = vi.fn<(file: File) => Promise<void> | void>(),
}: {
  onImageError?: (error: MarketImageUploadErrorTypes) => void;
  onImageSelect?: (file: File) => Promise<void> | void;
} = {}) => {
  render(<MarketImageUploadSection onImageError={onImageError} onImageSelect={onImageSelect} />);

  return {
    fileInput: screen.getByLabelText('마트 이미지 추가'),
    onImageError,
    onImageSelect,
  };
};

describe('MarketImageUploadSection', () => {
  it('JPG, JPEG, PNG가 아닌 파일을 거부한다', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { fileInput, onImageError, onImageSelect } = renderSection();
    const invalidFile = new File(['image'], 'market.webp', { type: 'image/webp' });

    await user.upload(fileInput, invalidFile);

    expect(onImageError).toHaveBeenCalledWith('type');
    expect(onImageSelect).not.toHaveBeenCalled();
  });

  it('10MB를 초과한 이미지를 거부한다', async () => {
    const user = userEvent.setup();
    const { fileInput, onImageError, onImageSelect } = renderSection();
    const oversizedFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'market.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, oversizedFile);

    expect(onImageError).toHaveBeenCalledWith('size');
    expect(onImageSelect).not.toHaveBeenCalled();
  });

  it('이미지 처리 callback이 실패하면 업로드 오류를 전달한다', async () => {
    const user = userEvent.setup();
    const onImageSelect = vi.fn().mockRejectedValue(new Error('upload failed'));
    const { fileInput, onImageError } = renderSection({ onImageSelect });
    const imageFile = new File(['image'], 'market.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, imageFile);

    expect(onImageError).toHaveBeenCalledWith('upload');
  });
});
