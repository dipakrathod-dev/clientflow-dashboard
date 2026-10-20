import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';

export type AsyncFunction<Data, Arguments extends unknown[]> = (
  ...args: Arguments
) => Promise<Data>;

export interface UseAsyncStateOptions<Data> {
  initialData?: Data | null;
  initialLoading?: boolean;
}

export interface UseAsyncStateResult<Data, Arguments extends unknown[], ErrorType> {
  data: Data | null;
  loading: boolean;
  error: ErrorType | null;
  execute: (...args: Arguments) => Promise<Data>;
  reset: () => void;
  updateData: (nextData: SetStateAction<Data | null>) => void;
}

export function useAsyncState<
  Data,
  Arguments extends unknown[] = [],
  ErrorType = unknown,
>(
  asyncFunction: AsyncFunction<Data, Arguments>,
  { initialData = null, initialLoading = false }: UseAsyncStateOptions<Data> = {},
): UseAsyncStateResult<Data, Arguments, ErrorType> {
  const initialDataRef = useRef<Data | null>(initialData);
  const mountedRef = useRef(false);
  const executionRef = useRef(0);
  const [data, setData] = useState<Data | null>(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: Arguments) => {
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
        setError(caughtError as ErrorType);
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

  const updateData = useCallback((nextData: SetStateAction<Data | null>) => {
    if (mountedRef.current) setData(nextData);
  }, []);

  return { data, loading, error, execute, reset, updateData };
}
