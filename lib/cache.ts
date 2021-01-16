type CacheEntry = {
  expiresAt: number
  value: unknown
}
const cacheMap: Record<string, CacheEntry> = {}

const EXPIRATION = 1000 * 60 * 10 // 10 minutes

export async function cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (await shouldRevalidate(key)) {
    await revalidateKey(key, fn)
  }
  return retrieveCachedValue(key)
}

async function shouldRevalidate(key: string): Promise<boolean> {
  const entry = await retrieveCacheEntry(key)
  if (entry) {
    const rsp = new Date().getTime() > entry.expiresAt
    console.log(rsp ? '❌ cache miss (expired)' : '✅ cache hit!')
    return rsp
  } else {
    console.log('🟡 cache miss (undefined)')
    return true
  }
}

async function revalidateKey<T>(key: string, fn: () => Promise<T>) {
  const response = await fn()
  console.log('setting cache! 🌈')
  await writeCachedValue(key, response)
  return response
}

async function retrieveCacheEntry<V>(
  key: string
): Promise<{ value: V; expiresAt: number }> {
  return cacheMap[key] as any
}

async function retrieveCachedValue<V>(key: string): Promise<V> {
  const entry = await retrieveCacheEntry<V>(key)
  return entry.value
}

async function writeCachedValue<V>(key: string, value: V) {
  cacheMap[key] = {
    value,
    expiresAt: new Date().getTime() + EXPIRATION,
  }
}
