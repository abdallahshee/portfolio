
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { category, comment, user } from "@/db/schema";
import { ArticleSchema, ArticleUpdateSchema } from "@/db/validations/article.types";
import { article } from "@/db/schema/article.schema";
import { articleLike } from "@/db/schema/article-like.schema";
import { UserMiddleware, AuthenticatedMiddleware, OptionalAuthMiddleware } from "./middleware/auth.middleware";



function createSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-") // remove duplicate -
}

function createExcerpt(content: string, maxLength = 160) {
    const plainText = content.replace(/[#_*>\-\n`]/g, " ").trim()
    return plainText.length > maxLength
        ? plainText.slice(0, maxLength).trim() + "..."
        : plainText
}

export const createArticle = createServerFn({ method: "POST" })
    .inputValidator(ArticleSchema)
    .middleware([UserMiddleware])
    .handler(async ({ data, context }) => {
        try {
            const slug = createSlug(data.title)
            const excerpt = createExcerpt(data.content)

            const newData = {
                ...data,
                slug,
                excerpt,
                userId: context.userId!,
            }

            const result = await db.insert(article).values(newData).returning()
            return result[0] // ✅ single object instead of array
        } catch (err) {
            console.error("Create blog failed:", err)
            throw err
        }
    })

export const getAllArticles = createServerFn()
    .handler(async () => {
        try {
            const blogs = await db
                .select({
                    id: article.id,
                    title: article.title,
                    authorImage: user.image,
                    tags: article.tags,
                    content: article.content,
                    coverImage: article.coverImage,
                    slug: article.slug,
                    createdAt: article.createdAt,
                    updatedAt: article.updatedAt,
                    categoryName: category.name,
                    likes: sql<number>`COUNT(DISTINCT ${articleLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(article)
                .leftJoin(user, eq(article.userId, user.id))
                .leftJoin(category, eq(article.categoryId, category.id))
                .leftJoin(articleLike, eq(article.id, articleLike.articleId))
                .leftJoin(comment, eq(article.id, comment.articleId))
                .groupBy(article.id, user.image, category.name)
                .orderBy(desc(sql`COUNT(DISTINCT ${articleLike.id})`))

            return blogs
        } catch (err) {
            console.log(err)
        }
    })

export const getArticleBySlugdForUpdate = createServerFn()
    .middleware([AuthenticatedMiddleware])
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data }) => {
        try {
            // Blog
            const blogResult = await db
                .select({
                    id: article.id,
                    title: article.title,
                    tags: article.tags,
                    content: article.content,
                    coverImage: article.coverImage,
                })
                .from(article)
                .where(eq(article.slug, data.slug))
            const blogData = blogResult[0]
            if (!blogData) return null
            return {
                ...blogData,
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const getArticleBySlug = createServerFn()
    .middleware([OptionalAuthMiddleware])
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data, context }) => {
        try {
            const currentUserId = context.userId

            // Blog
            const articleResult = await db
                .select({
                    id: article.id,
                    title: article.title,
                    tags: article.tags,
                    content: article.content,
                    coverImage: article.coverImage,
                    userId: article.userId,
                    authorId: user.id,
                    slug: article.slug,
                    authorName: user.name,
                    authorImage: user.image,
                    categoryName: category.name,
                    createdAt: article.createdAt,
                    updatedAt: article.updatedAt,
                })
                .from(article)
                .leftJoin(user, eq(article.userId, user.id))
                .leftJoin(category, eq(article.categoryId, category.id))
                .where(eq(article.slug, data.slug))

            const articleData = articleResult[0]

            if (!articleData) return null

            // Comments
            const comments = await db
                .select({
                    id: comment.id,
                    parentId: comment.parentId,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    authorId: user.id,
                    authorName: user.name,
                    authorImage: user.image,
                })
                .from(comment)
                .leftJoin(user, eq(comment.userId, user.id))
                .where(eq(comment.articleId, articleData.id))
                .orderBy(desc(comment.createdAt))

            // Likes count
            const likesResult = await db
                .select({
                    likes: sql<number>`count(*)`,
                })
                .from(articleLike)
                .where(eq(articleLike.articleId, articleData.id))

            const likes = Number(likesResult[0]?.likes ?? 0)

            // Whether current user has liked this blog
            let likedByUser = false

            if (currentUserId) {
                const likedResult = await db
                    .select({ id: articleLike.id })
                    .from(articleLike)
                    .where(
                        and(
                            eq(articleLike.articleId, articleData.id),
                            eq(articleLike.userId, currentUserId)
                        )
                    )
                    .limit(1)

                likedByUser = likedResult.length > 0
            }

            return {
                ...articleData,
                likes,
                likedByUser,
                comments,
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const getPaginatedArticles = createServerFn({ method: 'GET' })
    .inputValidator((data: { page?: number; limit?: number }) => ({
        page: data.page && data.page > 0 ? data.page : 1,
        limit: data.limit && data.limit > 0 ? data.limit : 6,
    }))
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 6
            const offset = (page - 1) * limit

            const blogs = await db
                .select({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    coverImage: article.coverImage,
                    createdAt: article.createdAt,
                    userId: user.id,
                    authorImage: user.image,
                    authorName: user.name,
                    categoryName: category.name,
                    likes: sql<number>`COUNT(DISTINCT ${articleLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(article)
                .leftJoin(user, eq(article.userId, user.id))
                .leftJoin(category, eq(article.categoryId, category.id))
                .leftJoin(articleLike, eq(article.id, articleLike.articleId))
                .leftJoin(comment, eq(article.id, comment.articleId))
                .groupBy(
                    article.id,
                    article.title,
                    article.slug,
                    article.excerpt,
                    article.coverImage,
                    article.createdAt,
                    user.id,
                    user.image,
                    user.name,
                    category.name,
                )
                .orderBy(desc(article.createdAt))
                .limit(limit)
                .offset(offset)

            const totalResult = await db
                .select({
                    count: sql<number>`COUNT(*)`,
                })
                .from(article)

            const total = Number(totalResult[0]?.count ?? 0)
            const totalPages = Math.ceil(total / limit)

            return {
                blogs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })


export const getTopArticles = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const topArticles = await db
                .select({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    coverImage: article.coverImage,
                    authorImage: user.image,
                    categoryName: category.name,
                    likes: sql<number>`COUNT(DISTINCT ${articleLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(article)
                .leftJoin(user, eq(article.userId, user.id))
                .leftJoin(category, eq(article.categoryId, category.id))
                .leftJoin(articleLike, eq(article.id, articleLike.articleId))
                .leftJoin(comment, eq(article.id, comment.articleId))
                .groupBy(article.id, user.image, category.name)
                .limit(5)

            return topArticles
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const updateArticle = createServerFn({ method: "POST" })
    .inputValidator(ArticleUpdateSchema)
    .middleware([UserMiddleware])
    .handler(async ({ data, context }) => {
        try {
            const updated = await db
                .update(article)
                .set({
                    title: data.title,
                    content: data.content,
                    coverImage: data.coverImage ?? null,
                    tags: data.tags,
                })
                .where(
                    and(
                        eq(article.slug, data.slug),
                        eq(article.userId, context.userId!)
                    )
                )
                .returning()

            if (!updated.length) {
                throw new Error("Blog not found or you do not have permission to edit it")
            }

            return updated[0]
        } catch (err) {
            console.error("Update blog failed:", err)
            throw err
        }
    })


export const searchArticles = createServerFn({ method: "GET" })
    .inputValidator((data: { query: string; page: number; pageSize: number }) => data)
    .handler(async ({ data }) => {
        const { query, page, pageSize } = data

        try {
            const offset = (page - 1) * pageSize
            const search = `%${query}%`

            const whereClause = query.trim()
                ? or(
                    ilike(article.title, search),
                    ilike(article.excerpt, search),
                    sql`array_to_string(${article.tags}, ',') ilike ${search}`
                )
                : undefined

            const [articleRows, totalResult] = await Promise.all([
                db
                    .select({
                        id: article.id,
                        title: article.title,
                        slug: article.slug,
                        status: article.status,
                        excerpt: article.excerpt,
                        coverImage: article.coverImage,
                        tags: article.tags,
                        createdAt: article.createdAt,
                        categoryName: category.name,
                        likes: sql<number>`(select count(*) from article_like where article_id = ${article.id})`,
                        comments: sql<number>`(select count(*) from comment where article_id = ${article.id})`,
                        authorImage: user.image,
                        authorName: user.name,
                    })
                    .from(article)
                    .leftJoin(user, eq(article.userId, user.id))
                    .leftJoin(category, eq(article.categoryId, category.id))
                    .where(whereClause)
                    .limit(pageSize)
                    .offset(offset),

                db
                    .select({ count: sql<number>`count(*)` })
                    .from(article)
                    .where(whereClause),
            ])

            const total = Number(totalResult[0].count)

            return {
                blogs:articleRows,
                pagination: {
                    total,
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize),
                },
            }
        } catch (err) {
            console.error("Error searching articles:", err)
            return {
                articles: [],
                pagination: { total: 0, page: 1, pageSize, totalPages: 0 },
            }
        }
    })

// server/blog.functions.ts
export const getMyArticles = createServerFn({ method: "GET" })
    .middleware([UserMiddleware])
    .handler(async ({ context }) => {
        try {
            const userId = context.user?.id!

            const articles = await db
                .select({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    coverImage: article.coverImage,
                    tags: article.tags,
                    status: article.status,
                    createdAt: article.createdAt,
                    categoryName: category.name,
                    likes: sql<number>`(select count(*) from article_like where article_id = ${article.id})`,
                    comments: sql<number>`(select count(*) from comment where article_id = ${article.id})`,
                })
                .from(article)
                .leftJoin(category, eq(article.categoryId, category.id))
                .where(eq(article.userId, userId))
                .orderBy(desc(article.createdAt))

            return articles
        } catch (err) {
            console.error(err)
            return []
        }
    })

export const getMyPaginatedArticles = createServerFn({ method: 'GET' })
    .middleware([UserMiddleware])
    .inputValidator((data: { page?: number; limit?: number }) => ({
        page: data.page && data.page > 0 ? data.page : 1,
        limit: data.limit && data.limit > 0 ? data.limit : 6,
    }))
    .handler(async ({ data, context }) => {
        try {
            const userId = context.user.id
            const { page = 1, limit = 6 } = data
            const offset = (page - 1) * limit

            const [articles, totalResult] = await Promise.all([
                db
                    .select({
                        id: article.id,
                        title: article.title,
                        slug: article.slug,
                        status: article.status,
                        excerpt: article.excerpt,
                        coverImage: article.coverImage,
                        createdAt: article.createdAt,
                        categoryName: category.name,
                        authorImage: user.image,
                        likes: sql<number>`COUNT(DISTINCT ${articleLike.id})`,
                        comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                    })
                    .from(article)
                    .where(eq(article.userId, userId))
                    .leftJoin(user, eq(article.userId, user.id))
                    .leftJoin(category, eq(article.categoryId, category.id))
                    .leftJoin(articleLike, eq(article.id, articleLike.articleId))
                    .leftJoin(comment, eq(article.id, comment.articleId))
                    .groupBy(
                        article.id,
                        article.title,
                        article.slug,
                        article.excerpt,
                        article.coverImage,
                        article.createdAt,
                        user.image,
                        category.name,
                    )
                    .orderBy(desc(article.createdAt))
                    .limit(limit)
                    .offset(offset),

                db
                    .select({ count: sql<number>`COUNT(*)` })
                    .from(article)
                    .where(eq(article.userId, userId)),
            ])

            const total = Number(totalResult[0]?.count ?? 0)
            const totalPages = Math.ceil(total / limit)

            return {
                articles: articles,
                pagination: { page, limit, total, totalPages },
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    })

