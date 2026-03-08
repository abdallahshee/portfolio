import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

export const db = drizzle(process.env.DATABASE_URL!, { schema })


// import { drizzle } from "drizzle-orm/node-postgres"
// import { Pool } from "pg"

// const pool = new Pool({
//   connectionString: process.env.DATABASE_POOL_URL,
// })

// export const db = drizzle(pool)