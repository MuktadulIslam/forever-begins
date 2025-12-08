import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Get the visitor identifier
        setFingerprint(result.visitorId);
      } catch (error) {
        console.error('Error generating fingerprint:', error);
        // Fallback to a random ID stored in localStorage
        const fallbackId = localStorage.getItem('deviceId') || `device_${Date.now()}_${Math.random()}`;
        localStorage.setItem('deviceId', fallbackId);
        setFingerprint(fallbackId);
      } finally {
        setIsLoading(false);
      }
    };

    generateFingerprint();
  }, []);

  return { fingerprint, isLoading };
}
