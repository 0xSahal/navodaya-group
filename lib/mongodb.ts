import 'server-only'
import { MongoClient, type Db } from 'mongodb'

/*
 * Shared MongoDB client for serverless. Next.js can reuse the module across
 * warm invocations, so we cache the client on globalThis and avoid opening a
 * new connection on every request.
 *
 * The cache is keyed by URI so a .env change (or a failed connect) does not
 * pin the process to a dead promise across hot reloads.
 */

declare global {
  var __navodayaMongo:
    | { uri: string; promise: Promise<MongoClient> }
    | undefined
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    return Promise.reject(new Error('MONGODB_URI is not set'))
  }

  const cached = globalThis.__navodayaMongo
  if (cached?.uri === uri) return cached.promise

  const promise = new MongoClient(uri).connect().catch((error) => {
    // Drop a failed attempt so the next request can retry (e.g. after DNS or
    // Network Access is fixed, or after the URI is corrected).
    if (globalThis.__navodayaMongo?.promise === promise) {
      globalThis.__navodayaMongo = undefined
    }
    throw error
  })

  globalThis.__navodayaMongo = { uri, promise }
  return promise
}

/** Database name when the URI has no path segment. */
const DEFAULT_DB = 'navodaya'

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(DEFAULT_DB)
}

export const mongodbConfigured = Boolean(process.env.MONGODB_URI)
