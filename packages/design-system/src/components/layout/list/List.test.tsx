import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { List } from './List';

describe('List', () => {
  it('renders a semantic unordered list with list items', () => {
    render(
      <List aria-label='기본 목록'>
        <List.Item>첫 번째</List.Item>
        <List.Item>두 번째</List.Item>
      </List>,
    );

    expect(screen.getByRole('list', { name: '기본 목록' }).tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an ordered list when requested', () => {
    render(
      <List aria-label='순서 목록' as='ol' marker='decimal'>
        <List.Item>첫 번째</List.Item>
      </List>,
    );

    expect(screen.getByRole('list', { name: '순서 목록' }).tagName).toBe('OL');
  });
});
