import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ToastProvider } from '@dongchimi/shared/toast';
import { useQueryClient } from '@tanstack/react-query';

import dongchimiLogo from '@/shared/assets/images/Img_pavicon.svg';
import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { leafletShareQueryKeys } from '@/domains/leaflet/share/query-keys';
import {
  usePreparedProductDraftsQuery,
  usePresignedUploadMutation,
  useSavePreparedProductDraftsMutation,
} from '@/domains/product/hooks';
import {
  createProductImportRouteState,
  getProductImportFileConfirmation,
} from '@/domains/product/model/product-import-route-state';

import { MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE } from '../api/get-prepared-product-drafts';
import type { SavePreparedProductDraftsRequestTypes } from '../api/save-prepared-product-drafts';
import { createRegistrationResultProducts } from './model';
import * as S from './RegistrationResultPage.css';
import { RegistrationResultSection } from './sections';
import { resolvePresignedProductImageFileObjectKey } from './utils/resolve-product-image-file-url';

const REGISTRATION_RESULT_PAGE_SIZE = 10;

export const RegistrationResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const marketId = useAuthStore((state) => state.marketId);
  const presignedUploadMutation = usePresignedUploadMutation();
  const savePreparedProductDraftsMutation = useSavePreparedProductDraftsMutation();
  const preparedProductDraftsQuery = usePreparedProductDraftsQuery({
    categories: [],
    fetchAll: true,
    marketId,
    page: 0,
    search: '',
    size: MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE,
  });
  const refetchPreparedProductDrafts = preparedProductDraftsQuery.refetch;
  const savePreparedProductDrafts = savePreparedProductDraftsMutation.mutateAsync;
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
    async (request: SavePreparedProductDraftsRequestTypes) => {
      if (marketId == null) {
        throw new Error('Prepared product drafts marketId is required.');
      }

      await savePreparedProductDrafts({
        marketId,
        request,
      });

      const refreshedDraftsQuery = await refetchPreparedProductDrafts();
      const refreshedDraftsData = refreshedDraftsQuery.data?.data;

      if (refreshedDraftsQuery.isError || refreshedDraftsData == null) {
        throw new Error('Prepared product drafts refresh failed.');
      }

      return { failCount: refreshedDraftsData.failCount };
    },
    [marketId, refetchPreparedProductDrafts, savePreparedProductDrafts],
  );
  const resolveProductImageFileObjectKey = useMemo(
    () => resolvePresignedProductImageFileObjectKey(presignedUploadMutation.mutateAsync),
    [presignedUploadMutation.mutateAsync],
  );
  const fileConfirmation = getProductImportFileConfirmation(location.state);
  const handlePrevious = () => {
    navigate(MARKET_OWNER_ROUTES.eventDiscountRegistration, {
      state: fileConfirmation == null ? undefined : createProductImportRouteState(fileConfirmation),
    });
  };
  const handleRegister = async () => {
    if (marketId == null) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: leafletShareQueryKeys.periodicPreview(marketId),
    });
    navigate(MARKET_OWNER_ROUTES.leafletShare);
  };

  return (
    <ToastProvider offset='2.4rem' placement='top-center'>
      <main className={S.pageRootClassName}>
        <DesktopHeader
          className={S.pageHeaderClassName}
          currentLabel='상품 결과 등록 확인'
          logo={
            <img
              alt='동치미'
              className={S.logoClassName}
              height={32}
              src={dongchimiLogo}
              width={92}
            />
          }
          parentLabel='행사 할인 상품 등록'
          showSearchBar={false}
        />

        <RegistrationResultSection
          emptyMessage={emptyMessage}
          isSavingDrafts={savePreparedProductDraftsMutation.isPending}
          pageSize={REGISTRATION_RESULT_PAGE_SIZE}
          products={products}
          summary={summary}
          onPrevious={handlePrevious}
          onRegister={() => void handleRegister()}
          resolveProductImageFileObjectKey={resolveProductImageFileObjectKey}
          onSaveDrafts={handleSaveDrafts}
        />
      </main>
    </ToastProvider>
  );
};
