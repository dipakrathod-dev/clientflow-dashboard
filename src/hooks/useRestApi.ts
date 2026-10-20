import { useCallback, useEffect, useRef, useState } from 'react';

export type RestRequest<Data> = (signal: AbortSignal) => Promise<Data>;

export interface UseRestApiOptions<Data> {
  initialData?: Data | null;
  immediate?: boolean;
}

export interface UseRestApiResult<Data> {
  data: Data | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<Data | null>;
  reset: () => void;
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error('The request failed.');
}

function isAbortError(value: unknown): boolean {
  return value instanceof DOMException && value.name === 'AbortError';
}

/**
 * Run a typed REST request with cancellation and request ordering guarantees.
 * Older responses and completions after unmount are ignored.
 */
export function useRestApi<Data>(
  request: RestRequest<Data>,
  { initialData = null, immediate = true }: UseRestApiOptions<Data> = {},
): UseRestApiResult<Data> {
  const initialDataRef = useRef<Data | null>(initialData);
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const [data, setData] = useState<Data | null>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      controllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(async (): Promise<Data | null> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    const canUpdate = () => mountedRef.current && requestIdRef.current === requestId;

    if (canUpdate()) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await request(controller.signal);
      if (canUpdate() && !controller.signal.aborted) {
        setData(result);
        setLoading(false);
        return result;
      }
    } catch (caughtError) {
      if (isAbortError(caughtError) || !canUpdate()) {
        return null;
      }

      setError(toError(caughtError));
      setLoading(false);
      return null;
    }

    return null;
  }, [request]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    controllerRef.current?.abort();

    if (!mountedRef.current) return;

    setData(initialDataRef.current);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
