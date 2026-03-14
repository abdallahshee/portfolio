import { drizzle } from 'drizzle-orm/node-postgres'
import { project } from './project.schema'
import { account, session, verification } from './auth.schema'
import { roleEnum, user } from './user.schema'
import { comment } from './comment.schema'
import { blog, blogStatusEnum } from './blog.schema'
import { projectRating } from './project-rating.schema'
import { blogLike } from './blog-like.schema'
import { setting } from './setting.schema'

// Build a schema object
const schema = {
  project,
  user,
  session,
  account,
  verification,
  roleEnum,
  comment,
  blog,
  blogStatusEnum,
  projectRating,
  blogLike,
  setting
}

export const db = drizzle(process.env.DATABASE_URL!, { schema })




