import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCirclePlusSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='#191F28'>
      <path d='M8.59 5.374a.59.59 0 0 0-1.181 0v2.035H5.373a.59.59 0 0 0 0 1.182H7.41v2.035a.591.591 0 1 0 1.182 0V8.591h2.035a.59.59 0 0 0 0-1.182H8.591z' />
      <path
        fillRule='evenodd'
        d='M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M2.68 8a5.318 5.318 0 1 1 10.637 0A5.318 5.318 0 0 1 2.68 8'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCirclePlusSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
