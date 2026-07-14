import { render, screen, userEvent, within } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { fileAnalysisProgressFixtures } from '../fixtures';
import { FileAnalysisProgressSection } from './FileAnalysisProgressSection';

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({
    'aria-hidden': ariaHidden,
    autoplay,
    className,
    loop,
    src,
  }: {
    'aria-hidden'?: boolean | 'true' | 'false';
    autoplay?: boolean;
    className?: string;
    loop?: boolean;
    src?: string;
  }) => (
    <span
      aria-hidden={ariaHidden}
      className={className}
      data-autoplay={autoplay}
      data-loop={loop}
      data-src={src}
      data-testid='file-analysis-spinner'
    />
  ),
}));

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

  it('plays the decorative spinner Lottie for the processing step', () => {
    renderFileAnalysisProgressSection();

    expect(screen.getByTestId('file-analysis-spinner')).toHaveAttribute(
      'data-src',
      '/lottie/spinner.lottie',
    );
    expect(screen.getByTestId('file-analysis-spinner')).toHaveAttribute('data-autoplay', 'true');
    expect(screen.getByTestId('file-analysis-spinner')).toHaveAttribute('data-loop', 'true');
    expect(screen.getByTestId('file-analysis-spinner')).toHaveAttribute('aria-hidden', 'true');
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

  it('disables cancel while the cancel request is pending', () => {
    renderFileAnalysisProgressSection({ isCancelPending: true });

    expect(screen.getByRole('button', { name: '취소 중' })).toBeDisabled();
  });

  it('disables cancel when the analysis is completed', () => {
    renderFileAnalysisProgressSection({
      progressPercentage: fileAnalysisProgressFixtures.completed.progressPercentage,
      steps: fileAnalysisProgressFixtures.completed.steps,
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    expect(screen.queryByTestId('file-analysis-spinner')).not.toBeInTheDocument();
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
