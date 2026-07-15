import { setWasmUrl } from '@lottiefiles/dotlottie-react';
import dotLottieWasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';

export const configureDotLottieWasm = () => {
  setWasmUrl(dotLottieWasmUrl);
};
