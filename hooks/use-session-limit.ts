"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "research-assistant:session-quota";
const LIMIT = 20;
const WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

type SessionQuota = {
  count: number;
  windowStart: number;
};

function loadQuota(): SessionQuota {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SessionQuota;
  } catch {
    // ignore
  }
  return { count: 0, windowStart: Date.now() };
}

function saveQuota(quota: SessionQuota) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quota));
  } catch {
    // ignore
  }
}

function resolveQuota(quota: SessionQuota): SessionQuota {
  if (Date.now() - quota.windowStart >= WINDOW_MS) {
    return { count: 0, windowStart: Date.now() };
  }
  return quota;
}

type SessionLimitResult = {
  canSend: boolean;
  remaining: number;
  resetAt: number | null;
  recordSend: () => void;
};

export function useSessionLimit(): SessionLimitResult {
  const [quota, setQuota] = useState<SessionQuota>({ count: 0, windowStart: Date.now() });

  useEffect(() => {
    const loaded = resolveQuota(loadQuota());
    setQuota(loaded);
    saveQuota(loaded);
  }, []);

  const recordSend = useCallback(() => {
    setQuota((prev) => {
      const resolved = resolveQuota(prev);
      const next = { ...resolved, count: resolved.count + 1 };
      saveQuota(next);
      return next;
    });
  }, []);

  const resolved = resolveQuota(quota);
  const canSend = resolved.count < LIMIT;
  const remaining = Math.max(0, LIMIT - resolved.count);
  const resetAt = canSend ? null : quota.windowStart + WINDOW_MS;

  return { canSend, remaining, resetAt, recordSend };
}
