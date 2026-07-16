import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRegistrationResultImageUploads } from './useRegistrationResultImageUploads';

const createDeferred = <Value>() => {
  let rejectPromise: (reason?: unknown) => void = () => undefined;
  let resolvePromise: (value: Value) => void = () => undefined;
  const promise = new Promise<Value>((resolve, reject) => {
    rejectPromise = reject;
    resolvePromise = resolve;
  });

  return { promise, reject: rejectPromise, resolve: resolvePromise };
};

describe('useRegistrationResultImageUploads', () => {
  it('starts an upload immediately and exposes its object key after success', async () => {
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    const upload = createDeferred<string>();
    const resolveProductImageFileObjectKey = vi.fn().mockReturnValue(upload.promise);
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({ resolveProductImageFileObjectKey }),
    );
    let uploadPromise!: ReturnType<typeof result.current.action.uploadImage>;

    act(() => {
      uploadPromise = result.current.action.uploadImage('product-1', imageFile);
    });

    expect(resolveProductImageFileObjectKey).toHaveBeenCalledWith(imageFile);
    expect(result.current.state.isUploading).toBe(true);

    await act(async () => {
      upload.resolve('tmp/PRODUCT_THUMBNAIL/product.png');
      await uploadPromise;
    });

    expect(await uploadPromise!).toEqual({
      file: imageFile,
      objectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
      productId: 'product-1',
    });
    expect(result.current.action.getUploadedObjectKeys()).toEqual(
      new Map([['product-1', 'tmp/PRODUCT_THUMBNAIL/product.png']]),
    );
    expect(result.current.state.isUploading).toBe(false);
  });

  it('ignores a late success from an older selection on the same row', async () => {
    const firstFile = new File(['first'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' });
    const firstUpload = createDeferred<string>();
    const secondUpload = createDeferred<string>();
    const resolveProductImageFileObjectKey = vi
      .fn()
      .mockReturnValueOnce(firstUpload.promise)
      .mockReturnValueOnce(secondUpload.promise);
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({ resolveProductImageFileObjectKey }),
    );
    let firstUploadPromise!: ReturnType<typeof result.current.action.uploadImage>;
    let secondUploadPromise!: ReturnType<typeof result.current.action.uploadImage>;

    act(() => {
      firstUploadPromise = result.current.action.uploadImage('product-1', firstFile);
      secondUploadPromise = result.current.action.uploadImage('product-1', secondFile);
    });

    await act(async () => {
      firstUpload.resolve('tmp/PRODUCT_THUMBNAIL/first.png');
      await firstUploadPromise;
    });

    expect(await firstUploadPromise!).toBeNull();
    expect(result.current.state.isUploading).toBe(true);
    expect(result.current.action.getUploadedObjectKeys()).toEqual(new Map());

    await act(async () => {
      secondUpload.resolve('tmp/PRODUCT_THUMBNAIL/second.png');
      await secondUploadPromise;
    });

    expect(await secondUploadPromise!).toEqual({
      file: secondFile,
      objectKey: 'tmp/PRODUCT_THUMBNAIL/second.png',
      productId: 'product-1',
    });
    expect(result.current.action.getUploadedObjectKeys()).toEqual(
      new Map([['product-1', 'tmp/PRODUCT_THUMBNAIL/second.png']]),
    );
  });

  it('ignores a late failure from an older selection on the same row', async () => {
    const firstFile = new File(['first'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' });
    const firstUpload = createDeferred<string>();
    const secondUpload = createDeferred<string>();
    const onUploadError = vi.fn();
    const resolveProductImageFileObjectKey = vi
      .fn()
      .mockReturnValueOnce(firstUpload.promise)
      .mockReturnValueOnce(secondUpload.promise);
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({
        onUploadError,
        resolveProductImageFileObjectKey,
      }),
    );
    let firstUploadPromise!: ReturnType<typeof result.current.action.uploadImage>;
    let secondUploadPromise!: ReturnType<typeof result.current.action.uploadImage>;

    act(() => {
      firstUploadPromise = result.current.action.uploadImage('product-1', firstFile);
      secondUploadPromise = result.current.action.uploadImage('product-1', secondFile);
    });

    await act(async () => {
      firstUpload.reject(new Error('stale upload failed'));
      await firstUploadPromise;
    });

    expect(await firstUploadPromise).toBeNull();
    expect(onUploadError).not.toHaveBeenCalled();
    expect(result.current.state.isUploading).toBe(true);

    await act(async () => {
      secondUpload.resolve('tmp/PRODUCT_THUMBNAIL/second.png');
      await secondUploadPromise;
    });

    expect(await secondUploadPromise).toEqual({
      file: secondFile,
      objectKey: 'tmp/PRODUCT_THUMBNAIL/second.png',
      productId: 'product-1',
    });
    expect(onUploadError).not.toHaveBeenCalled();
  });

  it('keeps the latest failure blocking until a reselect succeeds', async () => {
    const failedFile = new File(['failed'], 'failed.png', { type: 'image/png' });
    const retryFile = new File(['retry'], 'retry.png', { type: 'image/png' });
    const onUploadError = vi.fn();
    const resolveProductImageFileObjectKey = vi
      .fn()
      .mockRejectedValueOnce(new Error('upload failed'))
      .mockResolvedValueOnce('tmp/PRODUCT_THUMBNAIL/retry.png');
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({
        onUploadError,
        resolveProductImageFileObjectKey,
      }),
    );

    await act(async () => {
      await result.current.action.uploadImage('product-1', failedFile);
    });

    expect(onUploadError).toHaveBeenCalledTimes(1);
    expect(result.current.state.hasUploadErrors).toBe(true);

    await act(async () => {
      await result.current.action.uploadImage('product-1', retryFile);
    });

    expect(result.current.state.hasUploadErrors).toBe(false);
    expect(result.current.action.getUploadedObjectKeys()).toEqual(
      new Map([['product-1', 'tmp/PRODUCT_THUMBNAIL/retry.png']]),
    );
  });

  it('acknowledges only the object key included in the saved draft', async () => {
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    const resolveProductImageFileObjectKey = vi
      .fn()
      .mockResolvedValue('tmp/PRODUCT_THUMBNAIL/product.png');
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({ resolveProductImageFileObjectKey }),
    );

    await act(async () => {
      await result.current.action.uploadImage('product-1', imageFile);
    });

    act(() => {
      result.current.action.acknowledgeSavedUploads(
        new Map([['product-1', 'tmp/PRODUCT_THUMBNAIL/stale.png']]),
      );
    });

    expect(result.current.action.getUploadedObjectKeys().size).toBe(1);

    act(() => {
      result.current.action.acknowledgeSavedUploads(
        new Map([['product-1', 'tmp/PRODUCT_THUMBNAIL/product.png']]),
      );
    });

    expect(result.current.action.getUploadedObjectKeys()).toEqual(new Map());
  });

  it('invalidates an in-flight upload when its row is removed', async () => {
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    const upload = createDeferred<string>();
    const resolveProductImageFileObjectKey = vi.fn().mockReturnValue(upload.promise);
    const { result } = renderHook(() =>
      useRegistrationResultImageUploads({ resolveProductImageFileObjectKey }),
    );
    let uploadPromise!: ReturnType<typeof result.current.action.uploadImage>;

    act(() => {
      uploadPromise = result.current.action.uploadImage('product-1', imageFile);
      result.current.action.removeUploads(['product-1']);
    });

    await act(async () => {
      upload.resolve('tmp/PRODUCT_THUMBNAIL/product.png');
      await uploadPromise;
    });

    expect(await uploadPromise!).toBeNull();
    expect(result.current.state.isUploading).toBe(false);
    expect(result.current.action.getUploadedObjectKeys()).toEqual(new Map());
  });

  it('ignores an in-flight upload result after unmount', async () => {
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    const upload = createDeferred<string>();
    const onUploadError = vi.fn();
    const resolveProductImageFileObjectKey = vi.fn().mockReturnValue(upload.promise);
    const { result, unmount } = renderHook(() =>
      useRegistrationResultImageUploads({
        onUploadError,
        resolveProductImageFileObjectKey,
      }),
    );
    let uploadPromise!: ReturnType<typeof result.current.action.uploadImage>;

    act(() => {
      uploadPromise = result.current.action.uploadImage('product-1', imageFile);
    });
    unmount();

    await act(async () => {
      upload.resolve('tmp/PRODUCT_THUMBNAIL/product.png');
      await uploadPromise;
    });

    expect(await uploadPromise).toBeNull();
    expect(onUploadError).not.toHaveBeenCalled();
  });
});
