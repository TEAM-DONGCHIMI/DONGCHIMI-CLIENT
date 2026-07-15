import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcPhone = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fillRule='evenodd'
      d='M17.131 20.91c-2.222-.45-5.614-1.694-8.98-5.06-3.367-3.367-4.61-6.76-5.061-8.981-.374-1.845.462-3.544 1.647-4.728l.276-.277a2.95 2.95 0 0 1 4.488.372l1.45 2.029a2.44 2.44 0 0 1-.261 3.146l-.844.843c.257.617.912 1.857 2.477 3.423 1.566 1.565 2.806 2.22 3.423 2.477l.843-.844a2.44 2.44 0 0 1 3.146-.26l2.03 1.45a2.95 2.95 0 0 1 .37 4.486l-.276.277c-1.184 1.185-2.883 2.02-4.728 1.647m-7.685-6.356c3.075 3.075 6.124 4.171 8.049 4.561 1.054.214 2.162-.24 3.069-1.147l.277-.276a1.12 1.12 0 0 0-.141-1.703l-2.03-1.449a.61.61 0 0 0-.786.065l-.859.86c-.45.45-1.171.704-1.887.418-.825-.328-2.31-1.112-4.11-2.911-1.799-1.8-2.583-3.285-2.911-4.11-.286-.716-.031-1.437.419-1.887l.859-.86a.61.61 0 0 0 .065-.786L8.01 3.3a1.12 1.12 0 0 0-1.702-.14l-.276.276c-.907.907-1.36 2.015-1.147 3.07.39 1.924 1.486 4.973 4.56 8.048'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcPhone);
const Memo = memo(ForwardRef);
export default Memo;
