import sha from 'sha-1'
import { readJsonFile, writeJsonFile } from './fs-read-write'

type CacheEntry<V> = {
  expiresAt: number
  value: V
}

const TEN_MINUTES = 1000 * 60 * 10

export async function cache<V>(key: string, fn: () => Promise<V>): Promise<V> {
  if (await shouldRevalidate(key)) {
    return revalidateKey(key, fn)
  } else {
    const value = await retrieveCachedValue<V>(key)
    return value!
  }
}

async function shouldRevalidate(key: string): Promise<boolean> {
  const entry = await retrieveCacheEntry(key)
  if (entry) {
    const rsp = new Date().getTime() > entry.expiresAt
    return rsp
  } else {
    return true
  }
}

async function revalidateKey<V>(key: string, fn: () => Promise<V>) {
  const response = await fn()
  // console.log('setting cache! 🌈')
  await writeCachedValue(key, response)
  return response
}

async function retrieveCacheEntry<V>(
  key: string
): Promise<CacheEntry<V> | undefined> {
  return readJsonFile(`./.cache-${sha(key)}.json`)
}

async function retrieveCachedValue<V>(key: string): Promise<V | undefined> {
  const entry = await retrieveCacheEntry<V>(key)
  return entry ? entry.value : undefined
}

async function writeCachedValue<V>(key: string, value: V) {
  return writeJsonFile(`./.cache-${sha(key)}.json`, {
    value,
    expiresAt: new Date().getTime() + TEN_MINUTES,
  })
}
