import { render, screen, userEvent, within } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { fileAnalysisConfirmFixture } from '../fixtures/file-analysis-confirm.fixture';
import { FileAnalysisConfirmSection } from './FileAnalysisConfirmSection';

const defaultProps = {
  analysisItems: fileAnalysisConfirmFixture.analysisItems,
  fileName: fileAnalysisConfirmFixture.fileName,
  onCancel: vi.fn(),
  onStartAnalysis: vi.fn(),
};

const renderFileAnalysisConfirmSection = (
  props: Partial<Parameters<typeof FileAnalysisConfirmSection>[0]> = {},
) => {
  return render(<FileAnalysisConfirmSection {...defaultProps} {...props} />);
};

describe('FileAnalysisConfirmSection', () => {
  it('renders the uploaded file and read-only analysis items', () => {
    renderFileAnalysisConfirmSection();

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('등록한 내용을 AI가 분석합니다.')).toBeInTheDocument();
    expect(screen.getByText(fileAnalysisConfirmFixture.fileName)).toBeInTheDocument();

    const analysisItemList = screen.getByRole('list', { name: 'AI 분석 항목' });
    const analysisItems = within(analysisItemList).getAllByRole('listitem');

    expect(analysisItems).toHaveLength(fileAnalysisConfirmFixture.analysisItems.length);
    fileAnalysisConfirmFixture.analysisItems.forEach((analysisItem) => {
      expect(within(analysisItemList).getByText(analysisItem)).toBeInTheDocument();
    });
  });

  it('calls cancel and start callbacks from the actions', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    const handleStartAnalysis = vi.fn();

    renderFileAnalysisConfirmSection({
      onCancel: handleCancel,
      onStartAnalysis: handleStartAnalysis,
    });

    await user.click(screen.getByRole('button', { name: '취소' }));
    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleStartAnalysis).toHaveBeenCalledTimes(1);
  });

  it('disables the analysis start action until an analyzable file exists', () => {
    renderFileAnalysisConfirmSection({
      fileName: '',
    });

    expect(screen.getByText('분석할 파일이 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '분석 시작' })).toBeDisabled();
  });
});
