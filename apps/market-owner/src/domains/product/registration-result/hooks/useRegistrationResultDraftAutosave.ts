import { useCallback, useEffect, useRef, useState } from 'react';

interface SaveDraftOptions {
  force?: boolean;
}

interface UseRegistrationResultDraftAutosaveParams<SaveResult> {
  debounceMs: number;
  enabled: boolean;
  hasPendingChanges: boolean;
  revision: number;
  onSave: (options?: SaveDraftOptions) => Promise<SaveResult>;
}

export const useRegistrationResultDraftAutosave = <SaveResult>({
  debounceMs,
  enabled,
  hasPendingChanges,
  revision,
  onSave,
}: UseRegistrationResultDraftAutosaveParams<SaveResult>) => {
  const onSaveRef = useRef(onSave);
  const activeSaveRef = useRef<Promise<SaveResult | null> | null>(null);
  const scheduledSaveRef = useRef<number | null>(null);
  const queuedSaveRef = useRef(false);
  const queuedForceRef = useRef(false);
  const isLeavingRef = useRef(false);
  const isMountedRef = useRef(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const clearScheduledSave = useCallback(() => {
    if (scheduledSaveRef.current == null) {
      return;
    }

    window.clearTimeout(scheduledSaveRef.current);
    scheduledSaveRef.current = null;
  }, []);

  const runSave = useCallback(
    (options: SaveDraftOptions = {}): Promise<SaveResult | null> => {
      clearScheduledSave();

      if (isLeavingRef.current) {
        return Promise.resolve(null);
      }

      if (activeSaveRef.current != null) {
        queuedSaveRef.current = true;
        queuedForceRef.current = queuedForceRef.current || options.force === true;

        return activeSaveRef.current;
      }

      const savePromise = (async () => {
        let forceNextSave = options.force === true;
        let latestResult: SaveResult | null = null;

        if (isMountedRef.current) {
          setIsSaving(true);
        }

        try {
          do {
            queuedSaveRef.current = false;

            const forceCurrentSave = forceNextSave || queuedForceRef.current;

            queuedForceRef.current = false;
            forceNextSave = false;
            latestResult = await onSaveRef.current({ force: forceCurrentSave });
          } while (queuedSaveRef.current && !isLeavingRef.current);

          return latestResult;
        } finally {
          activeSaveRef.current = null;

          if (isMountedRef.current) {
            setIsSaving(false);
          }
        }
      })();

      activeSaveRef.current = savePromise;

      return savePromise;
    },
    [clearScheduledSave],
  );

  useEffect(() => {
    clearScheduledSave();

    if (!enabled || !hasPendingChanges || isLeavingRef.current) {
      return undefined;
    }

    scheduledSaveRef.current = window.setTimeout(() => {
      scheduledSaveRef.current = null;
      void runSave();
    }, debounceMs);

    return clearScheduledSave;
  }, [clearScheduledSave, debounceMs, enabled, hasPendingChanges, revision, runSave]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearScheduledSave();
    };
  }, [clearScheduledSave]);

  const flush = useCallback(() => runSave({ force: true }), [runSave]);
  const stop = useCallback(() => {
    isLeavingRef.current = true;
    clearScheduledSave();
  }, [clearScheduledSave]);

  return {
    flush,
    isSaving,
    stop,
  };
};
