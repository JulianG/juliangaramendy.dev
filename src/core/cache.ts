import sha from 'sha-1'
import os from 'os'
import { join } from 'path'
import { readJsonFile, writeJsonFile } from './fs-read-write-json'

const getTempPath = (path: string) => join(os.tmpdir(), path)

type CacheEntry<V> =
  | {
      status: 'done'
      expiresAt: number
      value: V
    }
  | {
      status: 'pending'
      expiresAt: number
    }

export function getCached<V>(
  key: string,
  fn: () => Promise<V>,
  cacheDurationMs: number
) {
  const tempFilePath = getTempPath(`./jgdev-cache-${sha(key)}.json`)

  const getEntry = async () =>
    readJsonFile<CacheEntry<V> | undefined>(tempFilePath)

  const writePendingEntry = () =>
    writeJsonFile(tempFilePath, {
      status: 'pending',
      expiresAt: new Date().getTime() + 10000,
    })

  const writeEntry = async (value: V) =>
    writeJsonFile(tempFilePath, {
      status: 'done',
      expiresAt: new Date().getTime() + cacheDurationMs,
      value,
    })

  const wait = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

  const revalidate = async (): Promise<V> => {
    await writePendingEntry()
    const value = await fn()
    await writeEntry(value)
    return value
  }

  const hasExpired = (entry: CacheEntry<V>) =>
    new Date().getTime() > entry.expiresAt

  const getValue = async (): Promise<V> => {
    const entry = await getEntry()
    if (entry) {
      if (entry.status === 'done' && !hasExpired(entry)) {
        return entry.value
      } else if (entry.status === 'pending' && !hasExpired(entry)) {
        await wait(500)
        return getValue()
      }
    }
    return revalidate()
  }

  return getValue()
}
