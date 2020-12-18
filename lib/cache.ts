type CacheEntry = {
  expiresAt: number
  value: unknown
}
const cacheMap: Record<string, CacheEntry> = {}

const EXPIRATION = 1000 * 60 * 5 // 5 minutes

export async function cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (shouldRevalidate(key)) {
    await revalidateKey(key, fn)
  }
  return cacheMap[key].value as T
}

function shouldRevalidate(key: string): boolean {
  return cacheMap[key] ? new Date().getTime() > cacheMap[key].expiresAt : true
}

async function revalidateKey<T>(key: string, fn: () => Promise<T>) {
  const response = await fn()
  cacheMap[key] = {
    value: response,
    expiresAt: new Date().getTime() + EXPIRATION,
  }
  return cacheMap[key].value as T
}
