import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent } from '../../../test';
import { ListButton } from './ListButton';

describe('ListButton', () => {
  it('exposes selection with aria-pressed for the default variant', () => {
    render(<ListButton selected>기본</ListButton>);

    const button = screen.getByRole('button', { name: '기본' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('exposes the checkbox variant as role="checkbox" with aria-checked', () => {
    render(
      <ListButton checkbox selected>
        전체
      </ListButton>,
    );

    const checkbox = screen.getByRole('checkbox', { name: '전체' });

    expect(checkbox).toBeChecked();
    expect(checkbox).not.toHaveAttribute('aria-pressed');
  });

  it('renders an unchecked checkbox when selected is false', () => {
    render(<ListButton checkbox>카테고리 1</ListButton>);

    expect(screen.getByRole('checkbox', { name: '카테고리 1' })).not.toBeChecked();
  });

  it('fires onClick when the checkbox visual (leading slot) is clicked', () => {
    const handleClick = vi.fn();

    render(
      <ListButton checkbox selected onClick={handleClick}>
        전체
      </ListButton>,
    );

    const leadingVisual = screen
      .getByRole('checkbox', { name: '전체' })
      .querySelector('[aria-hidden="true"]');

    expect(leadingVisual).not.toBeNull();
    fireEvent.click(leadingVisual as Element);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when the checkbox is disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ListButton checkbox disabled onClick={handleClick}>
        전체
      </ListButton>,
    );

    await user.click(screen.getByRole('checkbox', { name: '전체' }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
