import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { DesktopHeader } from '@/shared/components';
import {
  PRODUCT_CATEGORY_CODE_BY_NAME,
  type ProductCategoryGroupTypes,
} from '@/shared/constants/product-categories';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import {
  usePreparedProductDraftsQuery,
  usePresignedUploadMutation,
  useSavePreparedProductDraftsMutation,
} from '@/domains/product/hooks';

import { MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE } from '../api/get-prepared-product-drafts';
import type { PreparedProductDraftCategoryCodeTypes } from '../api/prepared-product-draft.schema';
import type { SavePreparedProductDraftsRequestTypes } from '../api/save-prepared-product-drafts';
import { createRegistrationResultProducts } from './model';
import * as S from './RegistrationResultPage.css';
import { RegistrationResultSection, type RegistrationResultDraftQueryParams } from './sections';
import { resolvePresignedProductImageFileUrl } from './utils/resolve-product-image-file-url';

const REGISTRATION_RESULT_PAGE_SIZE = 10;

const getPreparedProductDraftCategoryCodes = (categories: readonly ProductCategoryGroupTypes[]) => {
  return categories
    .map((category) => PRODUCT_CATEGORY_CODE_BY_NAME[category])
    .filter((category): category is PreparedProductDraftCategoryCodeTypes => category != null);
};

export const RegistrationResultPage = () => {
  const navigate = useNavigate();
  const marketId = useAuthStore((state) => state.marketId);
  const presignedUploadMutation = usePresignedUploadMutation();
  const savePreparedProductDraftsMutation = useSavePreparedProductDraftsMutation();
  const [draftQueryParams, setDraftQueryParams] = useState<RegistrationResultDraftQueryParams>({
    categories: [],
    search: '',
  });
  const preparedProductDraftsQuery = usePreparedProductDraftsQuery({
    categories: getPreparedProductDraftCategoryCodes(draftQueryParams.categories),
    fetchAll: true,
    marketId,
    page: 0,
    search: draftQueryParams.search,
    size: MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE,
  });
  const preparedProductDraftsData = preparedProductDraftsQuery.data?.data;
  const products = useMemo(
    () => createRegistrationResultProducts(preparedProductDraftsData?.preparedProducts ?? []),
    [preparedProductDraftsData?.preparedProducts],
  );
  const summary = useMemo(
    () => ({
      completedCount: preparedProductDraftsData?.successCount ?? 0,
      needsEditCount: preparedProductDraftsData?.failCount ?? 0,
      totalCount: preparedProductDraftsData?.totalCount ?? 0,
    }),
    [
      preparedProductDraftsData?.failCount,
      preparedProductDraftsData?.successCount,
      preparedProductDraftsData?.totalCount,
    ],
  );
  const emptyMessage =
    marketId == null
      ? '마트 정보를 확인하고 있어요.'
      : preparedProductDraftsQuery.isError
        ? '상품 정보를 불러오지 못했습니다.'
        : preparedProductDraftsQuery.isPending
          ? '상품 목록을 불러오고 있어요.'
          : undefined;
  const handleSaveDrafts = useCallback(
    (request: SavePreparedProductDraftsRequestTypes) => {
      if (marketId == null) {
        return Promise.reject(new Error('Prepared product drafts marketId is required.'));
      }

      return savePreparedProductDraftsMutation.mutateAsync({
        marketId,
        request,
      });
    },
    [marketId, savePreparedProductDraftsMutation],
  );
  const resolveProductImageFileUrl = useMemo(
    () => resolvePresignedProductImageFileUrl(presignedUploadMutation.mutateAsync),
    [presignedUploadMutation.mutateAsync],
  );

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        className={S.pageHeaderClassName}
        currentLabel='상품 결과 등록 확인'
        logo={<span aria-hidden='true' className={S.logoPlaceholderClassName} />}
        parentLabel='행사 할인 상품 등록'
        showSearchBar={false}
      />

      <RegistrationResultSection
        emptyMessage={emptyMessage}
        isSavingDrafts={savePreparedProductDraftsMutation.isPending}
        pageSize={REGISTRATION_RESULT_PAGE_SIZE}
        products={products}
        summary={summary}
        onDraftQueryChange={setDraftQueryParams}
        onPrevious={() => navigate(MARKET_OWNER_ROUTES.eventDiscountRegistration)}
        onRegister={() => undefined}
        resolveProductImageFileUrl={resolveProductImageFileUrl}
        onSaveDrafts={handleSaveDrafts}
      />
    </main>
  );
};
