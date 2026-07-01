import { describe, expect, it, vi } from 'vitest';

import { IcChevronRight } from '../../../icons';
import { render, screen, userEvent } from '../../../test';
import { PillButton } from './PillButton';

describe('PillButton', () => {
  it('renders a native button with the label as its accessible name', () => {
    render(<PillButton>상품 등록 순</PillButton>);

    const button = screen.getByRole('button', { name: '상품 등록 순' });

    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies different styles per variant', () => {
    render(
      <>
        <PillButton variant='outlined-light'>기본</PillButton>
        <PillButton variant='filled'>채움</PillButton>
      </>,
    );

    expect(screen.getByRole('button', { name: '기본' }).className).not.toBe(
      screen.getByRole('button', { name: '채움' }).className,
    );
  });

  it('applies different styles per platform', () => {
    render(
      <>
        <PillButton platform='desktop'>데스크탑</PillButton>
        <PillButton platform='mobile'>모바일</PillButton>
      </>,
    );

    expect(screen.getByRole('button', { name: '데스크탑' }).className).not.toBe(
      screen.getByRole('button', { name: '모바일' }).className,
    );
  });

  it('renders the trailing icon inside a decorative slot', () => {
    render(<PillButton icon={<IcChevronRight data-testid='icon' />}>상품 등록 순</PillButton>);

    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('uses native disabled behavior', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PillButton disabled onClick={handleClick}>
        상품 등록 순
      </PillButton>,
    );

    await user.click(screen.getByRole('button', { name: '상품 등록 순' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '상품 등록 순' })).toBeDisabled();
  });
});
