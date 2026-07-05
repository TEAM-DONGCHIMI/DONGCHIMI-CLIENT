import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
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
});
