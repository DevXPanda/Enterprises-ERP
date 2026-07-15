"use client";

// Fetches an API payload once on mount; returns null until loaded (callers
// fall back to static data), so pages render instantly and hydrate live.
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export function useApi<T>(path: string, version = 0): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<T>(path)
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        // API offline — keep null so the caller's static fallback is used
      });
    return () => {
      active = false;
    };
  }, [path, version]);

  return data;
}
