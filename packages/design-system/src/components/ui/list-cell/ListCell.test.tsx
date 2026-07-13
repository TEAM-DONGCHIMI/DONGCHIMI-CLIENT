import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../test';
import { ListCell, type ListCellFieldProps } from './ListCell';

const fields: ListCellFieldProps[] = [
  { id: 'name', value: '상품명', width: 160 },
  { id: 'price', placeholder: '가격을 입력하세요', width: 112 },
  {
    'aria-label': '카테고리 선택',
    id: 'category',
    onClick: () => undefined,
    value: '식품',
    width: 128,
  },
];

describe('ListCell', () => {
  it('renders a selectable row with display fields', async () => {
    const handleCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ListCell
        checkboxLabel='상품 행 선택'
        fields={fields}
        onCheckedChange={handleCheckedChange}
      />,
    );

    const selection = screen.getByRole('checkbox', { name: '상품 행 선택' });

    expect(selection).toHaveAttribute('type', 'button');
    expect(selection).toHaveAttribute('aria-checked', 'false');

    await user.click(selection);

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
    expect(selection).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByDisplayValue('상품명')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('가격을 입력하세요')).toBeInTheDocument();
  });

  it('renders media action as a non-submit button', async () => {
    const handleMediaAction = vi.fn();
    const user = userEvent.setup();

    render(
      <ListCell
        checkboxLabel='상품 행 선택'
        fields={fields}
        mediaActionLabel='이미지 추가'
        onMediaAction={handleMediaAction}
      />,
    );

    const action = screen.getByRole('button', { name: '이미지 추가' });
    expect(action).toHaveAttribute('type', 'button');

    await user.click(action);

    expect(handleMediaAction).toHaveBeenCalledOnce();
  });

  it('renders actionable fields as buttons', async () => {
    const handleFieldClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ListCell
        checkboxLabel='상품 행 선택'
        fields={[
          fields[0],
          {
            ...fields[2],
            onClick: handleFieldClick,
          },
        ]}
      />,
    );

    const field = screen.getByRole('button', { name: '카테고리 선택' });
    expect(field).toHaveAttribute('type', 'button');

    await user.click(field);

    expect(handleFieldClick).toHaveBeenCalledOnce();
  });

  it('renders status and helper message without making helper icon accessible', () => {
    render(
      <ListCell
        checkboxLabel='상품 행 선택'
        fields={fields}
        helperIcon={<span data-testid='helper-icon'>!</span>}
        helperText='이미지 누락'
        statusLabel='수정 필요'
        statusTone='negative'
      />,
    );

    expect(screen.getByText('수정 필요')).toBeInTheDocument();
    expect(screen.getByText('이미지 누락')).toBeInTheDocument();
    expect(screen.getByTestId('helper-icon').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('disables checkbox and actionable fields independently', () => {
    render(
      <ListCell
        checkboxDisabled
        checkboxLabel='상품 행 선택'
        fields={[
          fields[0],
          {
            ...fields[2],
            disabled: true,
            onClick: () => undefined,
          },
        ]}
      />,
    );

    expect(screen.getByRole('checkbox', { name: '상품 행 선택' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '카테고리 선택' })).toBeDisabled();
  });

  it('forwards validation and blur props to inline fields', async () => {
    const handleBlur = vi.fn();
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ListCell
        fields={[
          {
            'aria-label': '상품명',
            errorMessage: '상품명을 입력해주세요.',
            id: 'product-name',
            maxLength: 15,
            onBlur: handleBlur,
            onChange: handleChange,
            status: 'error',
            value: '',
          },
        ]}
      />,
    );

    const field = screen.getByRole('textbox', { name: '상품명' });

    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('maxlength', '15');
    expect(screen.getByText('상품명을 입력해주세요.')).toBeInTheDocument();

    await user.click(field);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledOnce();
  });
});
