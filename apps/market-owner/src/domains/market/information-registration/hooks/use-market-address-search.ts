import { useCallback } from 'react';

type DaumPostcodeCompleteDataTypes = Readonly<{
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
    kakao?: {
      maps?: {
        load: (callback: () => void) => void;
        services?: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (results: KakaoGeocoderResultTypes[], status: string) => void,
            ) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

export type MarketAddressSearchResultTypes = Readonly<{
  address: string;
  latitude: number;
  longitude: number;
}>;

type KakaoGeocoderResultTypes = Readonly<{ x: string; y: string }>;

const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const DAUM_POSTCODE_SCRIPT_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const KAKAO_MAP_SCRIPT_ID = 'kakao-map-services-script';
const ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE = 'Address search service is unavailable';

let daumPostcodeScriptPromise: Promise<void> | null = null;
let kakaoMapScriptPromise: Promise<void> | null = null;

export const resolveDaumPostcodeAddress = ({
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
    const existingScript = document.getElementById(
      DAUM_POSTCODE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript != null) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => {
          daumPostcodeScriptPromise = null;
          existingScript.remove();
          reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));
        },
        { once: true },
      );

      return;
    }

    const script = document.createElement('script');
    script.id = DAUM_POSTCODE_SCRIPT_ID;
    script.async = true;
    script.src = DAUM_POSTCODE_SCRIPT_SRC;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () => {
        daumPostcodeScriptPromise = null;
        script.remove();
        reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return daumPostcodeScriptPromise;
};

export const loadKakaoMapServices = (appKey: string) => {
  if (window.kakao?.maps?.services != null) {
    return Promise.resolve();
  }

  if (window.kakao?.maps?.load != null) {
    return new Promise<void>((resolve, reject) => {
      window.kakao?.maps?.load(() => {
        if (window.kakao?.maps?.services != null) {
          resolve();
        } else {
          reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));
        }
      });
    });
  }

  if (kakaoMapScriptPromise != null) {
    return kakaoMapScriptPromise;
  }

  kakaoMapScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement('script');
    const rejectLoad = () => {
      kakaoMapScriptPromise = null;
      script.remove();
      reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));
    };
    const handleLoad = () => {
      const load = window.kakao?.maps?.load;

      if (load == null) {
        rejectLoad();

        return;
      }

      load(resolve);
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', rejectLoad, { once: true });

    if (existingScript == null) {
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false&libraries=services`;
      document.head.appendChild(script);
    }
  });

  return kakaoMapScriptPromise;
};

const geocodeAddress = (address: string) => {
  return new Promise<MarketAddressSearchResultTypes>((resolve, reject) => {
    const Geocoder = window.kakao?.maps?.services?.Geocoder;
    const okStatus = window.kakao?.maps?.services?.Status.OK;

    if (Geocoder == null || okStatus == null) {
      reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));

      return;
    }

    new Geocoder().addressSearch(address, (results, status) => {
      const [firstResult] = results;
      const latitude = Number(firstResult?.y);
      const longitude = Number(firstResult?.x);

      if (
        status !== okStatus ||
        firstResult == null ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));

        return;
      }

      resolve({ address, latitude, longitude });
    });
  });
};

export const useMarketAddressSearch = () => {
  const kakaoMapAppKey = import.meta.env.VITE_PUBLIC_KAKAO_MAP_APP_KEY?.trim();

  return useCallback(async () => {
    if (!kakaoMapAppKey) {
      throw new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE);
    }

    await Promise.all([loadDaumPostcodeScript(), loadKakaoMapServices(kakaoMapAppKey)]);

    return new Promise<MarketAddressSearchResultTypes>((resolve, reject) => {
      const Postcode = window.daum?.Postcode;

      if (Postcode == null) {
        reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));

        return;
      }

      new Postcode({
        oncomplete: (data) => {
          const address = resolveDaumPostcodeAddress(data);

          if (!address) {
            reject(new Error(ADDRESS_SEARCH_UNAVAILABLE_ERROR_MESSAGE));

            return;
          }

          void geocodeAddress(address).then(resolve).catch(reject);
        },
      }).open();
    });
  }, [kakaoMapAppKey]);
};
