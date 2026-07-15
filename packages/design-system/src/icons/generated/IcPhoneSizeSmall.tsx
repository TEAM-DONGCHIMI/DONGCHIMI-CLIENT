import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcPhoneSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M13.305 17.928c-1.778-.36-4.491-1.355-7.184-4.049-2.694-2.693-3.689-5.406-4.049-7.184-.299-1.475.37-2.835 1.317-3.782l.222-.222a2.36 2.36 0 0 1 3.59.298l1.16 1.623a1.95 1.95 0 0 1-.21 2.517l-.674.675c.205.493.73 1.485 1.982 2.737s2.244 1.777 2.738 1.982l.674-.675a1.954 1.954 0 0 1 2.517-.208l1.624 1.16a2.36 2.36 0 0 1 .297 3.59l-.222.22c-.947.948-2.306 1.617-3.782 1.318m-6.148-5.085c2.46 2.46 4.9 3.337 6.439 3.65.843.17 1.73-.193 2.455-.918l.222-.222a.895.895 0 0 0-.113-1.361l-1.623-1.16a.49.49 0 0 0-.63.052l-.687.687c-.36.36-.937.564-1.51.336-.66-.263-1.848-.89-3.287-2.33-1.44-1.44-2.067-2.627-2.33-3.287-.228-.573-.024-1.15.336-1.51l.687-.687a.49.49 0 0 0 .052-.63L6.008 3.84a.895.895 0 0 0-1.361-.113l-.222.222c-.725.725-1.088 1.612-.917 2.455.312 1.54 1.189 3.98 3.649 6.44'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcPhoneSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
