import { drizzle } from 'drizzle-orm/node-postgres'
import { project } from './project-schema'
import { account, roleEnum, session, user, verification } from './auth-schema'

// Build a schema object
const schema = {
  project,
  user,
  session,
  account,
  verification,
  roleEnum
}

export const db = drizzle(process.env.DATABASE_URL!, { schema })




