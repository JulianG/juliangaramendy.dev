import sha from 'sha-1'
import { readJsonFile, writeJsonFile } from './fs-read-write'

type CacheEntry = {
  expiresAt: number
  value: unknown
}
const cacheMap: Record<string, CacheEntry> = {}

const EXPIRATION = 1000 * 60 * 10 // 10 minutes

export async function cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (await shouldRevalidate(key)) {
    return revalidateKey(key, fn)
  } else {
    const value = await retrieveCachedValue<T>(key)
    return value!
  }
}

async function shouldRevalidate(key: string): Promise<boolean> {
  const entry = await retrieveCacheEntry(key)
  if (entry) {
    const rsp = new Date().getTime() > entry.expiresAt
    // console.log(rsp ? '❌ cache miss (expired)' : '✅ cache hit!')
    return rsp
  } else {
    // console.log('🟡 cache miss (undefined)')
    return true
  }
}

async function revalidateKey<T>(key: string, fn: () => Promise<T>) {
  const response = await fn()
  // console.log('setting cache! 🌈')
  await writeCachedValue(key, response)
  return response
}

async function retrieveCacheEntry<V>(
  key: string
): Promise<{ value: V; expiresAt: number } | undefined> {
  return readJsonFile(`./.cache-${sha(key)}.json`)
}

async function retrieveCachedValue<V>(key: string): Promise<V | undefined> {
  const entry = await retrieveCacheEntry<V>(key)
  return entry ? entry.value : undefined
}

async function writeCachedValue<V>(key: string, value: V) {
  return writeJsonFile(`./.cache-${sha(key)}.json`, {
    value,
    expiresAt: new Date().getTime() + EXPIRATION,
  })
}
