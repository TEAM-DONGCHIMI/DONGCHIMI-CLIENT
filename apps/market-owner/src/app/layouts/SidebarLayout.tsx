import { useMemo, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import {
  IcCircleQuestion,
  IcHome,
  IcRangeSaleEditDefault,
  IcRangeSaleEditHover,
  IcRangeSaleUploadDefault,
  IcRangeSaleUploadHover,
  IcSetting,
  IcTodaySaleEditDefault,
  IcTodaySaleEditHover,
  IcTodaySaleUploadDefault,
  IcTodaySaleUploadHover,
} from '@dongchimi/design-system/icons';
import { ToastProvider } from '@dongchimi/shared/toast';

import { Sidebar, type SidebarItem, type SidebarSection } from '@/shared/components';
import sidebarBrandLogo from '@/shared/assets/images/Img_pavicon.svg';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

import * as S from './SidebarLayout.css';
import { SIDEBAR_LAYOUT_TOAST_OFFSET_Y } from './SidebarLayout.constants';

const sidebarItemRoutes = {
  eventDiscountEdit: MARKET_OWNER_ROUTES.eventDiscountEdit,
  eventDiscountRegistration: MARKET_OWNER_ROUTES.eventDiscountRegistration,
  home: MARKET_OWNER_ROUTES.home,
  marketInformationManagement: MARKET_OWNER_ROUTES.marketInformationManagement,
  todaySpecialEdit: MARKET_OWNER_ROUTES.todaySpecialEdit,
  todaySpecialRegistration: MARKET_OWNER_ROUTES.todaySpecialRegistration,
} as const;

type SidebarItemIdTypes = keyof typeof sidebarItemRoutes;

const createSidebarItem = ({
  icon,
  id,
  label,
}: {
  icon: SidebarItem['icon'];
  id: SidebarItemIdTypes;
  label: string;
}): SidebarItem => {
  return {
    href: sidebarItemRoutes[id],
    icon,
    id,
    label,
  };
};

const SidebarStateIcon = ({
  defaultIcon,
  hoverIcon,
}: {
  defaultIcon: ReactNode;
  hoverIcon: ReactNode;
}) => (
  <span className={S.sidebarStateIconClassName}>
    <span className={S.sidebarStateIconDefaultClassName}>{defaultIcon}</span>
    <span className={S.sidebarStateIconHoverClassName}>{hoverIcon}</span>
  </span>
);

const sidebarSections: SidebarSection[] = [
  {
    id: 'home',
    items: [
      createSidebarItem({
        icon: <IcHome aria-hidden='true' />,
        id: 'home',
        label: '홈',
      }),
    ],
  },
  {
    id: 'product',
    items: [
      createSidebarItem({
        icon: (
          <SidebarStateIcon
            defaultIcon={<IcTodaySaleUploadDefault aria-hidden='true' />}
            hoverIcon={<IcTodaySaleUploadHover aria-hidden='true' />}
          />
        ),
        id: 'todaySpecialRegistration',
        label: '오늘의 특가 상품 등록',
      }),
      createSidebarItem({
        icon: (
          <SidebarStateIcon
            defaultIcon={<IcRangeSaleUploadDefault aria-hidden='true' />}
            hoverIcon={<IcRangeSaleUploadHover aria-hidden='true' />}
          />
        ),
        id: 'eventDiscountRegistration',
        label: '행사 할인 상품 등록',
      }),
      createSidebarItem({
        icon: (
          <SidebarStateIcon
            defaultIcon={<IcTodaySaleEditDefault aria-hidden='true' />}
            hoverIcon={<IcTodaySaleEditHover aria-hidden='true' />}
          />
        ),
        id: 'todaySpecialEdit',
        label: '오늘의 특가 상품 수정',
      }),
      createSidebarItem({
        icon: (
          <SidebarStateIcon
            defaultIcon={<IcRangeSaleEditDefault aria-hidden='true' />}
            hoverIcon={<IcRangeSaleEditHover aria-hidden='true' />}
          />
        ),
        id: 'eventDiscountEdit',
        label: '행사 할인 상품 수정',
      }),
    ],
    title: '우리 마트 전단을 동네 주민에게 전달하기',
  },
];

const footerItems: SidebarItem[] = [
  createSidebarItem({
    icon: <IcSetting aria-hidden='true' />,
    id: 'marketInformationManagement',
    label: '마트 정보 관리',
  }),
];

const sidebarRouteEntries = Object.entries(sidebarItemRoutes) as [
  SidebarItemIdTypes,
  MarketOwnerRouteTypes,
][];

const getActiveSidebarItemId = (pathname: string): SidebarItemIdTypes | undefined => {
  return sidebarRouteEntries.find(([, path]) => path === pathname)?.[0];
};

const SidebarBrand = () => (
  <img alt='동치미' className={S.brandImageClassName} src={sidebarBrandLogo} />
);

const SidebarHelp = () => (
  <div className={S.helpCardClassName}>
    <p className={S.helpTextClassName}>
      <IcCircleQuestion aria-hidden='true' className={S.helpIconClassName} /> 도움이 필요하신가요?
    </p>
    <button className={S.helpButtonClassName} type='button'>
      문의 남기기
    </button>
  </div>
);

export const SidebarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeItemId = getActiveSidebarItemId(location.pathname);
  const profile = useMemo(
    () => ({
      avatar: (
        <span aria-hidden='true' className={S.profileAvatarClassName}>
          신
        </span>
      ),
      description: 'shinseonmart@gmail.com',
      name: '신선마트 사장님',
    }),
    [],
  );

  const handleSidebarItemSelect = (item: SidebarItem) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div className={S.sidebarLayoutRootClassName}>
      <div className={S.sidebarSlotClassName}>
        <Sidebar
          activeItemId={activeItemId}
          aria-label='사장님웹 주요 메뉴'
          brand={<SidebarBrand />}
          footerItems={footerItems}
          helpCard={<SidebarHelp />}
          onItemSelect={handleSidebarItemSelect}
          profile={profile}
          sections={sidebarSections}
        />
      </div>
      <div className={S.contentSlotClassName}>
        <ToastProvider offset={SIDEBAR_LAYOUT_TOAST_OFFSET_Y} placement='top-center'>
          <Outlet />
        </ToastProvider>
      </div>
    </div>
  );
};
