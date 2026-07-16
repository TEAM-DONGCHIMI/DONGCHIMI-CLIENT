import { createRef, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { IcChevronRight } from '../../../icons';
import { render, screen, userEvent } from '../../../test';
import { AddableField } from './AddableField';

type RenderFieldProps = Pick<
  ComponentProps<typeof AddableField>,
  | 'disabled'
  | 'errorMessage'
  | 'onTrailingAction'
  | 'placeholder'
  | 'required'
  | 'status'
  | 'trailingActionDisabled'
>;

const renderField = (props: Partial<RenderFieldProps> = {}) => {
  return render(
    <AddableField
      label='주제'
      leadingIcon={<IcChevronRight data-testid='leading-icon' />}
      onTrailingAction={() => undefined}
      trailingActionLabel='값 추가'
      trailingIcon={<IcChevronRight data-testid='trailing-icon' />}
      {...props}
    />,
  );
};

describe('AddableField', () => {
  it('connects the visible label and decorative icons to a native input', () => {
    renderField({ placeholder: '텍스트를 입력하세요', required: true });

    const input = screen.getByRole('textbox', { name: '주제' });

    expect(input).toBeRequired();
    expect(screen.getByRole('tooltip')).toHaveTextContent('* 표시는 필수로 입력해야 해요.');
    expect(screen.getByTestId('leading-icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByTestId('trailing-icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders the trailing action as a non-submit button', async () => {
    const handleTrailingAction = vi.fn();
    const user = userEvent.setup();

    renderField({ onTrailingAction: handleTrailingAction });

    const action = screen.getByRole('button', { name: '값 추가' });
    expect(action).toHaveAttribute('type', 'button');

    await user.click(action);

    expect(handleTrailingAction).toHaveBeenCalledOnce();
  });

  it('connects an error message and preserves caller-provided descriptions', () => {
    render(
      <>
        <p id='external-description'>외부 설명</p>
        <AddableField
          aria-describedby='external-description'
          errorMessage='에러메시지를 나타냅니다'
          label='주제'
          leadingIcon={<IcChevronRight />}
          onTrailingAction={() => undefined}
          status='error'
          trailingActionLabel='값 추가'
          trailingIcon={<IcChevronRight />}
        />
      </>,
    );

    const input = screen.getByRole('textbox', { name: '주제' });
    const message = screen.getByText('에러메시지를 나타냅니다');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('external-description');
    expect(input.getAttribute('aria-describedby')).toContain(message.parentElement?.id);
  });

  it('disables both the input and trailing action', () => {
    renderField({ disabled: true });

    expect(screen.getByRole('textbox', { name: '주제' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '값 추가' })).toBeDisabled();
  });

  it('disables only the trailing action', () => {
    renderField({ trailingActionDisabled: true });

    expect(screen.getByRole('textbox', { name: '주제' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '값 추가' })).toBeDisabled();
  });

  it('does not render an empty error message row', () => {
    const { container } = renderField({ errorMessage: '', status: 'error' });

    expect(screen.getByRole('textbox', { name: '주제' })).not.toHaveAttribute('aria-describedby');
    expect(container.querySelector('[id$="-error"]')).not.toBeInTheDocument();
  });

  it('forwards the input ref', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <AddableField
        ref={ref}
        label='주제'
        leadingIcon={<IcChevronRight />}
        onTrailingAction={() => undefined}
        trailingActionLabel='값 추가'
        trailingIcon={<IcChevronRight />}
      />,
    );

    expect(ref.current).toBe(screen.getByRole('textbox', { name: '주제' }));
  });
});
