// import { drizzle } from 'drizzle-orm/node-postgres'
// import * as schema from "./schema"

// const connectionString=process.env.DATABASE_URL!
// export const db = drizzle(connectionString, { schema })


import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema' // ✅ import, not export

export * from './schema' // optional (if you want to re-export)

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })

