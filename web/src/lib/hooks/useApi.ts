"use client";

import { useState, useEffect } from "react";
import type { ApiState } from "@/lib/api/types";

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options?: { enabled?: boolean },
): ApiState<T> & { retry: () => void } {
  const { enabled = true } = options ?? {};
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, retryCount, ...deps]);

  return { ...state, retry: () => setRetryCount((c) => c + 1) };
}
