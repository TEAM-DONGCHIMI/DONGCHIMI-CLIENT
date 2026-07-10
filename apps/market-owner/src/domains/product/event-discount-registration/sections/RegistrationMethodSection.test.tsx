import { render, screen, userEvent } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { RegistrationMethodSection } from './RegistrationMethodSection';

const defaultProps = {
  onDownloadExcelTemplate: vi.fn(),
  onOpenExcelUpload: vi.fn(),
  onOpenPosGuide: vi.fn(),
  onUploadLeaflet: vi.fn(),
};

const renderRegistrationMethodSection = (
  props: Partial<Parameters<typeof RegistrationMethodSection>[0]> = {},
) => {
  return render(<RegistrationMethodSection {...defaultProps} {...props} />);
};

describe('RegistrationMethodSection', () => {
  it('renders registration method cards', () => {
    renderRegistrationMethodSection();

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();
    expect(screen.getByText('상품을 등록할 방식을 선택해주세요.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '전단지 업로드' })).toBeInTheDocument();
    expect(screen.getByText('지원 형식: .xlsx, .csv')).toBeInTheDocument();
    expect(screen.getByText('지원 형식: jpg, jpeg, png')).toBeInTheDocument();
  });

  it('calls entry point callbacks from each action', async () => {
    const user = userEvent.setup();
    const handleOpenExcelUpload = vi.fn();
    const handleDownloadExcelTemplate = vi.fn();
    const handleOpenPosGuide = vi.fn();
    const handleUploadLeaflet = vi.fn();

    renderRegistrationMethodSection({
      onDownloadExcelTemplate: handleDownloadExcelTemplate,
      onOpenExcelUpload: handleOpenExcelUpload,
      onOpenPosGuide: handleOpenPosGuide,
      onUploadLeaflet: handleUploadLeaflet,
    });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));
    await user.click(screen.getByRole('button', { name: 'POS에서 엑셀 파일 받는 방법 보기' }));
    await user.click(screen.getByRole('button', { name: '전단지 업로드' }));

    expect(handleOpenExcelUpload).toHaveBeenCalledTimes(1);
    expect(handleDownloadExcelTemplate).toHaveBeenCalledTimes(1);
    expect(handleOpenPosGuide).toHaveBeenCalledTimes(1);
    expect(handleUploadLeaflet).toHaveBeenCalledTimes(1);
  });
});
