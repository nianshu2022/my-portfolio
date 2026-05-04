interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

const CACHE_PREFIX = "api-cache:";

function getCache<T>(key: string, ttl: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ttl) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = { value, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

export async function fetchApi<T>(
  url: string,
  options?: {
    timeout?: number;
    cacheKey?: string;
    cacheTTL?: number;
    transform?: (data: unknown) => T;
  },
): Promise<T> {
  const { timeout = 8000, cacheKey, cacheTTL = 0, transform } = options ?? {};

  if (cacheKey && cacheTTL > 0) {
    const cached = getCache<T>(cacheKey, cacheTTL);
    if (cached !== null) return cached;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`服务暂时不可用 (${response.status})`);
    }

    const json = await response.json();
    const result = transform ? transform(json) : (json as T);

    if (cacheKey && cacheTTL > 0) {
      setCache(cacheKey, result);
    }

    return result;
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
    }
    if (error instanceof TypeError) {
      throw new Error("网络连接失败，请检查网络");
    }
    throw error;
  }
}

export function timeAgo(unixTimestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unixTimestamp);
  if (seconds < 60) return "刚刚";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  const months = Math.floor(days / 30);
  return `${months} 个月前`;
}
