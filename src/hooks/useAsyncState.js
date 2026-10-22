import { useCallback, useEffect, useRef, useState } from 'react';

export function useAsyncState(asyncFunction, { initialData = null, initialLoading = false } = {}) {
  const initialDataRef = useRef(initialData);
  const mountedRef = useRef(false);
  const executionRef = useRef(0);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    const executionId = executionRef.current + 1;
    executionRef.current = executionId;
    const canUpdate = () => mountedRef.current && executionRef.current === executionId;

    if (canUpdate()) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await asyncFunction(...args);
      if (canUpdate()) {
        setData(result);
        setLoading(false);
      }
      return result;
    } catch (caughtError) {
      if (canUpdate()) {
        setError(caughtError);
        setLoading(false);
      }
      throw caughtError;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    executionRef.current += 1;
    if (!mountedRef.current) return;

    setData(initialDataRef.current);
    setLoading(false);
    setError(null);
  }, []);

  const updateData = useCallback((nextData) => {
    if (mountedRef.current) setData(nextData);
  }, []);

  return { data, loading, error, execute, reset, updateData };
}
