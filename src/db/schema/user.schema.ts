// src/db/schema/user.schema.ts
import { relations } from 'drizzle-orm'
import {
  pgSchema,
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'
import { comment } from './comment.schema'
import { article } from './article.schema'
import { articleLike } from './article-like.schema'
import { projectRating } from './project-rating.schema'

const auth = pgSchema('auth')

 const authUsers = auth.table('users', {
  id: uuid('id').primaryKey(),
})

export const user = pgTable('user', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),

  name: text('name'),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  comments: many(comment),
  articles: many(article),
  articleLikes: many(articleLike),
  projectRatings: many(projectRating),
}))