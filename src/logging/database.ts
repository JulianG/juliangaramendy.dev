import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URI || ''
const dbName = process.env.DATABASE_NAME || ''

const client = new MongoClient(uri, { useNewUrlParser: true })

export async function getDatabase() {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}
