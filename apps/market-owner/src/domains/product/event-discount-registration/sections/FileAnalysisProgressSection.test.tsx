import { render, screen, userEvent, within } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { fileAnalysisProgressFixtures } from '../fixtures/file-analysis-progress.fixture';
import { FileAnalysisProgressSection } from './FileAnalysisProgressSection';

const defaultProps = {
  onCancel: vi.fn(),
  progressPercentage: fileAnalysisProgressFixtures.processing.progressPercentage,
  steps: fileAnalysisProgressFixtures.processing.steps,
};

const renderFileAnalysisProgressSection = (
  props: Partial<Parameters<typeof FileAnalysisProgressSection>[0]> = {},
) => {
  return render(<FileAnalysisProgressSection {...defaultProps} {...props} />);
};

describe('FileAnalysisProgressSection', () => {
  it('renders the current AI analysis progress state', () => {
    renderFileAnalysisProgressSection();

    expect(
      screen.getByRole('heading', { name: 'AI가 상품 정보를 분석하고 있어요' }),
    ).toBeInTheDocument();
    expect(screen.getByText('잠시만 기다려주세요.')).toBeInTheDocument();

    const progressList = screen.getByRole('list', { name: 'AI 분석 진행 현황' });
    const steps = within(progressList).getAllByRole('listitem');

    expect(steps).toHaveLength(fileAnalysisProgressFixtures.processing.steps.length);
    expect(steps[0]).toHaveTextContent('파일 업로드');
    expect(steps[0]).toHaveTextContent('완료');
    expect(steps[1]).toHaveTextContent('상품명 등록');
    expect(steps[1]).toHaveTextContent('진행 중...');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    expect(steps[2]).toHaveTextContent('대기');
  });

  it('exposes the progress value through a progressbar', () => {
    renderFileAnalysisProgressSection();

    expect(screen.getByText('24%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );
  });

  it('calls cancel before the analysis is completed', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    renderFileAnalysisProgressSection({
      onCancel: handleCancel,
    });

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('disables cancel when the analysis is completed', () => {
    renderFileAnalysisProgressSection({
      progressPercentage: fileAnalysisProgressFixtures.completed.progressPercentage,
      steps: fileAnalysisProgressFixtures.completed.steps,
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
  });

  it('keeps cancel available when only the displayed progress rounds to 100', () => {
    renderFileAnalysisProgressSection({
      progressPercentage: 99.5,
      steps: fileAnalysisProgressFixtures.processing.steps,
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    expect(screen.getByRole('button', { name: '취소' })).toBeEnabled();
  });

  it('disables cancel when all analysis steps are completed', () => {
    renderFileAnalysisProgressSection({
      progressPercentage: 99.5,
      steps: fileAnalysisProgressFixtures.completed.steps,
    });

    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
  });
});
