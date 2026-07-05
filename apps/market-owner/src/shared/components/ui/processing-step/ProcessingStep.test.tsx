import { render, screen, within } from '@/test';
import { describe, expect, it } from 'vitest';

import { ProcessingStep, type ProcessingStepProps } from './ProcessingStep';

const steps = [
  {
    id: 'file-upload',
    title: '파일 업로드 완료',
    status: 'completed',
  },
  {
    id: 'product-name',
    title: '상품명 확인',
    status: 'processing',
  },
  {
    id: 'price',
    title: '가격 확인',
    status: 'pending',
  },
] satisfies ProcessingStepProps['steps'];

describe('ProcessingStep', () => {
  it('renders processing steps with default status labels', () => {
    render(<ProcessingStep aria-label='상품 처리 단계' steps={steps} />);

    const list = screen.getByRole('list', { name: '상품 처리 단계' });
    const items = within(list).getAllByRole('listitem');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('파일 업로드 완료');
    expect(items[0]).toHaveTextContent('완료');
    expect(items[1]).toHaveTextContent('상품명 확인');
    expect(items[1]).toHaveTextContent('진행 중...');
    expect(items[2]).toHaveTextContent('가격 확인');
    expect(items[2]).toHaveTextContent('대기');
  });

  it('marks the processing item as the current step', () => {
    render(<ProcessingStep steps={steps} />);

    expect(screen.getByText('상품명 확인').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('파일 업로드 완료').closest('li')).not.toHaveAttribute('aria-current');
    expect(screen.getByText('가격 확인').closest('li')).not.toHaveAttribute('aria-current');
  });

  it('renders custom icon slots and status labels', () => {
    render(
      <ProcessingStep
        iconSlot={(step) => <span aria-label={`${step.title} 아이콘`} />}
        steps={[
          {
            id: 'custom',
            title: '링크 생성',
            status: 'processing',
            statusLabel: '처리 중',
          },
        ]}
      />,
    );

    expect(screen.getByText('처리 중')).toBeInTheDocument();
    expect(screen.getByLabelText('링크 생성 아이콘')).toBeInTheDocument();
  });
});
