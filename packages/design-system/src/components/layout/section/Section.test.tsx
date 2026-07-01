import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { sectionSpacingClassNames } from '../layout.css';
import { Section } from './Section';

describe('Section', () => {
  it('renders a section element by default', () => {
    render(<Section aria-label='콘텐츠 섹션'>Content</Section>);

    const section = screen.getByRole('region', { name: '콘텐츠 섹션' });

    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveClass(sectionSpacingClassNames.md);
  });

  it('allows semantic element override', () => {
    const { container } = render(<Section as='article'>Article content</Section>);

    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('applies spacing class when requested', () => {
    render(
      <Section aria-label='간격 섹션' spacing='sm'>
        Content
      </Section>,
    );

    expect(screen.getByRole('region', { name: '간격 섹션' })).toHaveClass(
      sectionSpacingClassNames.sm,
    );
  });
});
