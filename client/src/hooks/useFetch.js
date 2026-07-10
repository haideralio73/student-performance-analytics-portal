/**
 * hooks/useFetch.js — Generic data-fetching hook.
 * Unwraps { success, data, meta } envelope.
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useFetch = (url, deps = []) => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      if (res.data?.success !== undefined) {
        setData(res.data.data ?? res.data);
        if (res.data.meta) setMeta(res.data.meta);
      } else {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, meta, loading, error, refetch: fetchData };
};
