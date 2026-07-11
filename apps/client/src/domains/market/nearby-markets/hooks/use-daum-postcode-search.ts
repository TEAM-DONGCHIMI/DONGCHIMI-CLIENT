'use client';

import { useCallback, useEffect } from 'react';

type DaumPostcodeCompleteDataTypes = Readonly<{
  address: string;
  bname: string;
  jibunAddress: string;
  roadAddress: string;
  sido: string;
  sigungu: string;
}>;

type DaumPostcodeConstructorTypes = new (options: {
  oncomplete: (data: DaumPostcodeCompleteDataTypes) => void;
}) => {
  open: () => void;
};

declare global {
  interface Window {
    daum?: {
      Postcode?: DaumPostcodeConstructorTypes;
    };
  }
}

const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const DAUM_POSTCODE_SCRIPT_SRC = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

let daumPostcodeScriptPromise: Promise<void> | null = null;

const noop = () => undefined;

export const formatDaumPostcodeAdministrativeAddress = ({
  address,
  bname,
  sido,
  sigungu,
}: DaumPostcodeCompleteDataTypes) => {
  return [sido, sigungu, bname].filter(Boolean).join(' ') || address;
};

export const resolveDaumPostcodeMapAddress = ({
  address,
  jibunAddress,
  roadAddress,
}: DaumPostcodeCompleteDataTypes) => {
  return roadAddress || address || jibunAddress;
};

export const loadDaumPostcodeScript = () => {
  if (window.daum?.Postcode != null) {
    return Promise.resolve();
  }

  if (daumPostcodeScriptPromise != null) {
    return daumPostcodeScriptPromise;
  }

  daumPostcodeScriptPromise = new Promise<void>((resolve, reject) => {
    const handleError = (failedScript: HTMLScriptElement) => () => {
      daumPostcodeScriptPromise = null;
      failedScript.remove();
      reject(new Error('Failed to load Daum postcode script'));
    };

    const existingScript = document.getElementById(
      DAUM_POSTCODE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript != null) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', handleError(existingScript), { once: true });

      return;
    }

    const script = document.createElement('script');
    script.id = DAUM_POSTCODE_SCRIPT_ID;
    script.async = true;
    script.src = DAUM_POSTCODE_SCRIPT_SRC;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', handleError(script), { once: true });

    document.head.appendChild(script);
  });

  return daumPostcodeScriptPromise;
};

type UseDaumPostcodeSearchOptionsTypes = Readonly<{
  enabled: boolean;
  onError?: () => void;
  onSelectAddress: (address: { mapAddress: string; searchKeyword: string }) => void;
}>;

export const useDaumPostcodeSearch = ({
  enabled,
  onError,
  onSelectAddress,
}: UseDaumPostcodeSearchOptionsTypes) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadDaumPostcodeScript().catch(onError ?? noop);
  }, [enabled, onError]);

  return useCallback(() => {
    if (!enabled) {
      return;
    }

    void loadDaumPostcodeScript()
      .then(() => {
        const Postcode = window.daum?.Postcode;

        if (Postcode == null) {
          onError?.();

          return;
        }

        new Postcode({
          oncomplete: (data) => {
            onSelectAddress({
              mapAddress: resolveDaumPostcodeMapAddress(data),
              searchKeyword: formatDaumPostcodeAdministrativeAddress(data),
            });
          },
        }).open();
      })
      .catch(onError ?? noop);
  }, [enabled, onError, onSelectAddress]);
};
