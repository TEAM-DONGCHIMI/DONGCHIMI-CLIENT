import type { Meta, StoryObj } from '@storybook/react-vite';

import { atomic, semantic, shadow, text } from '../styles';

import '../styles/reset.css';

const neutralSteps = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90] as const;

const semanticColors = [
  ['primary/normal', semantic.primary.normal],
  ['primary/strong', semantic.primary.strong],
  ['primary/light', semantic.primary.light],
  ['status/positive', semantic.status.positive],
  ['status/cautionary', semantic.status.cautionary],
  ['status/negative', semantic.status.negative],
  ['overlay/dimmer', semantic.overlay.dimmer],
] as const;

const textSteps = [
  'display-1-bold',
  'title-1-semibold',
  'heading-1-semibold',
  'body-1-medium',
  'body-2-regular',
  'caption-1-regular',
] as const;

const shadowSteps = ['small', 'medium'] as const;

const Swatch = ({ name, color }: { name: string; color: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: color,
        border: `1px solid ${atomic.neutral[20]}`,
      }}
    />
    <span className={text['caption-1-regular']} style={{ color: atomic.neutral[70] }}>
      {name}
    </span>
  </div>
);

const Foundations = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 24 }}>
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className={text['heading-2-semibold']}>Color · Atomic / Neutral</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {neutralSteps.map((step) => (
          <Swatch key={step} name={String(step)} color={atomic.neutral[step]} />
        ))}
      </div>
    </section>

    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className={text['heading-2-semibold']}>Color · Semantic</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {semanticColors.map(([name, color]) => (
          <Swatch key={name} name={name} color={color} />
        ))}
      </div>
    </section>

    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className={text['heading-2-semibold']}>Typography</p>
      {textSteps.map((key) => (
        <p key={key} className={text[key]}>
          {key} · 동치미 디자인 시스템
        </p>
      ))}
    </section>

    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className={text['heading-2-semibold']}>Shadow</p>
      <div style={{ display: 'flex', gap: 32 }}>
        {shadowSteps.map((step) => (
          <div key={step} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 140,
                height: 90,
                borderRadius: 12,
                backgroundColor: atomic.common[0],
                boxShadow: shadow.normal[step],
              }}
            />
            <span className={text['caption-1-regular']}>normal/{step}</span>
          </div>
        ))}
      </div>
    </section>

    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className={text['body-1-medium']}>Reset</p>
      <ul>
        <li className={text['body-1-medium']}>ul · li - 불릿/기본 패딩 없음</li>
        <li className={text['body-1-medium']}>적용 안 됐으면 여기에 점(•)이 보임</li>
      </ul>
      <button className={text['body-1-medium']}>
        button — 기본 테두리 , 배경 없음 (적용 안 됐으면 회색 chrome)
      </button>
    </section>
  </div>
);

const meta = {
  title: 'Foundations/Tokens',
  component: Foundations,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Foundations>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Tokens: StoryTypes = {};
