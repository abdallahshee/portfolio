// import { config } from 'dotenv'
// import { defineConfig } from 'drizzle-kit'

// config({ path: ['.env.local', '.env'] })

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/db/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!
//   },
// })
import { config } from 'dotenv'
import { defineConfig } from "drizzle-kit"

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  schema:   "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})