import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../test';
import { Sidebar } from './Sidebar';
import type { SidebarItem } from './Sidebar.types';

const HomeIcon = () => <span data-testid='home-icon'>홈 아이콘</span>;

const primaryItems: SidebarItem[] = [
  {
    href: '#home',
    icon: <HomeIcon />,
    id: 'home',
    label: '홈',
  },
  {
    id: 'settings',
    label: '환경설정',
  },
  {
    disabled: true,
    id: 'disabled',
    label: '오픈 예정',
  },
];

describe('Sidebar', () => {
  it('renders href items as links and marks the active item', () => {
    render(
      <Sidebar activeItemId='home' aria-label='주 메뉴' sections={[{ items: primaryItems }]} />,
    );

    const homeLink = screen.getByRole('link', { name: '홈' });

    expect(homeLink).toHaveAttribute('href', '#home');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders items without href as native buttons', () => {
    render(<Sidebar aria-label='주 메뉴' sections={[{ items: primaryItems }]} />);

    expect(screen.getByRole('button', { name: '환경설정' })).toHaveAttribute('type', 'button');
  });

  it('calls onItemSelect with enabled item data', async () => {
    const handleItemSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <Sidebar
        aria-label='주 메뉴'
        onItemSelect={handleItemSelect}
        sections={[{ items: primaryItems }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '환경설정' }));

    expect(handleItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'settings' }));
  });

  it('does not call onItemSelect for disabled items', async () => {
    const handleItemSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <Sidebar
        aria-label='주 메뉴'
        onItemSelect={handleItemSelect}
        sections={[{ items: primaryItems }]}
      />,
    );

    const disabledItem = screen.getByRole('button', { name: '오픈 예정' });

    await user.click(disabledItem);

    expect(disabledItem).toBeDisabled();
    expect(handleItemSelect).not.toHaveBeenCalled();
  });

  it('hides item icons from the accessibility tree', () => {
    render(<Sidebar aria-label='주 메뉴' sections={[{ items: primaryItems }]} />);

    expect(screen.getByTestId('home-icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
