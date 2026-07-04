import { Chip } from './Chip';
import { PointChip } from './PointChip';
import { StatusChip } from './StatusChip';

const statusIcon = (
  <span
    aria-hidden='true'
    style={{
      width: 12,
      height: 12,
      border: '1px dashed currentColor',
      borderRadius: 3,
    }}
  />
);

const meta = {
  title: 'Design System/UI/Chip',
  component: Chip,
  args: {
    children: '162 조회',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'primary', 'negative', 'dark'],
    },
    rounded: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['desktop', 'mobile', 'mobileLarge'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'subtle'],
    },
  },
};

export default meta;

export const DefaultChips = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <section>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Desktop</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 69,
            alignItems: 'center',
            width: 338,
            padding: '88px 0',
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Chip color='negative' variant='solid'>
            10%
          </Chip>
          <Chip color='primary' variant='soft'>
            적용
          </Chip>
          <Chip color='negative' variant='solid'>
            수정 필요
          </Chip>
          <Chip color='neutral' variant='subtle'>
            162 조회
          </Chip>
        </div>
      </section>
      <section>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Mobile</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 72,
            alignItems: 'center',
            width: 338,
            padding: '139px 0 151px',
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Chip color='primary' size='mobile' variant='soft'>
            할인 6개
          </Chip>
          <Chip color='dark' size='mobile' variant='solid'>
            오늘까지
          </Chip>
          <Chip color='neutral' size='mobile' variant='subtle'>
            오늘까지
          </Chip>
          <div style={{ height: 53 }} />
          <Chip color='primary' size='mobileLarge' variant='solid'>
            오늘까지
          </Chip>
          <Chip color='negative' size='mobileLarge' variant='solid'>
            오늘까지
          </Chip>
        </div>
      </section>
    </div>
  ),
};

export const StatusChips = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 338 }}>
      <StatusChip leftIcon={statusIcon} status='error'>
        확인이 필요한 상품이 있어요 (12)
      </StatusChip>
      <StatusChip leftIcon={statusIcon} status='success'>
        모든 상품의 확인이 완료되었어요
      </StatusChip>
    </div>
  ),
};

export const PointChips = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <PointChip size='desktop'>10%</PointChip>
      <PointChip size='mobile'>10%</PointChip>
    </div>
  ),
};
