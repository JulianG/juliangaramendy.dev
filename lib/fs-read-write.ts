import fs from 'fs'
import { WriteFileOptions } from 'fs'

export function readJsonFile<T>(path: string) {
  return new Promise<T | undefined>((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        let rsp
        try {
          rsp = JSON.parse(data)
        } catch (e) {}
        resolve(rsp)
      }
    })
  })
}

export function writeJsonFile<T>(path: string, data: T) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
