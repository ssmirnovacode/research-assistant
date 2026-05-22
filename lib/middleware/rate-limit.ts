import { kv } from "@vercel/kv";

const MINUTE_LIMIT = 10;
const DAY_LIMIT = 50;

type RateLimitResult = { allowed: boolean };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const minKey = `rl:min:${ip}`;
  const dayKey = `rl:day:${ip}`;

  const [minCount, dayCount] = await Promise.all([
    kv.incr(minKey),
    kv.incr(dayKey),
  ]);

  if (minCount === 1) await kv.expire(minKey, 60);
  if (dayCount === 1) await kv.expire(dayKey, 86400);

  if (minCount > MINUTE_LIMIT || dayCount > DAY_LIMIT) {
    return { allowed: false };
  }

  return { allowed: true };
}
