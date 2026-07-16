import { useCallback, useRef, useState } from 'react';

type DraftRevisionSnapshotTypes = ReadonlyMap<string, number>;

export const useRegistrationResultDraftRevisions = () => {
  const revisionsRef = useRef<DraftRevisionSnapshotTypes>(new Map());
  const revisionCounterRef = useRef(0);
  const [revision, setRevision] = useState(0);
  const [revisions, setRevisions] = useState<DraftRevisionSnapshotTypes>(new Map());

  const markChanged = useCallback((productIds: Iterable<string>) => {
    const nextRevisions = new Map(revisionsRef.current);

    Array.from(productIds).forEach((productId) => {
      revisionCounterRef.current += 1;
      nextRevisions.set(productId, revisionCounterRef.current);
    });

    revisionsRef.current = nextRevisions;
    setRevision(revisionCounterRef.current);
    setRevisions(nextRevisions);
  }, []);

  const getSnapshot = useCallback(() => new Map(revisionsRef.current), []);
  const hasPendingChangesNow = useCallback(() => revisionsRef.current.size > 0, []);
  const acknowledge = useCallback((savedSnapshot: DraftRevisionSnapshotTypes) => {
    const currentRevisions = revisionsRef.current;
    const acknowledgedProductIds = new Set<string>();

    savedSnapshot.forEach((savedRevision, productId) => {
      if (currentRevisions.get(productId) === savedRevision) {
        acknowledgedProductIds.add(productId);
      }
    });

    if (acknowledgedProductIds.size === 0) {
      return acknowledgedProductIds;
    }

    const nextRevisions = new Map(currentRevisions);

    acknowledgedProductIds.forEach((productId) => nextRevisions.delete(productId));
    revisionsRef.current = nextRevisions;
    setRevisions(nextRevisions);

    return acknowledgedProductIds;
  }, []);

  return {
    action: {
      acknowledge,
      getSnapshot,
      hasPendingChangesNow,
      markChanged,
    },
    state: {
      hasPendingChanges: revisions.size > 0,
      revision,
      revisions,
    },
  };
};
