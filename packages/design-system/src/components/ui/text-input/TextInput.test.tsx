import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders the Figma error icon with an error message', () => {
    render(<TextInput errorMessage='에러메시지를 나타냅니다' label='주제' status='error' />);

    const input = screen.getByRole('textbox', { name: '주제' });
    const message = screen.getByText('에러메시지를 나타냅니다');
    const errorIcon = message.parentElement?.querySelector('svg');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveAttribute('viewBox', '0 0 16 16');
  });

  it('does not render an empty error message row', () => {
    const { container } = render(<TextInput errorMessage='' label='주제' status='error' />);

    expect(screen.getByRole('textbox', { name: '주제' })).not.toHaveAttribute('aria-describedby');
    expect(container.querySelector('[id$="-error"]')).not.toBeInTheDocument();
  });
});
