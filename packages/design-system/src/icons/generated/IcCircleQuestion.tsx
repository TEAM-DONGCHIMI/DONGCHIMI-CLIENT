import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleQuestion = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <g fill='#191F28'>
      <path d='M11.182 13.025c-.088.482.322.885.812.885s.86-.41 1.023-.871c.216-.608.653-.974 1.088-1.337.603-.505 1.203-1.006 1.203-2.147 0-1.766-1.43-2.806-3.252-2.806-1.655 0-2.904.873-3.269 2.29-.122.474.29.879.78.879.488 0 .847-.423 1.073-.856.244-.465.712-.73 1.346-.735.872.007 1.48.51 1.48 1.298 0 .638-.4.942-.87 1.3-.55.419-1.198.911-1.414 2.1M10.87 16.101c-.007.628.467 1.089 1.13 1.089.65 0 1.124-.46 1.13-1.089-.006-.628-.48-1.089-1.13-1.089-.663 0-1.137.461-1.13 1.09' />
      <path
        fillRule='evenodd'
        d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M3.818 12a8.182 8.182 0 1 1 16.364 0 8.182 8.182 0 0 1-16.364 0'
        clipRule='evenodd'
      />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleQuestion);
const Memo = memo(ForwardRef);
export default Memo;
