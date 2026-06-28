import { style } from '@vanilla-extract/css';

import { styleVariants, type StyleVariantProps } from '../../styles';

const space = {
  none: '0',
  '2xs': 'var(--dongchimi-space-2xs, 0.25rem)',
  xs: 'var(--dongchimi-space-xs, 0.5rem)',
  sm: 'var(--dongchimi-space-sm, 0.75rem)',
  md: 'var(--dongchimi-space-md, 1rem)',
  lg: 'var(--dongchimi-space-lg, 1.5rem)',
  xl: 'var(--dongchimi-space-xl, 2rem)',
  '2xl': 'var(--dongchimi-space-2xl, 2.5rem)',
} as const;

export const gapClassNames = styleVariants(space, (gap) => ({
  gap,
}));

export type LayoutGapTypes = StyleVariantProps<typeof gapClassNames>;

export const boxDisplayClassNames = styleVariants({
  block: {
    display: 'block',
  },
  contents: {
    display: 'contents',
  },
  inlineBlock: {
    display: 'inline-block',
  },
});

export type BoxDisplayTypes = StyleVariantProps<typeof boxDisplayClassNames>;

export const flexDisplayClassNames = styleVariants({
  block: {
    display: 'flex',
  },
  inline: {
    display: 'inline-flex',
  },
});

export const flexDirectionClassNames = styleVariants({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  'row-reverse': {
    flexDirection: 'row-reverse',
  },
  'column-reverse': {
    flexDirection: 'column-reverse',
  },
});

export type FlexDirectionTypes = StyleVariantProps<typeof flexDirectionClassNames>;

export const flexAlignClassNames = styleVariants({
  start: {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  end: {
    alignItems: 'flex-end',
  },
  stretch: {
    alignItems: 'stretch',
  },
  baseline: {
    alignItems: 'baseline',
  },
});

export type FlexAlignTypes = StyleVariantProps<typeof flexAlignClassNames>;

export const flexJustifyClassNames = styleVariants({
  start: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  end: {
    justifyContent: 'flex-end',
  },
  between: {
    justifyContent: 'space-between',
  },
  around: {
    justifyContent: 'space-around',
  },
  evenly: {
    justifyContent: 'space-evenly',
  },
});

export type FlexJustifyTypes = StyleVariantProps<typeof flexJustifyClassNames>;

export const flexWrapClassNames = styleVariants({
  nowrap: {
    flexWrap: 'nowrap',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  'wrap-reverse': {
    flexWrap: 'wrap-reverse',
  },
});

export type FlexWrapTypes = StyleVariantProps<typeof flexWrapClassNames>;

export const gridDisplayClassNames = styleVariants({
  block: {
    display: 'grid',
  },
  inline: {
    display: 'inline-grid',
  },
});

export type GridColumnsTypes = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export const gridColumnClassNames: Record<GridColumnsTypes, string> = {
  1: style({
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  }),
  2: style({
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  }),
  3: style({
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  }),
  4: style({
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  }),
  5: style({
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  }),
  6: style({
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  }),
  12: style({
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  }),
};

export const gridAutoFitClassNames = styleVariants({
  sm: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 10rem), 1fr))',
  },
  md: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
  },
  lg: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
  },
});

export type GridAutoFitTypes = StyleVariantProps<typeof gridAutoFitClassNames>;

export const gridAlignClassNames = styleVariants({
  start: {
    alignItems: 'start',
  },
  center: {
    alignItems: 'center',
  },
  end: {
    alignItems: 'end',
  },
  stretch: {
    alignItems: 'stretch',
  },
});

export type GridAlignTypes = StyleVariantProps<typeof gridAlignClassNames>;

export const gridJustifyClassNames = styleVariants({
  start: {
    justifyItems: 'start',
  },
  center: {
    justifyItems: 'center',
  },
  end: {
    justifyItems: 'end',
  },
  stretch: {
    justifyItems: 'stretch',
  },
});

export type GridJustifyTypes = StyleVariantProps<typeof gridJustifyClassNames>;

export const centerClassName = style({
  placeItems: 'center',
});

export const centerMinHeightClassNames = styleVariants({
  full: {
    minHeight: '100%',
  },
  screen: {
    minHeight: '100dvh',
  },
});

export type CenterMinHeightTypes = StyleVariantProps<typeof centerMinHeightClassNames>;

export const containerBaseClassName = style({
  width: '100%',
});

export const containerCenteredClassName = style({
  marginInline: 'auto',
});

export const containerSizeClassNames = styleVariants({
  sm: {
    maxWidth: '48rem',
  },
  md: {
    maxWidth: '64rem',
  },
  lg: {
    maxWidth: '80rem',
  },
  xl: {
    maxWidth: '90rem',
  },
  full: {
    maxWidth: 'none',
  },
});

export type ContainerSizeTypes = StyleVariantProps<typeof containerSizeClassNames>;

export const containerGutterClassNames = styleVariants({
  none: {
    paddingInline: '0',
  },
  sm: {
    paddingInline: space.sm,
  },
  md: {
    paddingInline: space.md,
    '@media': {
      'screen and (min-width: 640px)': {
        paddingInline: space.lg,
      },
    },
  },
  lg: {
    paddingInline: space.md,
    '@media': {
      'screen and (min-width: 640px)': {
        paddingInline: space.lg,
      },
      'screen and (min-width: 1024px)': {
        paddingInline: space.xl,
      },
    },
  },
});

export type ContainerGutterTypes = StyleVariantProps<typeof containerGutterClassNames>;
