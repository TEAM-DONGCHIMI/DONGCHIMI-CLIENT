import { describe, expect, it, vi } from 'vitest';

import { IcChevronRight } from '../../../icons';
import { render, screen, userEvent } from '../../../test';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders a native button with an accessible name and decorative icon slot', () => {
    render(<IconButton aria-label='다음' icon={<IcChevronRight data-testid='icon' />} />);

    const button = screen.getByRole('button', { name: '다음' });

    expect(button).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('uses native disabled behavior', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <IconButton
        aria-label='비활성 버튼'
        disabled
        icon={<IcChevronRight />}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: '비활성 버튼' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '비활성 버튼' })).toBeDisabled();
  });

  it('applies the rounded visual variant independently from the default radius', () => {
    render(
      <>
        <IconButton aria-label='기본 버튼' icon={<IcChevronRight />} />
        <IconButton aria-label='원형 버튼' icon={<IcChevronRight />} rounded />
      </>,
    );

    expect(screen.getByRole('button', { name: '기본 버튼' }).className).not.toBe(
      screen.getByRole('button', { name: '원형 버튼' }).className,
    );
  });
});
