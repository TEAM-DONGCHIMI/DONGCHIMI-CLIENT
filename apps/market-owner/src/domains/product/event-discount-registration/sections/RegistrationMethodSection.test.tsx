import { render, screen, userEvent } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { registrationMethodFixture } from '../fixtures';
import { RegistrationMethodSection } from './RegistrationMethodSection';

const defaultProps = {
  fixture: registrationMethodFixture,
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
  it('renders registration method cards from fixture copy', () => {
    renderRegistrationMethodSection();

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();
    expect(screen.getByText('상품을 등록할 방식을 선택해주세요.')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: registrationMethodFixture.excel.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: registrationMethodFixture.leaflet.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(registrationMethodFixture.excel.supportedFormat)).toBeInTheDocument();
    expect(screen.getByText(registrationMethodFixture.leaflet.supportedFormat)).toBeInTheDocument();
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

    await user.click(
      screen.getByRole('button', { name: registrationMethodFixture.excel.uploadButtonLabel }),
    );
    await user.click(
      screen.getByRole('button', { name: registrationMethodFixture.excel.downloadButtonLabel }),
    );
    await user.click(
      screen.getByRole('button', { name: registrationMethodFixture.excel.guideLinkLabel }),
    );
    await user.click(
      screen.getByRole('button', { name: registrationMethodFixture.leaflet.uploadButtonLabel }),
    );

    expect(handleOpenExcelUpload).toHaveBeenCalledTimes(1);
    expect(handleDownloadExcelTemplate).toHaveBeenCalledTimes(1);
    expect(handleOpenPosGuide).toHaveBeenCalledTimes(1);
    expect(handleUploadLeaflet).toHaveBeenCalledTimes(1);
  });
});
