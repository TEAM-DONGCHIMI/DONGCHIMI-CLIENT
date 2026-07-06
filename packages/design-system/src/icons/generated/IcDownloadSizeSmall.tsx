import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcDownloadSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <g fill='currentColor'>
      <path d='M8 2c.326 0 .59.282.59.63v6.538l1.943-2.077a.564.564 0 0 1 .835 0c.23.246.23.645 0 .892l-2.95 3.153a.564.564 0 0 1-.835 0L4.632 7.983a.66.66 0 0 1 0-.892.564.564 0 0 1 .834 0L7.41 9.168V2.63C7.41 2.282 7.674 2 8 2' />
      <path d='M14 10.62c0-.348-.264-.63-.59-.63s-.59.282-.59.63v1.787c0 .57-.008.707-.036.799a.75.75 0 0 1-.463.495c-.086.03-.213.038-.747.038H4.426c-.534 0-.661-.008-.747-.038a.75.75 0 0 1-.463-.495c-.028-.092-.036-.228-.036-.799V10.62c0-.348-.264-.63-.59-.63s-.59.282-.59.63v1.532c0 .37 0 .687.02.947.02.272.066.538.187.791.183.383.474.694.831.888.238.13.486.178.741.2.243.022.539.022.886.022h6.67c.347 0 .643 0 .886-.021a1.8 1.8 0 0 0 .74-.2c.358-.195.65-.506.832-.889.12-.253.166-.519.187-.791.02-.26.02-.576.02-.947z' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcDownloadSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
