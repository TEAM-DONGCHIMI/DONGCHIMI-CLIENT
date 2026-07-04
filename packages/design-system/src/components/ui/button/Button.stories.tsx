import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';
import { IcChevronRight } from '../../../icons';

const desktopButtonSizes = ['large', 'medium', 'small'] as const;
const buttonPresets = [
  { color: 'primary', disabled: false, variant: 'solid' },
  { color: 'assistive', disabled: false, variant: 'outlined' },
  { color: 'assistiveLight', disabled: false, variant: 'outlined' },
  { color: 'negative', disabled: false, variant: 'outlined' },
  { color: 'primary', disabled: false, variant: 'soft' },
  { color: 'primary', disabled: true, variant: 'solid' },
  { color: 'assistive', disabled: false, variant: 'solid' },
] as const;
const xsmallButtonPresets = [
  { label: 'Primary', props: { color: 'primary', disabled: false, variant: 'solid' } },
  {
    label: 'Outline / Negative',
    props: { color: 'negative', disabled: false, variant: 'outlined' },
  },
  { label: 'Soft', props: { color: 'primary', disabled: false, variant: 'soft' } },
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
      options: ['large', 'medium', 'small', 'xsmall', 'mobile'],
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

export const XSmall: StoryTypes = {
  args: {
    size: 'xsmall',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Figma의 Button xsmall 추가분입니다. 150px x 36px, 12px label, 16px icon slot을 기준으로 합니다.',
      },
    },
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
        story: 'Button size preset을 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {desktopButtonSizes.map((size) => (
          <Button key={size} size={size}>
            로그인
          </Button>
        ))}
        <Button size='xsmall'>로그인</Button>
        <Button size='mobile'>로그인</Button>
      </div>
    );
  },
};

export const Mobile: StoryTypes = {
  args: {
    color: 'primary',
    leftIcon: <DemoIcon />,
    rightIcon: <DemoIcon />,
    size: 'mobile',
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile preset 버튼입니다. 현재 구현에서는 기존 mobile 높이를 유지하고, 좌우 아이콘 슬롯도 렌더링합니다.',
      },
    },
  },
};

export const XSmallIconMatrix: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story:
          'xsmall size의 default, left icon, right icon, both icon 조합을 확인합니다. 아이콘 슬롯은 variant와 무관하게 동일하므로 primary preset으로만 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(4, max-content)',
        }}
      >
        <Button size='xsmall'>로그인</Button>
        <Button leftIcon={<DemoIcon />} size='xsmall'>
          로그인
        </Button>
        <Button rightIcon={<DemoIcon />} size='xsmall'>
          로그인
        </Button>
        <Button leftIcon={<DemoIcon />} rightIcon={<DemoIcon />} size='xsmall'>
          로그인
        </Button>
      </div>
    );
  },
};

export const VariantMatrix: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story: 'Figma에 정의된 button preset을 size별로 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {desktopButtonSizes.map((size) => (
          <div
            key={size}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, max-content)',
              gap: 16,
            }}
          >
            {buttonPresets.map((preset) => (
              <Button
                key={`${size}-${preset.variant}-${preset.color}-${
                  preset.disabled === true ? 'disabled' : 'enabled'
                }`}
                {...preset}
                size={size}
              >
                로그인
              </Button>
            ))}
          </div>
        ))}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, max-content)',
            gap: 16,
          }}
        >
          {xsmallButtonPresets.map(({ label, props }) => (
            <Button key={`xsmall-${label}`} {...props} size='xsmall'>
              로그인
            </Button>
          ))}
        </div>
        <Button size='mobile'>로그인</Button>
      </div>
    );
  },
};

export const VariantICN: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story:
          'Variant-ICN은 별도 variant가 아니라 button preset에 좌우 아이콘 슬롯이 optional로 붙은 상태입니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        {desktopButtonSizes.map((size) => (
          <div
            key={size}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, max-content)',
              gap: 16,
            }}
          >
            {buttonPresets.map((preset) => (
              <Button
                key={`${size}-${preset.variant}-${preset.color}-${
                  preset.disabled === true ? 'disabled' : 'enabled'
                }`}
                {...preset}
                leftIcon={<DemoIcon />}
                rightIcon={<DemoIcon />}
                size={size}
              >
                로그인
              </Button>
            ))}
          </div>
        ))}
        <Button leftIcon={<DemoIcon />} rightIcon={<DemoIcon />} size='xsmall'>
          로그인
        </Button>
        <Button leftIcon={<DemoIcon />} rightIcon={<DemoIcon />} size='mobile'>
          로그인
        </Button>
      </div>
    );
  },
};
