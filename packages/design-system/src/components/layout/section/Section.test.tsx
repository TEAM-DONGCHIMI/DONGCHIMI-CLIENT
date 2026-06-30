import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { Section } from './Section';

describe('Section', () => {
  it('renders a section element by default', () => {
    render(<Section aria-label='콘텐츠 섹션'>Content</Section>);

    expect(screen.getByRole('region', { name: '콘텐츠 섹션' }).tagName).toBe('SECTION');
  });

  it('allows semantic element override', () => {
    const { container } = render(<Section as='article'>Article content</Section>);

    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
