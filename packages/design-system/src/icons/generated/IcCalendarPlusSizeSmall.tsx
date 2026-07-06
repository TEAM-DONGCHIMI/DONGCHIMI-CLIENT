import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCalendarPlusSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 16 16'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #1A1E27)'
      d='M10.333 1c.368 0 .667.305.667.682v.682h1.333c.53 0 1.04.215 1.414.599.376.383.586.904.586 1.446v4.773a.674.674 0 0 1-.666.682.674.674 0 0 1-.667-.682V7.818H2.333v6.137c0 .18.07.354.196.482a.66.66 0 0 0 .471.2h5.333c.369 0 .667.305.667.681a.674.674 0 0 1-.667.682H3c-.53 0-1.039-.216-1.414-.6A2.07 2.07 0 0 1 1 13.955V4.41c0-.542.21-1.063.586-1.446.375-.384.884-.6 1.414-.6h1.333v-.681C4.333 1.305 4.632 1 5 1s.667.305.667.682v.682h4v-.682c0-.377.298-.682.666-.682m2 9.546c.368 0 .667.305.667.681v1.364h1.333c.368 0 .667.305.667.682a.674.674 0 0 1-.667.681H13v1.364a.674.674 0 0 1-.667.682.674.674 0 0 1-.666-.682v-1.364h-1.334a.674.674 0 0 1-.666-.681c0-.377.298-.682.666-.682h1.334v-1.364c0-.376.298-.681.666-.681M3 3.727a.66.66 0 0 0-.471.2.7.7 0 0 0-.196.482v2.046H13V4.409a.7.7 0 0 0-.195-.482.66.66 0 0 0-.472-.2H11v.682a.674.674 0 0 1-.667.682.674.674 0 0 1-.666-.682v-.682h-4v.682A.674.674 0 0 1 5 5.091a.674.674 0 0 1-.667-.682v-.682z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCalendarPlusSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
