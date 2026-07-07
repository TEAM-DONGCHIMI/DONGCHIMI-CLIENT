import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import {
  IcCircleQuestion,
  IcHome,
  IcPlus,
  IcSetting,
  IcWrite,
} from '@dongchimi/design-system/icons';

import { Sidebar, type SidebarItem, type SidebarSection } from '@/shared/components';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

import * as S from './SidebarLayout.css';

const sidebarItemRoutes = {
  eventDiscountEdit: MARKET_OWNER_ROUTES.eventDiscountEdit,
  eventDiscountRegistration: MARKET_OWNER_ROUTES.eventDiscountRegistration,
  home: MARKET_OWNER_ROUTES.home,
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
        icon: <IcPlus aria-hidden='true' />,
        id: 'todaySpecialRegistration',
        label: '오늘의 특가 상품 등록',
      }),
      createSidebarItem({
        icon: <IcPlus aria-hidden='true' />,
        id: 'eventDiscountRegistration',
        label: '행사 할인 상품 등록',
      }),
      createSidebarItem({
        icon: <IcWrite aria-hidden='true' />,
        id: 'todaySpecialEdit',
        label: '오늘의 특가 상품 수정',
      }),
      createSidebarItem({
        icon: <IcWrite aria-hidden='true' />,
        id: 'eventDiscountEdit',
        label: '행사 할인 상품 수정',
      }),
    ],
    title: '상품을 등록하고 오늘의 전단을 만들어보세요',
  },
];

const footerItems: SidebarItem[] = [
  {
    icon: <IcSetting aria-hidden='true' />,
    id: 'settings',
    label: '환경설정',
  },
];

const sidebarRouteEntries = Object.entries(sidebarItemRoutes) as [
  SidebarItemIdTypes,
  MarketOwnerRouteTypes,
][];

const getActiveSidebarItemId = (pathname: string): SidebarItemIdTypes | undefined => {
  return sidebarRouteEntries.find(([, path]) => path === pathname)?.[0];
};

const SidebarBrand = () => (
  <span className={S.brandClassName}>
    <span aria-hidden='true' className={S.brandLogoClassName}>
      DC
    </span>
    <span>동치미</span>
  </span>
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
        <Outlet />
      </div>
    </div>
  );
};
