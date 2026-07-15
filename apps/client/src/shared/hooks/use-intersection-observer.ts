'use client';

import { useEffect, useRef } from 'react';

type UseIntersectionObserverOptionsTypes = Readonly<{
  enabled?: boolean;
  onIntersect: () => void;
  rootMargin?: string;
}>;

export const useIntersectionObserver = <ElementTypes extends Element>({
  enabled = true,
  onIntersect,
  rootMargin = '0px',
}: UseIntersectionObserverOptionsTypes) => {
  const targetRef = useRef<ElementTypes>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;

    if (!enabled || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
};
