import { useState, useEffect } from 'react';

/**
 * usePwaInstall
 * Captures the browser's native "beforeinstallprompt" event and exposes:
 * - isInstallable  (boolean) — true when the app can be installed
 * - promptInstall  (function) — call this to show the native install dialog
 * - isInstalled    (boolean) — true if app is already running in standalone mode
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as PWA (standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault(); // Prevent default mini-infobar
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Always show banner after 1.5s as fallback if event doesn't fire
    const timer = setTimeout(() => setIsInstallable(true), 1500);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      alert("To install the app, please tap your browser menu (⋮ or ↗) and select 'Install App' or 'Add to Home screen'.");
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error("Install prompt error:", error);
    }
    setDeferredPrompt(null);
  };

  return { isInstallable, isInstalled, promptInstall };
}
