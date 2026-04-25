interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory fallback
const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

let ratelimiter: any = null;

// Initialize Upstash Redis if credentials exist, using lazy init to prevent Jest ESM errors
if (typeof process !== 'undefined' && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const { Ratelimit } = require('@upstash/ratelimit');
    const { Redis } = require('@upstash/redis');
    const redis = Redis.fromEnv();
    ratelimiter = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
    });
  } catch (e) {
    console.warn("Failed to initialize Upstash Redis", e);
  }
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowMs: 60_000 }
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  // 1. Try enterprise Redis rate limiting
  if (ratelimiter) {
    try {
      const { success, limit, remaining, reset } = await ratelimiter.limit(identifier);
      return { success, remaining, resetIn: reset - Date.now() };
    } catch (e) {
      console.warn("Redis rate limit failed, falling back to in-memory", e);
    }
  }

  // 2. Fallback to in-memory (good for local dev or single-instance)
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.limit - 1, resetIn: config.windowMs };
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetIn: entry.resetAt - now,
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
