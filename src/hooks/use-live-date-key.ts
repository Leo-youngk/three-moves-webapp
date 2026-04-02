"use client";

import { useEffect, useState } from "react";
import { toLocalDateKey } from "@/lib/domain/date";

const POLL_INTERVAL_MS = 60_000;

export function useLiveDateKey() {
  const [dateKey, setDateKey] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setDateKey(toLocalDateKey(new Date()));
    };

    update();

    const interval = window.setInterval(update, POLL_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (!document.hidden) {
        update();
      }
    };

    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return dateKey;
}
