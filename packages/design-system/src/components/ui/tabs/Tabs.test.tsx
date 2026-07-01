import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../test';
import { TabNav } from './TabNav';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('connects triggers and panels with tab semantics', () => {
    render(
      <Tabs defaultValue='today'>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>오늘의 특가 콘텐츠</Tabs.Panel>
        <Tabs.Panel value='period'>기간 할인 콘텐츠</Tabs.Panel>
      </Tabs>,
    );

    const selectedTab = screen.getByRole('tab', { name: '오늘의 특가' });
    const panel = screen.getByRole('tabpanel', { name: '오늘의 특가' });

    expect(screen.getByRole('tablist', { name: '할인 유형' })).toBeInTheDocument();
    expect(selectedTab).toHaveAttribute('aria-selected', 'true');
    expect(selectedTab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', selectedTab.id);
    expect(screen.queryByText('기간 할인 콘텐츠')).not.toBeInTheDocument();
  });

  it('changes the selected panel when a trigger is clicked', async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='today' onValueChange={handleValueChange}>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>오늘의 특가 콘텐츠</Tabs.Panel>
        <Tabs.Panel value='period'>기간 할인 콘텐츠</Tabs.Panel>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: '기간 할인' }));

    expect(handleValueChange).toHaveBeenCalledWith('period');
    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('기간 할인 콘텐츠')).toBeInTheDocument();
  });

  it('automatically selects a tab while moving focus with arrow keys', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue='today'>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>오늘의 특가 콘텐츠</Tabs.Panel>
        <Tabs.Panel value='period'>기간 할인 콘텐츠</Tabs.Panel>
      </Tabs>,
    );

    screen.getByRole('tab', { name: '오늘의 특가' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports manual activation with Enter or Space', async () => {
    const user = userEvent.setup();

    render(
      <Tabs activationMode='manual' defaultValue='today'>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>오늘의 특가 콘텐츠</Tabs.Panel>
        <Tabs.Panel value='period'>기간 할인 콘텐츠</Tabs.Panel>
      </Tabs>,
    );

    screen.getByRole('tab', { name: '오늘의 특가' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveAttribute(
      'aria-selected',
      'false',
    );

    await user.keyboard('{Enter}');

    expect(screen.getByRole('tab', { name: '기간 할인' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('TabNav', () => {
  it('renders selected link state without tab roles', () => {
    render(
      <TabNav aria-label='할인 유형 링크'>
        <TabNav.List>
          <TabNav.Item href='?discountType=today' selected>
            오늘의 특가
          </TabNav.Item>
          <TabNav.Item href='?discountType=period'>기간 할인</TabNav.Item>
        </TabNav.List>
      </TabNav>,
    );

    const selectedLink = screen.getByRole('link', { name: '오늘의 특가' });

    expect(screen.getByRole('navigation', { name: '할인 유형 링크' })).toBeInTheDocument();
    expect(selectedLink).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
