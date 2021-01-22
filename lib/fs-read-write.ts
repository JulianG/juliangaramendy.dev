import fs from 'fs'

export function readJsonFile<T>(path: string) {
  return new Promise<T | undefined>((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
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
    fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.error(`Error trying to save ${path}`)
        console.error(err)
        // reject(err)
        resolve()
      } else {
        console.log(`Success writing to ${path}`)
        resolve()
      }
    })
  })
}
