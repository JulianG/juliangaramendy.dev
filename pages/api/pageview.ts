import { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../src/logging/database'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      postPageView(req, res)
      break
    default:
      res.status(405).send('Method Not Allowed')
  }
}

async function postPageView(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pageview = req.body
    const db = await getDatabase()
    const { result } = await db
      .collection(process.env.DATABASE_PAGEVIEWS_COLLECTION || '')
      .insertOne(pageview)
    if (result.ok) {
      res.status(201).json({})
    } else {
      throw new Error('Failed to insert pageview.')
    }
  } catch (e) {
    res.status(500).send(`Internal Server Error. ${e}`)
  }
}

export default handler
