import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const MINUTE_LIMIT = 10;
const DAY_LIMIT = 50;

type RateLimitResult = { allowed: boolean };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const minKey = `rl:min:${ip}`;
  const dayKey = `rl:day:${ip}`;

  const [minCount, dayCount] = await Promise.all([
    redis.incr(minKey),
    redis.incr(dayKey),
  ]);

  if (minCount === 1) await redis.expire(minKey, 60);
  if (dayCount === 1) await redis.expire(dayKey, 86400);

  if (minCount > MINUTE_LIMIT || dayCount > DAY_LIMIT) {
    return { allowed: false };
  }

  return { allowed: true };
}
