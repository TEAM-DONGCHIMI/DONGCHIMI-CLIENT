import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ProductCard, type ProductCardProps } from '@dongchimi/shared';
import { Toast } from '@dongchimi/design-system';
import {
  IcCircleCheckFillSizeSmall,
  IcCircleExclamationFillColor0,
} from '@dongchimi/design-system/icons';

import { DesktopHeader, LeafletShareCard, ProductSearchPanel } from '@/shared/components';

import { HomeQuickButton } from './components/home-quick-button';
import { homeHeroActions, homeProductSections, homeSearchProducts, homeShare } from './fixtures';
import * as S from './HomePage.css';

const TODAY_SPECIAL_VISIBLE_COUNT = 4;
const HOME_TOAST_DISMISS_MS = 2500;
const SHARE_COPY_SUCCESS_MESSAGE = '전단 링크가 복사되었습니다.';
const SHARE_COPY_ERROR_MESSAGE = '링크를 복사하지 못했습니다. 다시 시도해주세요.';
const SEARCH_PRODUCT_LOAD_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요.';

interface HomeToastTypes {
  id: number;
  message: string;
  status: 'completed' | 'error';
}

const copyToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined' || navigator.clipboard == null) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
};

const getSearchProductById = (productId: string) => {
  return homeSearchProducts.find((product) => product.id === productId);
};

const getHomeToastIcon = (status: HomeToastTypes['status']) => {
  if (status === 'error') {
    return <IcCircleExclamationFillColor0 className={S.homeToastIconClassName} />;
  }

  return <IcCircleCheckFillSizeSmall className={S.homeToastIconClassName} />;
};

interface HomeSearchPanelProps {
  onProductLoadError: () => void;
}

const HomeSearchPanel = ({ onProductLoadError }: HomeSearchPanelProps) => {
  const navigate = useNavigate();

  return (
    <ProductSearchPanel
      items={homeSearchProducts}
      onSelectProduct={(item) => {
        const selectedProduct = getSearchProductById(item.id);

        if (!selectedProduct || selectedProduct.isProductInfoLoadable === false) {
          onProductLoadError();

          return;
        }

        navigate(selectedProduct.editRoute, { state: { productId: selectedProduct.id } });
      }}
    />
  );
};

const HomeHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section aria-label='홈 대표 영역' className={S.heroSectionClassName}>
      <div className={S.heroActionListClassName}>
        {homeHeroActions.map((action) => (
          <HomeQuickButton
            description={action.description}
            key={action.id}
            label={action.title}
            onClick={() => navigate(action.route)}
          />
        ))}
      </div>
    </section>
  );
};

const HomeProductSummarySection = () => {
  const navigate = useNavigate();

  const handleProductClick = (section: (typeof homeProductSections)[number]) => {
    const onProductClick: ProductCardProps['onProductClick'] = (item) => {
      navigate(section.editRoute, { state: { productId: item.id } });
    };

    return onProductClick;
  };

  return (
    <>
      {homeProductSections.map((section) => (
        <ProductCard
          className={S.productCardClassName}
          id={section.id}
          initialVisibleCount={TODAY_SPECIAL_VISIBLE_COUNT}
          itemVariant={section.itemVariant}
          items={section.items}
          key={section.id}
          onProductClick={handleProductClick(section)}
          title={section.title}
          totalCount={section.totalCount}
          actionSlot={
            <button
              className={S.productCardActionButtonClassName}
              onClick={() => navigate(section.editRoute)}
              type='button'
            >
              등록한 상품 전체보기
            </button>
          }
        />
      ))}
    </>
  );
};

interface HomeShareSectionProps {
  onCopyLinkResult: (isCopied: boolean) => void;
}

const HomeShareSection = ({ onCopyLinkResult }: HomeShareSectionProps) => {
  const handleCopyShareUrl = async () => {
    const isCopied = await copyToClipboard(homeShare.url);

    onCopyLinkResult(isCopied);
  };

  const handleOpenQrCode = () => {
    // TODO(DCMSM-27): QR 표시 flow가 확정되면 modal 또는 route로 연결합니다.
  };

  return (
    <LeafletShareCard
      className={S.shareCardClassName}
      description={homeShare.description}
      onCopyLink={handleCopyShareUrl}
      onOpenQrCode={handleOpenQrCode}
      shareUrl={homeShare.url}
      title={homeShare.title}
    />
  );
};

interface HomeDashboardSectionProps {
  onCopyLinkResult: HomeShareSectionProps['onCopyLinkResult'];
}

const HomeDashboardSection = ({ onCopyLinkResult }: HomeDashboardSectionProps) => {
  return (
    <div className={S.dashboardGridClassName}>
      <HomeProductSummarySection />
      <HomeShareSection onCopyLinkResult={onCopyLinkResult} />
    </div>
  );
};

export const HomePage = () => {
  const [homeToast, setHomeToast] = useState<HomeToastTypes | null>(null);

  useEffect(() => {
    if (homeToast == null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHomeToast(null);
    }, HOME_TOAST_DISMISS_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [homeToast]);

  const handleCopyLinkResult = (isCopied: boolean) => {
    setHomeToast({
      id: Date.now(),
      message: isCopied ? SHARE_COPY_SUCCESS_MESSAGE : SHARE_COPY_ERROR_MESSAGE,
      status: isCopied ? 'completed' : 'error',
    });
  };

  const handleProductLoadError = () => {
    setHomeToast({
      id: Date.now(),
      message: SEARCH_PRODUCT_LOAD_ERROR_MESSAGE,
      status: 'error',
    });
  };

  return (
    <main className={S.pageRootClassName}>
      <h1 className={S.visuallyHiddenHeadingClassName}>동치미 홈</h1>
      {homeToast && (
        <div className={S.homeToastLayerClassName}>
          <Toast
            key={homeToast.id}
            icon={getHomeToastIcon(homeToast.status)}
            status={homeToast.status}
          >
            {homeToast.message}
          </Toast>
        </div>
      )}
      <DesktopHeader
        className={S.pageHeaderClassName}
        homeLabel='동치미 홈'
        searchSlot={<HomeSearchPanel onProductLoadError={handleProductLoadError} />}
        showSearchBar
        variant='onlyHome'
      />

      <div className={S.contentSectionClassName}>
        <HomeHeroSection />
        <HomeDashboardSection onCopyLinkResult={handleCopyLinkResult} />
      </div>
    </main>
  );
};
