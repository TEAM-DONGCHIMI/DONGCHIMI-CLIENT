import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleExclamationSizeXsmallColor60 = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 12 12'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <g fill='#6B7684'>
      <path d='M6.505 8.02a.505.505 0 1 1-1.01 0 .505.505 0 0 1 1.01 0M6.455 3.98a.455.455 0 1 0-.91 0v2.272a.455.455 0 0 0 .91 0z' />
      <path
        fillRule='evenodd'
        d='M1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6m5-4.09a4.09 4.09 0 1 0 0 8.18 4.09 4.09 0 0 0 0-8.18'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleExclamationSizeXsmallColor60);
const Memo = memo(ForwardRef);
export default Memo;
