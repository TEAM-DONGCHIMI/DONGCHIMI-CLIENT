import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MarketImageUploadSection } from './MarketImageUploadSection';
import type { MarketImageUploadErrorTypes } from './MarketImageUploadSection';

const renderSection = ({
  initialImageUrl,
  onImageError = vi.fn<(error: MarketImageUploadErrorTypes) => void>(),
  onImageSelect = vi.fn<(file: File) => Promise<void> | void>(),
}: {
  initialImageUrl?: string;
  onImageError?: (error: MarketImageUploadErrorTypes) => void;
  onImageSelect?: (file: File) => Promise<void> | void;
} = {}) => {
  render(
    <MarketImageUploadSection
      initialImageUrl={initialImageUrl}
      onImageError={onImageError}
      onImageSelect={onImageSelect}
    />,
  );

  return {
    fileInput: document.querySelector<HTMLInputElement>('input[type="file"]')!,
    onImageError,
    onImageSelect,
  };
};

describe('MarketImageUploadSection', () => {
  it('기존 마트 썸네일을 초기 미리보기로 표시한다', () => {
    renderSection({ initialImageUrl: 'https://cdn.example.com/market.png' });

    expect(screen.getByRole('img', { name: '선택한 마트 이미지' })).toHaveAttribute(
      'src',
      'https://cdn.example.com/market.png',
    );
    expect(screen.getByRole('button', { name: '마트 이미지 변경' })).toBeInTheDocument();
  });

  it('기존 마트 썸네일을 불러오지 못하면 이미지 추가 상태로 복구한다', () => {
    renderSection({ initialImageUrl: 'https://cdn.example.com/broken.png' });

    fireEvent.error(screen.getByRole('img', { name: '선택한 마트 이미지' }));

    expect(screen.getByLabelText('마트 이미지 추가')).toBeInTheDocument();
  });

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

  it('이미지를 선택하면 변경 camera 버튼을 표시한다', async () => {
    const user = userEvent.setup();
    const { fileInput } = renderSection();
    const imageFile = new File(['image'], 'market.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, imageFile);

    expect(screen.getByRole('button', { name: '마트 이미지 변경' })).toBeInTheDocument();
  });
});
