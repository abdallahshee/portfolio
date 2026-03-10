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
  schema: [
    "./src/db/project-schema.ts",
  "./src/db/auth-schema.ts",
  "./src/db/user-schema.ts",
  "./src/db/blog-schema.ts",
  "./src/db/comment-schema.ts"
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})