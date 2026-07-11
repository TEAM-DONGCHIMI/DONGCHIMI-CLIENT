import { fireEvent, render, screen, userEvent } from '@/test';
import { ToastProvider } from '@dongchimi/shared/toast';
import { describe, expect, it } from 'vitest';

import { EventDiscountRegistrationPage } from './EventDiscountRegistrationPage';

const posGuideDialogName = /POS에서 엑셀 파일을\s+이렇게 다운 받으시면 돼요\./;

const renderEventDiscountRegistrationPage = () => {
  return render(
    <ToastProvider defaultDurationMs={null}>
      <EventDiscountRegistrationPage />
    </ToastProvider>,
  );
};

describe('EventDiscountRegistrationPage', () => {
  it('switches from registration method to file confirmation and analysis progress', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage();

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText(/상품이 등록된 엑셀 파일을 선택해주세요/)).toBeInTheDocument();
    expect(screen.getByText(/업로드하면 상품이 자동으로 등록됩니다/)).toBeInTheDocument();
    expect(screen.getByText('지원 파일은 .xlsx, .csv예요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();

    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('선택한 파일')).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
    expect(screen.queryByText('지원 파일은 .xlsx, .csv예요.')).toBeNull();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '파일 업로드' }));

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(
      screen.getByRole('heading', { name: 'AI가 상품 정보를 분석하고 있어요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
  });

  it('keeps the modal open with selected file state regardless of local extension', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'leaflet.png', { type: 'image/png' });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    fireEvent.change(screen.getByLabelText('파일 선택'), {
      target: {
        files: [file],
      },
    });

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('선택한 파일')).toBeInTheDocument();
    expect(screen.getByText('leaflet.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeEnabled();
  });

  it('clears the uploaded file when file confirmation is canceled', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));

    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
    expect(screen.getByText('지원 파일은 .xlsx, .csv예요.')).toBeInTheDocument();
  });

  it('renders toast feedback and POS guide panel from method actions', async () => {
    const user = userEvent.setup();

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));

    const successToast = screen.getByRole('status');

    expect(successToast).toHaveTextContent('엑셀 양식 다운로드 완료');
    expect(successToast.querySelector('svg')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'POS에서 엑셀 파일 받는 방법 보기' }));

    expect(screen.getByRole('dialog', { name: posGuideDialogName })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'POS 안내 닫기' }));

    expect(screen.queryByRole('dialog', { name: posGuideDialogName })).toBeNull();

    await user.click(screen.getByRole('button', { name: '전단지 업로드' }));

    const errorToast = screen.getByRole('alert');

    expect(errorToast).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(errorToast.querySelector('svg')).toBeInTheDocument();
  });
});
