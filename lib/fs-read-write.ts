import fs from 'fs'
import os from 'os'
import { join } from 'path'

console.log('os.tmpdir()', os.tmpdir())

const tmpPath = (path: string) => join(os.tmpdir(), path)

export function readJsonFile<T>(path: string) {
  return new Promise<T | undefined>((resolve, reject) => {
    fs.readFile(tmpPath(path), { encoding: 'utf8' }, (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        let rsp
        try {
          rsp = JSON.parse(data)
          resolve(rsp)
        } catch (e) {
          reject(e.toString())
        }
      }
    })
  })
}

export function writeJsonFile<T>(path: string, data: T) {
  return new Promise<void>((resolve) => {
    fs.writeFile(tmpPath(path), JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.error(`❌ Error writing to ${tmpPath(path)}`)
        console.error(err)
        // reject(err)
        resolve()
      } else {
        console.log(`🌈 Success writing to ${tmpPath(path)}`)
        resolve()
      }
    })
  })
}
