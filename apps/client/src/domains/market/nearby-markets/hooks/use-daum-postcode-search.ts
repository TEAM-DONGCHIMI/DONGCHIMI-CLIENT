'use client';

import { useCallback, useEffect } from 'react';

type DaumPostcodeCompleteDataTypes = Readonly<{
  // 사용자가 선택한 유형(도로명/지번)에 맞춰 Daum이 골라주는 기본 주소입니다. input 표시값으로 그대로 사용합니다.
  address: string;
  jibunAddress: string;
  roadAddress: string;
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
const DAUM_POSTCODE_MISSING_ERROR_MESSAGE = 'Daum postcode constructor is unavailable';

let daumPostcodeScriptPromise: Promise<void> | null = null;

// onError가 없을 때 promise rejection을 삼키기 위한 기본 handler입니다.
const noop = (error: Error) => {
  void error;
};

// Kakao geocoder에 넘길 지도 좌표 변환용 주소를 고릅니다.
export const resolveDaumPostcodeMapAddress = ({
  address,
  jibunAddress,
  roadAddress,
}: DaumPostcodeCompleteDataTypes) => {
  // 지도 좌표 변환은 도로명 주소가 가장 안정적이고, 없으면 Daum 기본 주소와 지번 주소 순서로 보완합니다.
  return roadAddress || address || jibunAddress;
};

// Daum postcode script는 여러 번 삽입하지 않도록 module-level promise로 공유합니다.
export const loadDaumPostcodeScript = () => {
  if (window.daum?.Postcode != null) {
    return Promise.resolve();
  }

  if (daumPostcodeScriptPromise != null) {
    return daumPostcodeScriptPromise;
  }

  daumPostcodeScriptPromise = new Promise<void>((resolve, reject) => {
    const handleError = (failedScript: HTMLScriptElement) => () => {
      // 실패한 script와 promise를 버려야 다음 클릭에서 다시 로드할 수 있습니다.
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
  // false이면 script preload와 팝업 열기를 모두 막습니다.
  enabled: boolean;
  // script 로드 실패나 Daum Postcode 객체 누락을 화면 쪽에서 처리하기 위한 callback입니다.
  onError?: (error: Error) => void;
  // 사용자가 Daum 팝업에서 주소를 선택했을 때 provider로 넘길 callback입니다.
  onSelectAddress: (address: { mapAddress: string; searchKeyword: string }) => void;
}>;

// 위치 권한 허용 여부와 관계없이 input 클릭 시 Daum 우편번호 검색 팝업을 열 수 있는 click handler를 만듭니다.
export const useDaumPostcodeSearch = ({
  enabled,
  onError,
  onSelectAddress,
}: UseDaumPostcodeSearchOptionsTypes) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // 첫 클릭 전에 script를 미리 로드해둡니다.
    void loadDaumPostcodeScript().catch(onError ?? noop);
  }, [enabled, onError]);

  // input 클릭 시 실행되는 함수입니다.
  return useCallback(() => {
    if (!enabled) {
      return;
    }

    // 클릭 시점에 script가 아직 없으면 먼저 로드한 뒤 팝업을 엽니다.
    void loadDaumPostcodeScript()
      .then(() => {
        // 전역에 붙은 Daum Postcode 생성자를 안전하게 꺼냅니다.
        const Postcode = window.daum?.Postcode;

        if (Postcode == null) {
          onError?.(new Error(DAUM_POSTCODE_MISSING_ERROR_MESSAGE));

          return;
        }

        new Postcode({
          oncomplete: (data) => {
            onSelectAddress({
              // 지도에는 geocoder에 적합한 주소를 따로 넘깁니다.
              mapAddress: resolveDaumPostcodeMapAddress(data),
              // input에는 사용자가 클릭한 주소 텍스트를 그대로 보여줍니다. Daum이 선택된 유형(도로명/지번)에
              // 맞춰 반환하는 기본 address 값을 그대로 사용합니다.
              searchKeyword: data.address,
            });
          },
        }).open();
      })
      .catch(onError ?? noop);
  }, [enabled, onError, onSelectAddress]);
};
