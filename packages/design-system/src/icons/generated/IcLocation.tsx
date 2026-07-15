import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLocation = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='currentColor' fillRule='evenodd' clipRule='evenodd'>
      <path d='M16.955 18.49a27 27 0 0 1-2.7 2.439c-.404.32-.816.633-1.245.92a.94.94 0 0 1-1.022-.001c-.428-.287-.84-.6-1.243-.92a27 27 0 0 1-2.7-2.437C6.116 16.487 4 13.585 4 10.38 4 5.75 7.806 2 12.5 2S21 5.752 21 10.38c0 3.205-2.116 6.107-4.045 8.11M12.5 3.797c-3.688 0-6.679 2.947-6.679 6.584 0 2.475 1.68 4.936 3.545 6.874a25.6 25.6 0 0 0 3.134 2.744 25.6 25.6 0 0 0 3.134-2.744c1.866-1.938 3.545-4.399 3.545-6.874 0-3.637-2.99-6.584-6.679-6.584' />
      <path d='M12.5 6.739c-2.04 0-3.693 1.63-3.693 3.641s1.653 3.641 3.693 3.641 3.694-1.63 3.694-3.64c0-2.012-1.654-3.642-3.694-3.642m-1.872 3.641c0-1.02.838-1.846 1.872-1.846s1.872.827 1.872 1.846-.838 1.846-1.872 1.846-1.872-.827-1.872-1.846' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcLocation);
const Memo = memo(ForwardRef);
export default Memo;
