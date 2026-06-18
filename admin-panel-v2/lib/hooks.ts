'use client';
import { useState, useEffect, useCallback } from 'react';
import { getErrorMsg } from './api';

// ─── useApi: fetch on mount, with refetch ─────────────────────────────────────
export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fn());
    } catch (err) {
      setError(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

// ─── useMutation: for create/update/delete ────────────────────────────────────
export function useMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const mutate = async (...args: TArgs): Promise<TResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      return result;
    } catch (err) {
      setError(getErrorMsg(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
