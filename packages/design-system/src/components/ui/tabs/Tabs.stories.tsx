import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Tabs, type TabsProps } from './Tabs';

const meta = {
  title: 'Design System/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

const panels = {
  period: '기간 할인 상품을 관리합니다.',
  today: '오늘의 특가 상품을 관리합니다.',
};

const handleManualValueChange = fn();

const ControlledExample = ({ value: initialValue = 'today' }: Pick<TabsProps, 'value'>) => {
  const [value, setValue] = useState(initialValue);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <Tabs.List aria-label='제어형 할인 유형'>
        <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
        <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value='today'>{panels.today}</Tabs.Panel>
      <Tabs.Panel value='period'>{panels.period}</Tabs.Panel>
    </Tabs>
  );
};

export const Default: StoryTypes = {
  args: {
    defaultValue: 'today',
  },
  render: (args) => {
    return (
      <Tabs {...args}>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>{panels.today}</Tabs.Panel>
        <Tabs.Panel value='period'>{panels.period}</Tabs.Panel>
      </Tabs>
    );
  },
};

export const ActiveRight: StoryTypes = {
  args: {
    defaultValue: 'period',
  },
  render: (args) => {
    return (
      <Tabs {...args}>
        <Tabs.List aria-label='할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>{panels.today}</Tabs.Panel>
        <Tabs.Panel value='period'>{panels.period}</Tabs.Panel>
      </Tabs>
    );
  },
};

export const Controlled: StoryTypes = {
  args: {
    value: 'today',
  },
  render: (args) => <ControlledExample value={args.value} />,
};

export const ManualActivation: StoryTypes = {
  args: {
    activationMode: 'manual',
    defaultValue: 'today',
    onValueChange: handleManualValueChange,
  },
  render: (args) => {
    return (
      <Tabs {...args}>
        <Tabs.List aria-label='수동 활성화 할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger value='period'>기간 할인</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>{panels.today}</Tabs.Panel>
        <Tabs.Panel value='period'>{panels.period}</Tabs.Panel>
      </Tabs>
    );
  },
};

export const DisabledTrigger: StoryTypes = {
  args: {
    defaultValue: 'today',
  },
  render: (args) => {
    return (
      <Tabs {...args}>
        <Tabs.List aria-label='비활성 탭 포함 할인 유형'>
          <Tabs.Trigger value='today'>오늘의 특가</Tabs.Trigger>
          <Tabs.Trigger disabled value='period'>
            기간 할인
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value='today'>{panels.today}</Tabs.Panel>
        <Tabs.Panel value='period'>{panels.period}</Tabs.Panel>
      </Tabs>
    );
  },
};
