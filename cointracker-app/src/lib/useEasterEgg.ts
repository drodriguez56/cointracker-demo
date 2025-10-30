import { useCallback, useEffect, useState } from 'react';

const SPOOKY_DURATION_MS = 3000;

const isOctober = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return new Date().getMonth() === 9;
};

export const useEasterEgg = () => {
  const [enabled, setEnabled] = useState(() => isOctober());
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setEnabled(isOctober());
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsActive(false);
    }, SPOOKY_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isActive]);

  const trigger = useCallback(() => {
    if (!enabled || isActive) {
      return;
    }

    setIsActive(true);
  }, [enabled, isActive]);

  return {
    isEnabled: enabled,
    isActive,
    trigger,
  };
};

export default useEasterEgg;
