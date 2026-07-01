import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Tabs } from './Tabs';

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

const ControlledExample = () => {
  const [value, setValue] = useState('today');

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

const metaArgs = {
  defaultValue: 'today',
} as const;

export const Default: StoryTypes = {
  args: metaArgs,
  render: () => {
    return (
      <Tabs defaultValue='today'>
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
  args: metaArgs,
  render: () => {
    return (
      <Tabs defaultValue='period'>
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
  render: () => {
    return <ControlledExample />;
  },
  args: {
    value: 'today',
  },
};

export const ManualActivation: StoryTypes = {
  args: metaArgs,
  render: () => {
    return (
      <Tabs activationMode='manual' defaultValue='today' onValueChange={fn()}>
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
  args: metaArgs,
  render: () => {
    return (
      <Tabs defaultValue='today'>
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
