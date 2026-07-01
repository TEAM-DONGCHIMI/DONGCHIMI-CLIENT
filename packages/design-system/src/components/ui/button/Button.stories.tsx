import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';
import { IcChevronRight } from '../../../icons';

const buttonSizes = ['large', 'medium', 'small'] as const;
const buttonPresets = [
  { color: 'primary', disabled: false, variant: 'solid' },
  { color: 'assistive', disabled: false, variant: 'outlined' },
  { color: 'assistiveLight', disabled: false, variant: 'outlined' },
  { color: 'negative', disabled: false, variant: 'outlined' },
  { color: 'primary', disabled: false, variant: 'soft' },
  { color: 'primary', disabled: true, variant: 'solid' },
  { color: 'assistive', disabled: false, variant: 'solid' },
] as const;

const DemoIcon = () => <IcChevronRight />;

const meta = {
  title: 'Design System/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'assistive', 'assistiveLight', 'negative'],
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'mobile'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outlined', 'soft'],
    },
  },
  args: {
    children: '로그인',
  },
} satisfies Meta<typeof Button>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    color: 'primary',
    size: 'small',
    variant: 'solid',
  },
};

export const LeftIcon: StoryTypes = {
  args: {
    leftIcon: <DemoIcon />,
  },
};

export const RightIcon: StoryTypes = {
  args: {
    rightIcon: <DemoIcon />,
  },
};

export const Disabled: StoryTypes = {
  args: {
    disabled: true,
  },
};

export const SizeMatrix: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story: 'Desktop에서 사용하는 large, medium, small size를 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {buttonSizes.map((size) => (
          <Button key={size} size={size}>
            로그인
          </Button>
        ))}
      </div>
    );
  },
};

export const Mobile: StoryTypes = {
  args: {
    color: 'primary',
    size: 'mobile',
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile 전용 버튼입니다. solid primary 조합만 사용하고 아이콘 슬롯은 렌더링하지 않습니다.',
      },
    },
  },
};

export const VariantMatrix: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story: 'Figma에 정의된 desktop button preset을 size별로 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {buttonSizes.map((size) => (
          <div
            key={size}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, max-content)',
              gap: 16,
            }}
          >
            {buttonPresets.map(({ color, disabled, variant }) => (
              <Button
                key={`${size}-${variant}-${color}-${disabled === true ? 'disabled' : 'enabled'}`}
                color={color}
                disabled={disabled}
                size={size}
                variant={variant}
              >
                로그인
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const VariantICN: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story:
          'Variant-ICN은 별도 variant가 아니라 desktop button preset에 좌우 아이콘 슬롯이 optional로 붙은 상태입니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {buttonSizes.map((size) => (
          <div
            key={size}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, max-content)',
              gap: 16,
            }}
          >
            {buttonPresets.map(({ color, disabled, variant }) => (
              <Button
                key={`${size}-${variant}-${color}-${disabled === true ? 'disabled' : 'enabled'}`}
                color={color}
                disabled={disabled}
                leftIcon={<DemoIcon />}
                rightIcon={<DemoIcon />}
                size={size}
                variant={variant}
              >
                로그인
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
