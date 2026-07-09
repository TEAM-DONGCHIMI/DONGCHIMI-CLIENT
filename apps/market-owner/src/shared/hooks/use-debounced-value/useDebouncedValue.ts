import { useEffect, useState } from 'react';

export const DEFAULT_DEBOUNCE_DELAY_MS = 300;

export const useDebouncedValue = <ValueTypes>(
  value: ValueTypes,
  delayMs = DEFAULT_DEBOUNCE_DELAY_MS,
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
};
