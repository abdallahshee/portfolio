import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { getArticleBySlugQueryOptions } from '@/db/queries/article.queries'
import { OptionalAuthMiddleware } from '@/server/middleware'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import {
  Avatar, Modal, Button, Text, Badge, Divider,
  Paper, Stack, Group, Skeleton
} from '@mantine/core'
import { useForm } from '@mantine/form'
import moment from 'moment'
import {
  MessageCircle,
  ThumbsUp
} from 'lucide-react'
import { dislikeArticle, likeBlog } from '@/server/article-like.functions'
import { useCreateCommentMutation } from '@/db/mutations/comment.mutations'

export const Route = createFileRoute('/articles/$slug')({
  server: { middleware: [OptionalAuthMiddleware] },
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    getArticleBySlugQueryOptions(slug)
  )

  const article = data ?? null

  const createCommentMutation = useCreateCommentMutation()

  const [likes, setLikes] = useState(0)
  const [likedByUser, setLikedByUser] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // INIT STATE FROM DATA
  useEffect(() => {
    if (article) {
      setLikes(article.likes ?? 0)
      setLikedByUser(article.likedByUser ?? false)
    }
  }, [article])

  // AUTH
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session) => setSession(session)
    )

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const requireAuth = () => {
    if (!session?.user) {
      setAuthModalOpen(true)
      return false
    }
    return true
  }

  // FORMS
  const commentForm = useForm({ initialValues: { content: '' } })
  const replyForm = useForm({ initialValues: { content: '' } })

  // COMMENT TREE
  const commentTree = useMemo(() => {
    if (!article?.comments) return []
    const map = new Map()
    const roots: any[] = []

    article.comments.forEach((c: any) => map.set(c.id, { ...c, replies: [] }))

    map.forEach((node) => {
      if (node.parentId) {
        const parent = map.get(node.parentId)
        parent?.replies.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }, [article])

  const handleComment = async (values: any) => {
    if (!requireAuth() || !article) return

    await createCommentMutation.mutateAsync({
      articleId: article.articleId,
      content: values.content,
      parentId: null,
    })

    await queryClient.invalidateQueries({
      queryKey: getArticleBySlugQueryOptions(slug).queryKey,
    })

    commentForm.reset()
  }

  const handleReply = async (values: any, parentId: string) => {
    if (!requireAuth() || !article) return

    await createCommentMutation.mutateAsync({
      articleId: article.articleId,
      content: values.content,
      parentId,
    })

    await queryClient.invalidateQueries({
      queryKey: getArticleBySlugQueryOptions(slug).queryKey,
    })

    replyForm.reset()
    setReplyingTo(null)
  }

  // LOADING UI
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Skeleton height={200} radius="lg" />
        <Skeleton height={30} width="60%" />
        <Skeleton height={20} width="40%" />
        <Skeleton height={150} />
      </div>
    )
  }
  const renderComment = (comment: any, depth = 0): React.ReactNode => {
    const isReplying = replyingTo === comment.id

    return (
      <div key={comment.id} className="flex gap-3">

        {/* INDENT */}
        <div
          className={`pl-3 border-l ${depth > 0
            ? "border-slate-300 dark:border-slate-700"
            : "border-transparent"
            }`}
        >
          <div className="space-y-2">

            {/* COMMENT */}
            <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-2 shadow-sm">
              <Text fw={600} size="sm">
                {comment.authorName || "Anonymous"}
              </Text>

              <Text size="sm" className="text-slate-600 dark:text-slate-300">
                {comment.content}
              </Text>

              {/* ACTION */}
              <button
                onClick={() => {
                  if (!requireAuth()) return
                  setReplyingTo(isReplying ? null : comment.id)
                  replyForm.reset()
                }}
                className="text-xs text-indigo-500 mt-1"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            </div>

            {/* REPLY INPUT */}
            {/* REPLY INPUT */}
            {isReplying && (
              <form
                onSubmit={replyForm.onSubmit((values) =>
                  handleReply(values, comment.id)
                )}
                className="ml-2"
              >
                <textarea
                  className="w-full text-sm border-b border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none bg-transparent resize-none py-1"
                  placeholder="Write a reply..."
                  {...replyForm.getInputProps("content")}
                />

                <div className="flex justify-end mt-2 gap-2">
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      setReplyingTo(null)
                      replyForm.reset()
                    }}
                  >
                    Cancel
                  </Button>

                  <Button size="xs" type="submit">
                    Reply
                  </Button>
                </div>
              </form>
            )}


            {/* 🔥 CHILDREN (recursion) */}
            {comment.replies?.length > 0 && (
              <div className="space-y-3">
                {comment.replies.map((child: any) =>
                  renderComment(child, depth + 1)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  if (!article) return <Text>Not found</Text>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* AUTH MODAL */}
      <Modal opened={authModalOpen} onClose={() => setAuthModalOpen(false)}>
        <Text>You must sign in</Text>
        <Button
          onClick={() =>
            router.navigate({
              to: '/account',
              search: { callbackUrl: `/articles/${slug}` },
            })
          }
        >
          Sign In
        </Button>
      </Modal>

      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Link to="/articles" search={{ page: 1 }}>Back</Link>

        {session?.user?.id === article.userId && (
          <Button
            size="xs"
            onClick={() =>
              router.navigate({
                to: '/articles/$slug/edit',
                params: { slug: article.slug },
              })
            }
          >
            Edit
          </Button>
        )}
      </Group>

      <Stack gap="md">

        {/* TITLE */}
        <Text className="text-xl sm:text-2xl lg:text-3xl font-bold">
          {article.title}
        </Text>

        {/* TECHNOLOGIES */}
        <Group gap="xs" wrap="wrap">
          {article?.tags?.slice(0, 4).map((tag: string, i: number) => (
            <Badge key={i}>{tag}</Badge>
          ))}
        </Group>

        {/* AUTHOR + ACTIONS */}
        <Paper p="md" radius="lg" withBorder>
          <Group justify="space-between" wrap="wrap">

            <Group>
              <Avatar src={article.authorImage || undefined} />
              <div>
                <Text fw={600}>{article.authorName}</Text>
                <Text size="xs" c="dimmed">
                  {moment(article.createdAt).format('MMM D, YYYY')}
                </Text>
              </div>
            </Group>

            <Group>

              {/* LIKE */}
              <Button
                size="xs"
                variant={likedByUser ? 'filled' : 'light'}
                onClick={async () => {
                  if (!requireAuth()) return

                  setLikedByUser(true)
                  setLikes((p) => p + 1)

                  try {
                    const res = await likeBlog({
                      data: { articleId: article.articleId },
                    })
                    setLikes(res.likes)
                  } catch {
                    setLikedByUser(false)
                    setLikes((p) => p - 1)
                  }
                }}
                leftSection={<ThumbsUp size={14} />}
              >
                {likes}
              </Button>

              {/* DISLIKE */}
              <Button
                size="xs"
                variant="subtle"
                disabled={!likedByUser}
                onClick={async () => {
                  if (!requireAuth()) return

                  setLikedByUser(false)
                  setLikes((p) => p - 1)

                  try {
                    const res = await dislikeArticle({
                      data: { articleId: article.articleId },
                    })
                    setLikes(res.likes)
                  } catch {
                    setLikedByUser(true)
                    setLikes((p) => p + 1)
                  }
                }}
              >
                👎
              </Button>

            </Group>
          </Group>
        </Paper>

        {/* CONTENT */}
        <Paper p="md" withBorder>
          <Text className="text-sm sm:text-base leading-7 whitespace-pre-wrap">
            {article.content}
          </Text>
        </Paper>

        <Paper withBorder radius="xl" p="lg">
          <Stack gap="lg">

            <Group gap="xs">
              <MessageCircle size={18} />
              <Text fw={600}>
                {article.comments.length} Comments
              </Text>
            </Group>

            <Divider />

            {/* COMMENT INPUT */}
            <Group align="flex-start">
              <Avatar
                src={session?.user?.user_metadata?.avatar_url}
                radius="xl"
                size="sm"
              />

              <div className="flex-1">
                <form onSubmit={commentForm.onSubmit(handleComment)}>

                  <textarea
                    className="w-full text-sm border-b border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none resize-none bg-transparent py-1"
                    placeholder={
                      !session?.user
                        ? "Sign in to comment..."
                        : "Write a comment..."
                    }
                    disabled={!session?.user}
                    {...commentForm.getInputProps("content")}
                  />

                  {commentForm.values.content && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => commentForm.reset()}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="xs"
                        type="submit"
                        loading={createCommentMutation.isPending}
                      >
                        Post
                      </Button>
                    </div>
                  )}

                </form>
              </div>
            </Group>

            {/* COMMENTS LIST */}
            {commentTree.length === 0 ? (
              <div className="text-center py-6">
                <Text size="sm" c="dimmed">
                  No comments yet. Be the first!
                </Text>
              </div>
            ) : (
              <Stack gap="md">
                {commentTree.map((comment: any) =>
                  renderComment(comment, 0)
                )}
              </Stack>
            )}

          </Stack>
        </Paper>

      </Stack>
    </div>
  )
}