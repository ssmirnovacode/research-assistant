"use client";

import { useState, useEffect } from "react";

type Props = {
  resetAt: number;
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function LimitBanner({ resetAt }: Props) {
  const [remaining, setRemaining] = useState(() => resetAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const left = resetAt - Date.now();
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [resetAt]);

  return (
    <div className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="font-semibold">Session limit reached</span> — You&apos;ve used all 20
      messages for this session. You can send more in{" "}
      <span className="font-semibold">{formatCountdown(remaining)}</span>.
    </div>
  );
}
