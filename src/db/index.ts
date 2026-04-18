// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'
// import * as schema from './schema' // ✅ import, not export

// export * from './schema' // optional (if you want to re-export)

// const connectionString = process.env.DATABASE_URL!

// const client = postgres(connectionString, { prepare: false })

// export const db = drizzle(client, { schema })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export * from './schema'

const connectionString = process.env.DATABASE_URL!

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

const client =
  globalForDb.client ??
  postgres(connectionString, {
    prepare: false,
    max: 1, // 👈 IMPORTANT: limit connections
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })

