import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcClose = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path
      fill='currentColor'
      d='M5.267 5.267a.91.91 0 0 1 1.29 0L12.5 11.21l5.943-5.943a.912.912 0 1 1 1.29 1.29L13.79 12.5l5.943 5.943a.912.912 0 1 1-1.29 1.29L12.5 13.79l-5.943 5.943a.912.912 0 1 1-1.29-1.29L11.21 12.5 5.267 6.557a.91.91 0 0 1 0-1.29'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcClose);
const Memo = memo(ForwardRef);
export default Memo;
