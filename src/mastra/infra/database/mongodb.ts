import type { Container } from 'inversify'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Config } from '../../domain/aggregates/config.js'

const uri = process.env.MONGODB_URI!

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

export const connectToDatabase = async () => {
    await client.connect()
}

export const DB_SYMBOL = Symbol.for('db')

export const getDB = (container: Container) => {
    const config = container.get(Config)
    return client.db(config.DB_NAME)
}

export type DB = ReturnType<typeof getDB>
