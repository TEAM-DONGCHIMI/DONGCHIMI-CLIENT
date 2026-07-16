'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type PwaInstallAvailabilityTypes = 'installed' | 'manual' | 'prompt';
type PwaInstallResultTypes = 'accepted' | 'already-installed' | 'dismissed' | 'manual';

interface BeforeInstallPromptEventTypes extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface NavigatorWithStandaloneTypes extends Navigator {
  standalone?: boolean;
}

interface PwaInstallContextValues {
  availability: PwaInstallAvailabilityTypes;
  requestInstall: () => Promise<PwaInstallResultTypes>;
}

interface PwaInstallProviderProps {
  children: ReactNode;
}

const PwaInstallContext = createContext<PwaInstallContextValues | null>(null);

const isPwaInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isStandaloneDisplayMode =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as NavigatorWithStandaloneTypes).standalone === true;

  return isStandaloneDisplayMode || isIosStandalone;
};

const getPwaInstallAvailability = ({
  installPrompt,
  installed,
}: {
  installPrompt: BeforeInstallPromptEventTypes | null;
  installed: boolean;
}): PwaInstallAvailabilityTypes => {
  if (installed) {
    return 'installed';
  }

  if (installPrompt == null) {
    return 'manual';
  }

  return 'prompt';
};

export const PwaInstallProvider = ({ children }: PwaInstallProviderProps) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEventTypes | null>(null);
  const [installed, setInstalled] = useState(isPwaInstalled);

  useEffect(() => {
    const displayModeQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)')
        : null;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEventTypes);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setInstalled(true);
    };

    const handleDisplayModeChange = () => {
      setInstalled(isPwaInstalled());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    displayModeQuery?.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      displayModeQuery?.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const requestInstall = useCallback(async (): Promise<PwaInstallResultTypes> => {
    if (installed) {
      return 'already-installed';
    }

    if (installPrompt == null) {
      return 'manual';
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      setInstallPrompt(null);

      return outcome;
    } catch {
      setInstallPrompt(null);

      return 'manual';
    }
  }, [installPrompt, installed]);

  const availability = getPwaInstallAvailability({ installPrompt, installed });
  const contextValue = useMemo(
    () => ({ availability, requestInstall }),
    [availability, requestInstall],
  );

  return <PwaInstallContext.Provider value={contextValue}>{children}</PwaInstallContext.Provider>;
};

export const usePwaInstall = () => {
  const context = useContext(PwaInstallContext);

  if (context == null) {
    throw new Error('usePwaInstall must be used within <PwaInstallProvider>.');
  }

  return context;
};
