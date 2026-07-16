import { useCallback, useEffect, useRef, useState } from 'react';

import type { ResolveProductImageFileObjectKeyTypes } from '../utils/resolve-product-image-file-url';

interface RegistrationResultImageUploadBase {
  file: File;
  requestId: number;
}

type RegistrationResultImageUploadTypes =
  | (RegistrationResultImageUploadBase & { status: 'error' | 'uploading' })
  | (RegistrationResultImageUploadBase & { objectKey: string; status: 'uploaded' });

export interface RegistrationResultImageUploadResult {
  file: File;
  objectKey: string;
  productId: string;
}

interface UseRegistrationResultImageUploadsParams {
  onUploadError?: (error: unknown) => void;
  resolveProductImageFileObjectKey?: ResolveProductImageFileObjectKeyTypes;
}

export const useRegistrationResultImageUploads = ({
  onUploadError,
  resolveProductImageFileObjectKey,
}: UseRegistrationResultImageUploadsParams = {}) => {
  const imageUploadsRef = useRef<ReadonlyMap<string, RegistrationResultImageUploadTypes>>(
    new Map(),
  );
  const requestIdByProductRef = useRef<ReadonlyMap<string, number>>(new Map());
  const isMountedRef = useRef(true);
  const [imageUploads, setImageUploads] = useState<
    ReadonlyMap<string, RegistrationResultImageUploadTypes>
  >(() => new Map());

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const replaceImageUploads = useCallback(
    (nextImageUploads: ReadonlyMap<string, RegistrationResultImageUploadTypes>) => {
      imageUploadsRef.current = nextImageUploads;

      if (isMountedRef.current) {
        setImageUploads(nextImageUploads);
      }
    },
    [],
  );

  const createNextRequestId = useCallback((productId: string) => {
    const nextRequestId = (requestIdByProductRef.current.get(productId) ?? 0) + 1;
    const nextRequestIds = new Map(requestIdByProductRef.current);

    nextRequestIds.set(productId, nextRequestId);
    requestIdByProductRef.current = nextRequestIds;

    return nextRequestId;
  }, []);

  const uploadImage = useCallback(
    async (productId: string, file: File): Promise<RegistrationResultImageUploadResult | null> => {
      if (resolveProductImageFileObjectKey == null) {
        return null;
      }

      const requestId = createNextRequestId(productId);
      const nextImageUploads = new Map(imageUploadsRef.current);

      nextImageUploads.set(productId, { file, requestId, status: 'uploading' });
      replaceImageUploads(nextImageUploads);

      try {
        const objectKey = await resolveProductImageFileObjectKey(file);

        if (!isMountedRef.current || requestIdByProductRef.current.get(productId) !== requestId) {
          return null;
        }

        const uploadedImageUploads = new Map(imageUploadsRef.current);

        uploadedImageUploads.set(productId, {
          file,
          objectKey,
          requestId,
          status: 'uploaded',
        });
        replaceImageUploads(uploadedImageUploads);

        return { file, objectKey, productId };
      } catch (error) {
        if (!isMountedRef.current || requestIdByProductRef.current.get(productId) !== requestId) {
          return null;
        }

        const failedImageUploads = new Map(imageUploadsRef.current);

        failedImageUploads.set(productId, { file, requestId, status: 'error' });
        replaceImageUploads(failedImageUploads);
        onUploadError?.(error);

        return null;
      }
    },
    [createNextRequestId, onUploadError, replaceImageUploads, resolveProductImageFileObjectKey],
  );

  const removeUploads = useCallback(
    (productIds: Iterable<string>) => {
      const nextImageUploads = new Map(imageUploadsRef.current);

      Array.from(productIds).forEach((productId) => {
        createNextRequestId(productId);
        nextImageUploads.delete(productId);
      });

      replaceImageUploads(nextImageUploads);
    },
    [createNextRequestId, replaceImageUploads],
  );

  const getUploadedObjectKeys = useCallback(() => {
    const objectKeys = new Map<string, string>();

    imageUploadsRef.current.forEach((imageUpload, productId) => {
      if (imageUpload.status === 'uploaded') {
        objectKeys.set(productId, imageUpload.objectKey);
      }
    });

    return objectKeys;
  }, []);

  const acknowledgeSavedUploads = useCallback(
    (savedObjectKeys: ReadonlyMap<string, string>) => {
      const acknowledgedProductIds = new Set<string>();
      const nextImageUploads = new Map(imageUploadsRef.current);

      savedObjectKeys.forEach((savedObjectKey, productId) => {
        const imageUpload = nextImageUploads.get(productId);

        if (imageUpload?.status !== 'uploaded' || imageUpload.objectKey !== savedObjectKey) {
          return;
        }

        acknowledgedProductIds.add(productId);
        nextImageUploads.delete(productId);
      });

      if (acknowledgedProductIds.size > 0) {
        replaceImageUploads(nextImageUploads);
      }

      return acknowledgedProductIds;
    },
    [replaceImageUploads],
  );

  return {
    action: {
      acknowledgeSavedUploads,
      getUploadedObjectKeys,
      removeUploads,
      uploadImage,
    },
    state: {
      hasUploadErrors: Array.from(imageUploads.values()).some(
        (imageUpload) => imageUpload.status === 'error',
      ),
      isUploading: Array.from(imageUploads.values()).some(
        (imageUpload) => imageUpload.status === 'uploading',
      ),
    },
  };
};
