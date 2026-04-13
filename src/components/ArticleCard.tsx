import { Avatar, Badge, Box, Card, Group, Image, Text } from '@mantine/core'
import { Heart, MessageCircle } from 'lucide-react'
import classes from "../css/article.module.css"
import moment from 'moment'

// ✅ Export the type directly alongside the query
// in your server function file
export type PaginatedArticleItem = {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string | null
    categoryName: string | null
    authorName: string | null
    authorImage: string | null
    likes_count: number
    comments_count: number
    status: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
}

export type PaginatedArticlesData = {
    articles: PaginatedArticleItem[]
    pagination: {
        page: number
        totalPages: number
        total: number
    }
}
const CARD_HEIGHT = 520
const IMAGE_HEIGHT = 230
interface ArticleCardProps {
    article: PaginatedArticleItem
}
export const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <Card
            withBorder
            radius="md"
            p={0}
            className={`${classes.card} border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900`}
            style={{ width: "100%", height: CARD_HEIGHT, display: "flex", flexDirection: "column" }}
        >
            {/* Cover image */}
            <Box style={{ height: IMAGE_HEIGHT, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                <Image
                    src={article.coverImage!}
                    alt={article.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {article.categoryName && (
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <Badge
                            variant="filled"
                            color="green"
                            radius="sm"
                            size="sm"
                            style={{ backdropFilter: "blur(8px)", opacity: 0.92 }}
                        >
                            {article.categoryName}
                        </Badge>
                    </div>
                )}
            </Box>

            {/* Body */}
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem 1.2rem",
                    overflow: "hidden",
                }}
            >
                {/* Title — always 2 lines */}
                <div
                    className="title3 text-slate-900 dark:text-slate-50"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexShrink: 0,
                        minHeight: "2.8em",
                        marginBottom: "0.4rem",
                    }}
                >
                    {article.title}
                </div>

                {/* ✅ Tags row — max 4, fixed height slot */}
                {article.tags && article.tags.length > 0 && (
                    <Group
                        gap={5}
                        mb={8}
                        style={{ flexShrink: 0, flexWrap: "nowrap", overflow: "hidden" }}
                    >
                        {article.tags.slice(0, 4).map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="light"
                                color="indigo"
                                radius="xl"
                                size="xs"
                                style={{ flexShrink: 0 }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                )}

                {/* Excerpt — 4 lines with ellipsis */}
                <Text
                    size="xs"
                    lineClamp={4}
                    className="text-slate-500 dark:text-slate-400"
                    style={{
                        flex: 1,
                        minHeight: 0,
                        lineHeight: 1.6,
                    }}
                >
                    {article.excerpt}
                </Text>

                {/* Author + date */}
                <Group
                    justify="space-between"
                    align="center"
                    wrap="nowrap"
                    gap="xs"
                    mt={12}
                    style={{ flexShrink: 0 }}
                    className="min-w-0"
                >
                    <Group gap={7} wrap="nowrap" className="min-w-0">
                        <Avatar
                            size={26}
                            src={article.authorImage}
                            alt={article.authorName!}
                            radius="xl"
                            className="shrink-0"
                        />
                        <span className="min-w-0 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                            {article.authorName}
                        </span>
                    </Group>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {moment(article.createdAt).format("MMM D, YYYY")}
                    </span>
                </Group>

                {/* Stats footer */}
                <Group
                    gap="sm"
                    mt={10}
                    pt={10}
                    style={{
                        flexShrink: 0,
                        borderTop: "1px solid var(--mantine-color-default-border)",
                    }}
                >
                    <Group gap={5} align="center">
                        <Heart size={13} className="text-rose-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{article.likes_count}</span>
                    </Group>
                    <Group gap={5} align="center">
                        <MessageCircle size={13} className="text-indigo-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{article.comments_count}</span>
                    </Group>
                    <div style={{ marginLeft: "auto" }}>
                        <Badge variant="dot" color="green" size="xs" radius="xl">
                            {article.status ?? "published"}
                        </Badge>
                    </div>
                </Group>
            </div>
        </Card>
    )
}


