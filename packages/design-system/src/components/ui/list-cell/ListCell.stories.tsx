import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { ListCell, type ListCellFieldProps } from './ListCell';

const ChevronDownIcon = () => (
  <span aria-hidden='true' style={{ display: 'inline-flex', transform: 'rotate(90deg)' }}>
    <IcChevronRight />
  </span>
);

const PlusIcon = () => (
  <span aria-hidden='true' style={{ display: 'inline-flex', fontSize: 24, lineHeight: 1 }}>
    +
  </span>
);

const WarningIcon = () => (
  <span aria-hidden='true' style={{ display: 'inline-flex', fontSize: 12, lineHeight: 1 }}>
    !
  </span>
);

const successFields: ListCellFieldProps[] = [
  { id: 'name', value: '삼겹살 500G', width: 160 },
  { id: 'price', value: '19,500', width: 112 },
  {
    'aria-label': '카테고리 선택',
    id: 'category',
    onClick: fn(),
    trailingIcon: <ChevronDownIcon />,
    value: '김치/반찬',
    width: 128,
  },
  { id: 'description', value: '오늘 입고된 신선한 삼겹살', width: 319 },
  { id: 'period', value: '2026-06-30 ~ 2026-07-02', width: 198 },
];

const errorFields: ListCellFieldProps[] = [
  { id: 'name', placeholder: '제품명을 입력하세요', width: 160 },
  { id: 'price', placeholder: '가격을 입력하세요', width: 112 },
  {
    'aria-label': '카테고리 선택',
    id: 'category',
    onClick: fn(),
    trailingIcon: <ChevronDownIcon />,
    value: '김치/반찬',
    width: 128,
  },
  { id: 'description', placeholder: '홍보문구를 입력하세요', width: 319 },
  { id: 'period', placeholder: 'YYYY-MM-DD ~  YYYY-MM-DD', width: 198 },
];

const meta = {
  title: 'Design System/UI/ListCell',
  component: ListCell,
  parameters: {
    layout: 'padded',
  },
  args: {
    checkboxLabel: '상품 행 선택',
    fields: successFields,
    onCheckedChange: fn(),
  },
  argTypes: {
    fields: {
      control: false,
    },
    helperIcon: {
      control: false,
    },
    media: {
      control: false,
    },
    mediaActionIcon: {
      control: false,
    },
    onCheckedChange: {
      control: false,
    },
    onMediaAction: {
      control: false,
    },
  },
} satisfies Meta<typeof ListCell>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    media: <span style={{ width: '100%', height: '100%', background: '#e5e8eb' }} />,
    statusLabel: '등록완료',
  },
};

export const Error: StoryTypes = {
  args: {
    fields: errorFields,
    helperIcon: <WarningIcon />,
    helperText: '이미지 누락',
    mediaActionIcon: <PlusIcon />,
    mediaActionLabel: '이미지 추가',
    mediaStatus: 'error',
    onMediaAction: fn(),
    statusLabel: '수정 필요',
    statusTone: 'negative',
  },
};

export const FieldAction: StoryTypes = {
  args: {
    fields: successFields.map((field) =>
      field.id === 'category'
        ? {
            ...field,
            'aria-label': '카테고리 선택',
            onClick: fn(),
          }
        : field,
    ),
    media: <span style={{ width: '100%', height: '100%', background: '#e5e8eb' }} />,
    statusLabel: '등록완료',
  },
};

export const LongText: StoryTypes = {
  args: {
    fields: [
      { id: 'name', value: '매우 긴 제품명과 용량 정보가 들어간 상품명 텍스트', width: 160 },
      { id: 'price', value: '19,500', width: 112 },
      {
        'aria-label': '카테고리 선택',
        id: 'category',
        onClick: fn(),
        trailingIcon: <ChevronDownIcon />,
        value: '김치/반찬',
        width: 128,
      },
      {
        id: 'description',
        value: '한 줄 안에 들어가기 어려운 홍보 문구가 들어와도 셀 높이가 변하지 않습니다',
        width: 319,
      },
      { id: 'period', value: '2026-06-30 ~ 2026-07-02', width: 198 },
    ],
    helperIcon: <WarningIcon />,
    helperText: '긴 helper message가 들어와도 말줄임으로 처리합니다',
    media: <span style={{ width: '100%', height: '100%', background: '#e5e8eb' }} />,
    statusLabel: '등록완료',
  },
};

export const DisabledControls: StoryTypes = {
  args: {
    checkboxDisabled: true,
    fields: successFields.map((field) =>
      field.id === 'category'
        ? {
            ...field,
            'aria-label': '카테고리 선택',
            disabled: true,
            onClick: fn(),
          }
        : field,
    ),
    media: <span style={{ width: '100%', height: '100%', background: '#e5e8eb' }} />,
    statusLabel: '등록완료',
  },
};
