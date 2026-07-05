import type { Meta, StoryObj } from '@storybook/react-vite';

import { InlineField, type InlineFieldProps } from './InlineField';

type InlineFieldStoryProps = Omit<
  InlineFieldProps,
  'aria-label' | 'aria-labelledby' | 'readOnly' | 'status'
> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  readOnly?: boolean;
  status?: 'default' | 'error';
};

const INLINE_FIELD_STORY_WIDTH = 319;
const VARIANT_MATRIX_WIDTH = 686;

const StoryInlineField = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  readOnly,
  status,
  ...props
}: InlineFieldStoryProps) => {
  const stateProps = readOnly ? { readOnly: true as const } : { readOnly: false as const, status };

  if (ariaLabelledBy !== undefined) {
    return <InlineField {...props} {...stateProps} aria-labelledby={ariaLabelledBy} />;
  }

  return <InlineField {...props} {...stateProps} aria-label={ariaLabel ?? 'Inline value'} />;
};

const meta = {
  title: 'Design System/UI/InlineField',
  component: InlineField,
  args: {
    'aria-label': 'Inline value',
    placeholder: '홍보문구를 입력하세요',
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: INLINE_FIELD_STORY_WIDTH }}>
      <StoryInlineField {...args} />
    </div>
  ),
} satisfies Meta<typeof InlineField>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const AriaLabelledBy: StoryTypes = {
  render: (args) => (
    <div style={{ width: INLINE_FIELD_STORY_WIDTH }}>
      <span id='inline-field-labelledby-story' style={{ display: 'block', marginBottom: 8 }}>
        Inline value
      </span>
      <StoryInlineField
        {...args}
        aria-label={undefined}
        aria-labelledby='inline-field-labelledby-story'
      />
    </div>
  ),
};

export const Small: StoryTypes = {
  args: {
    size: 'small',
  },
};

export const Filled: StoryTypes = {
  args: {
    defaultValue: 'Value',
  },
};

export const WithUnit: StoryTypes = {
  args: {
    defaultValue: '10,000',
    inputMode: 'numeric',
    unit: '원',
  },
};

export const Error: StoryTypes = {
  args: {
    defaultValue: 'Invalid value',
    status: 'error',
  },
};

export const ReadOnly: StoryTypes = {
  args: {
    defaultValue: 'Read only value',
    readOnly: true,
  },
};

export const LongValue: StoryTypes = {
  args: {
    defaultValue: 'A long value that does not overlap the trailing unit',
    unit: '원',
  },
};

export const VariantMatrix: StoryTypes = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: VARIANT_MATRIX_WIDTH }}>
      {(['small', 'medium'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InlineField aria-label={`${size} empty value`} placeholder='Enter a value' size={size} />
          <InlineField
            aria-label={`${size} value with unit`}
            defaultValue='10,000'
            size={size}
            unit='원'
          />
          <InlineField aria-label={`${size} error value`} size={size} status='error' />
          <InlineField
            aria-label={`${size} read only value`}
            readOnly
            size={size}
            value='Read only'
          />
        </div>
      ))}
    </div>
  ),
};
