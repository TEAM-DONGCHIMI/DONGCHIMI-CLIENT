import type { Meta, StoryObj } from '@storybook/react-vite';

import { atomic } from '../../../tokens';
import { Button } from '../../ui/button';
import { Sidebar, type SidebarItem } from './Sidebar';

const meta = {
  title: 'Design System/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    activeItemId: 'home',
    'aria-label': '주 메뉴',
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

const PlaceholderIcon = () => (
  <span
    aria-hidden='true'
    style={{
      display: 'inline-block',
      width: 18,
      height: 18,
      border: `2px dashed ${atomic.neutral[90]}`,
      borderRadius: 5,
    }}
  />
);

const Avatar = () => (
  <span
    aria-hidden='true'
    style={{
      display: 'block',
      width: 40,
      height: 40,
      borderRadius: 999,
      background: 'linear-gradient(135deg, rgba(21, 196, 126, 0.18), rgba(25, 31, 40, 0.08))',
    }}
  />
);

const primaryItems: SidebarItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: <PlaceholderIcon />,
  },
];

const offerItems: SidebarItem[] = [
  {
    id: 'today-create',
    label: '오늘의 특가 상품 등록',
    icon: <PlaceholderIcon />,
  },
  {
    id: 'period-create',
    label: '날짜 지정 할인 상품 등록',
    icon: <PlaceholderIcon />,
  },
  {
    id: 'today-edit',
    label: '오늘의 특가 상품 수정',
    icon: <PlaceholderIcon />,
  },
  {
    id: 'period-edit',
    label: '날짜 지정 할인 상품 수정',
    icon: <PlaceholderIcon />,
  },
  {
    id: 'flyer-share',
    label: '오늘의 전단 공유',
    icon: <PlaceholderIcon />,
  },
];

export const Default: StoryTypes = {
  args: {
    brand: '동치미',
    footerItems: [
      {
        id: 'settings',
        label: '환경설정',
        icon: <PlaceholderIcon />,
      },
    ],
    profile: {
      avatar: <Avatar />,
      description: 'ddongchiim@gmail.com',
      name: '신선마트 사장님',
    },
    sections: [
      {
        items: primaryItems,
      },
      {
        title: '오늘의 전단을 만들어봐요',
        items: offerItems,
      },
    ],
    helpCard: (
      <>
        <span style={{ color: atomic.neutral[70], fontSize: 13, fontWeight: 700 }}>
          도움이 필요하신가요?
        </span>
        <Button
          color='assistiveLight'
          size='small'
          style={{ color: atomic.neutral[70] }}
          variant='outlined'
        >
          서비스 추가 이용하기
        </Button>
      </>
    ),
  },
};

export const LinkItems: StoryTypes = {
  args: {
    activeItemId: 'period-create',
    brand: '동치미',
    sections: [
      {
        items: [
          {
            href: '#home',
            id: 'home',
            label: '홈',
            icon: <PlaceholderIcon />,
          },
        ],
      },
      {
        title: '메뉴',
        items: offerItems.map((item) => ({
          ...item,
          href: `#${item.id}`,
        })),
      },
    ],
  },
};

export const DisabledItem: StoryTypes = {
  args: {
    activeItemId: 'home',
    brand: '동치미',
    sections: [
      {
        items: [
          ...primaryItems,
          {
            disabled: true,
            id: 'disabled',
            label: '오픈 예정',
            icon: <PlaceholderIcon />,
          },
        ],
      },
    ],
  },
};

export const Composed: StoryTypes = {
  args: {
    sections: [],
  },
  render: () => (
    <Sidebar.Root activeItemId='home' aria-label='주 메뉴'>
      <Sidebar.Brand>동치미</Sidebar.Brand>
      <Sidebar.Nav aria-label='주 메뉴'>
        <Sidebar.Section items={primaryItems} />
        <Sidebar.Section items={offerItems} title='오늘의 전단을 만들어봐요' />
      </Sidebar.Nav>
    </Sidebar.Root>
  ),
};
