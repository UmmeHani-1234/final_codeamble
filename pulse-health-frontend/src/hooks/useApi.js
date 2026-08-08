import { useState, useEffect, useCallback } from 'react';

/**
 * useApi(apiFn, deps?)
 * Calls apiFn() on mount (and when deps change), returns { data, loading, error, refetch }.
 *
 * Usage:
 *   const { data: alerts, loading, error } = useApi(getHospitalAlerts);
 */
export default function useApi(apiFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const handleSync = (event) => {
      const payload = event?.detail || null;
      if (!payload) return;
      if (payload.source === 'pulse-sync') {
        fetch();
      }
    };

    window.addEventListener('pulse-sync', handleSync);
    window.addEventListener('focus', fetch);

    return () => {
      window.removeEventListener('pulse-sync', handleSync);
      window.removeEventListener('focus', fetch);
    };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
