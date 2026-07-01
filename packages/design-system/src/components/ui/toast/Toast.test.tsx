import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders completed feedback with polite status semantics by default', () => {
    render(<Toast>링크가 복사되었어요</Toast>);

    const toast = screen.getByRole('status');

    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveTextContent('링크가 복사되었어요');
  });

  it('renders error feedback with assertive alert semantics', () => {
    render(<Toast status='error'>링크가 복사되지 않았어요</Toast>);

    const toast = screen.getByRole('alert');

    expect(toast).toHaveAttribute('aria-live', 'assertive');
    expect(toast).toHaveTextContent('링크가 복사되지 않았어요');
  });

  it('renders an optional decorative icon slot', () => {
    render(
      <Toast icon={<span data-testid='toast-icon'>!</span>} status='error'>
        요청에 실패했어요
      </Toast>,
    );

    expect(screen.getByTestId('toast-icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('allows consumers to override announcement semantics', () => {
    render(
      <Toast aria-live='off' role='presentation'>
        조용한 토스트
      </Toast>,
    );

    const toast = screen.getByText('조용한 토스트').parentElement;

    expect(toast).toHaveAttribute('role', 'presentation');
    expect(toast).toHaveAttribute('aria-live', 'off');
  });
});
