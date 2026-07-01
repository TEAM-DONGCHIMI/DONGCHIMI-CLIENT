import { useState, type CSSProperties } from 'react';

import { Button, ListButton, NumButton } from '@dongchimi/design-system/components';
import { IcChevronRight } from '@dongchimi/design-system/icons';

const pageStyle = {
  minHeight: '100vh',
  overflowX: 'auto',
  backgroundColor: '#e9edf1',
  padding: '3.2rem 5.6rem',
} satisfies CSSProperties;

const pageContentStyle = {
  display: 'grid',
  gap: '2.8rem',
  justifyItems: 'start',
  minWidth: '112rem',
  maxWidth: '128rem',
  margin: '0 auto',
} satisfies CSSProperties;

const sectionStyle = {
  display: 'grid',
  gap: '1.6rem',
  justifyItems: 'start',
} satisfies CSSProperties;

const titleBlockStyle = {
  display: 'grid',
  gap: '0.8rem',
} satisfies CSSProperties;

const titleStyle = {
  margin: 0,
  color: '#111827',
  fontSize: '2.4rem',
  fontWeight: 500,
  lineHeight: 1.25,
} satisfies CSSProperties;

const descriptionStyle = {
  margin: 0,
  color: '#111827',
  fontSize: '1.4rem',
  lineHeight: 1.5,
} satisfies CSSProperties;

const subtitleStyle = {
  margin: '1.8rem 0 0',
  color: '#111827',
  fontSize: '2.4rem',
  fontWeight: 500,
  lineHeight: 1.25,
} satisfies CSSProperties;

const propertyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, max-content)',
  columnGap: '6.4rem',
  rowGap: '0.3rem',
  color: '#111827',
  fontFamily: 'monospace',
  fontSize: '1.1rem',
  fontWeight: 700,
  lineHeight: 1.25,
} satisfies CSSProperties;

const boardStyle = {
  display: 'grid',
  gap: '3.8rem',
  borderRadius: '1.6rem',
  backgroundColor: '#ffffff',
  padding: '5.6rem 3.2rem 4rem',
} satisfies CSSProperties;

const sizeGroupStyle = {
  display: 'grid',
  gridTemplateColumns: '7.2rem 1fr',
  alignItems: 'start',
  gap: '2rem',
} satisfies CSSProperties;

const sizeLabelStyle = {
  color: '#8b3dff',
  fontSize: '2.4rem',
  fontWeight: 500,
  lineHeight: 1,
  paddingTop: '1.2rem',
} satisfies CSSProperties;

const matrixStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, max-content)',
  columnGap: '4.4rem',
  rowGap: '1.2rem',
  alignItems: 'center',
} satisfies CSSProperties;

const columnLabelStyle = {
  color: '#8b3dff',
  fontSize: '1.1rem',
  textAlign: 'center',
} satisfies CSSProperties;

const buttonRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.2rem',
} satisfies CSSProperties;

const listButtonTestSectionStyle = {
  display: 'grid',
  gap: '1.2rem',
  justifyItems: 'start',
} satisfies CSSProperties;

const TestIcon = () => <IcChevronRight />;

const categories = ['전체', '카테고리 1', '카테고리 2', '카테고리 3'] as const;
const buttonSizes = [
  { label: '60Px', value: 'large' },
  { label: '54Px', value: 'medium' },
  { label: '44Px', value: 'small' },
  { label: 'Mobile', value: 'mobile' },
] as const;

const buttonPresets = [
  { label: 'Primary', props: { color: 'primary', variant: 'solid' } },
  { label: 'Outlined/Assistive', props: { color: 'assistive', variant: 'outlined' } },
  { label: 'Outlined/Assistive light', props: { color: 'assistiveLight', variant: 'outlined' } },
  { label: 'Outlined/Negative', props: { color: 'negative', variant: 'outlined' } },
  { label: 'Disabled', props: { color: 'primary', disabled: true, variant: 'solid' } },
  { label: 'Solid', props: { color: 'assistive', variant: 'solid' } },
  { label: 'Soft', props: { color: 'primary', variant: 'soft' } },
] as const;

const iconRows = [
  { label: 'Default', leftIcon: undefined, rightIcon: undefined },
  { label: 'Both icon', leftIcon: <TestIcon />, rightIcon: <TestIcon /> },
  { label: 'Left icon', leftIcon: <TestIcon />, rightIcon: undefined },
  { label: 'Right icon', leftIcon: undefined, rightIcon: <TestIcon /> },
] as const;

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('전체');
  const [selectedPage, setSelectedPage] = useState(1);

  return (
    <main style={pageStyle}>
      <div style={pageContentStyle}>
        <section aria-label='Design system button test' style={sectionStyle}>
          <div style={titleBlockStyle}>
            <h1 style={titleStyle}>Default button</h1>
            <p style={descriptionStyle}>
              일반적인 상황에서 사용되는 버튼입니다. 아이콘과 함께 사용되고 icn_only 버튼을 제외하고
              같은 라운드 값을 공유합니다.
            </p>
            <h2 style={subtitleStyle}>Variant</h2>
            <div style={propertyGridStyle}>
              <span>Font: Pretendard</span>
              <span>Icon Type: No Icon / Left Icon / Right Icon / Both Icons</span>
              <span>Rounded: True / False</span>
              <span>Variant: Solid / Outlined / Soft / Disabled</span>
              <span>Left Icon: True / False</span>
              <span>Text: True / False</span>
              <span>Color: Primary / Assistive / Negative</span>
              <span>Right Icon: True / False</span>
              <span>Label: Custom Text</span>
              <span>Size: Small / Medium / Large</span>
              <span>Icon Source: Icons Responsive</span>
              <span>Platform: Desktop / Mobile</span>
            </div>
          </div>

          <div style={boardStyle}>
            {buttonSizes.map(({ label, value }) => (
              <div key={value} style={sizeGroupStyle}>
                <div style={sizeLabelStyle}>{label}</div>
                <div style={matrixStyle}>
                  {buttonPresets.map(({ label: presetLabel }) => (
                    <div key={`${value}-${presetLabel}`} style={columnLabelStyle}>
                      {presetLabel}
                    </div>
                  ))}
                  {iconRows.flatMap(({ label: rowLabel, leftIcon, rightIcon }) =>
                    buttonPresets.map(({ label: presetLabel, props }) => (
                      <Button
                        key={`${value}-${rowLabel}-${presetLabel}`}
                        {...props}
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        size={value}
                      >
                        로그인
                      </Button>
                    )),
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label='Design system num button test' style={buttonRowStyle}>
          {[1, 2, 3, 4].map((page) => (
            <NumButton
              key={page}
              selected={selectedPage === page}
              onClick={() => setSelectedPage(page)}
            >
              {page}
            </NumButton>
          ))}
        </section>

        <section aria-label='Design system list button test' style={listButtonTestSectionStyle}>
          <ListButton>기본</ListButton>
          <ListButton selected>기본</ListButton>
          <ListButton color='primary' selected>
            기본
          </ListButton>
          {categories.map((category) => (
            <ListButton
              key={category}
              leftIcon={<TestIcon />}
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </ListButton>
          ))}
        </section>
      </div>
    </main>
  );
};
