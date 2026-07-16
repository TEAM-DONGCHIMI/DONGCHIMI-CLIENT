import { useEffect, useRef } from 'react';

interface UseProductListIntersectionObserverParams {
  enabled: boolean;
  onIntersect?: () => void;
  rootMargin?: string;
}

export const useProductListIntersectionObserver = <ElementTypes extends Element>({
  enabled,
  onIntersect,
  rootMargin = '400px 0px',
}: UseProductListIntersectionObserverParams) => {
  const targetRef = useRef<ElementTypes>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;

    if (!enabled || target == null) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onIntersectRef.current?.();
        }
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
};
