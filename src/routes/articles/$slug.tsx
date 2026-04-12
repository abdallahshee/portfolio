import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { getArticleBySlugQueryOptions } from '@/db/queries/article.queries'
import { OptionalAuthMiddleware } from '@/server/middleware/auth.middleware'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Avatar, Modal, Button, Text, Badge, Divider, Paper, Stack, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import moment from 'moment'
import {
  ArrowLeft, CalendarDays, Edit2Icon, MessageCircle,
  Reply, ThumbsUp, Share2, Bookmark, Eye,
  ChevronDown, ChevronUp, LogIn, BookOpen,
} from 'lucide-react'
import { dislikeArticle, likeBlog } from '@/server/article-like.functions'
import { useCreateCommentMutation } from '@/db/mutations/comment.mutations'

export const Route = createFileRoute('/articles/$slug')({
  server: { middleware: [OptionalAuthMiddleware] },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getArticleBySlugQueryOptions(params.slug)
    )
  },
  component: RouteComponent,
})

interface CommentForm {
  content: string
}

function RouteComponent() {
  const {slug}  = Route.useParams()
  const { data } = useSuspenseQuery(getArticleBySlugQueryOptions(slug))
  const router = useRouter()
  const createCommentMutation = useCreateCommentMutation()
  const supabase = getSupabaseBrowserClient()
const queryClient=useQueryClient()
  const [likes, setLikes] = useState(data?.likes ?? 0)
  const [likedByUser, setLikedByUser] = useState(data?.likedByUser ?? false)
  const [isLikePending, setIsLikePending] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{
    id: string
    authorName: string | null
    depth: number
  } | null>(null)

  // ✅ Fixed — auth effect was missing entirely, causing session to always be null
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data?.session ?? null)
      setHasInitialized(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return
        if (event === 'INITIAL_SESSION') {
          setSession(nextSession)
          setHasInitialized(true)
          return
        }
        setSession(nextSession)
      }
    )

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const commentForm = useForm<CommentForm>({
    initialValues: { content: '' },
    validate: {
      content: (v) => v.trim().length < 3 ? 'Comment must be at least 3 characters' : null,
    },
  })

  const replyForm = useForm<CommentForm>({
    initialValues: { content: '' },
    validate: {
      content: (v) => v.trim().length < 3 ? 'Reply must be at least 3 characters' : null,
    },
  })

  // ✅ Fixed — only prompt auth after session has initialized and user is confirmed unauthenticated
  const requireAuth = (): boolean => {
    if (!hasInitialized) return false
    if (!session?.user) {
      setAuthModalOpen(true)
      return false
    }
    return true
  }

  type BlogComment = NonNullable<typeof data>['comments'][number]
  type CommentNode = BlogComment & { replies: CommentNode[] }

  const commentTree = useMemo<CommentNode[]>(() => {
    const map = new Map<string, CommentNode>()
    const roots: CommentNode[] = []
    data?.comments.forEach((c: any) => map.set(c.id, { ...c, replies: [] }))
    map.forEach((node) => {
      if (node.parentId) {
        const parent = map.get(node.parentId)
        parent ? parent.replies.push(node) : roots.push(node)
      } else {
        roots.push(node)
      }
    })
    return roots
  }, [data?.comments])

const handleCommentSubmit = async (values: CommentForm) => {
  if (!requireAuth()) return
  try {
    await createCommentMutation.mutateAsync({
      articleId: data?.articleId!,
      content: values.content,
      parentId: null,
    })
    // ✅ invalidate so the comment list refetches immediately
    await queryClient.invalidateQueries({
      queryKey: getArticleBySlugQueryOptions(slug).queryKey,
    })
    notifications.show({ title: 'Comment posted', message: 'Your comment was added.', color: 'green' })
    commentForm.reset()
  } catch (err: any) {
    notifications.show({ title: 'Failed', message: err?.message ?? 'Something went wrong', color: 'red' })
  }
}

const handleReplySubmit = async (values: CommentForm) => {
  if (!replyingTo || !requireAuth()) return
  try {
    await createCommentMutation.mutateAsync({
      articleId: data?.articleId!,
      content: values.content,
      parentId: replyingTo.id,
    })
    // ✅ invalidate so the reply appears immediately
    await queryClient.invalidateQueries({
      queryKey: getArticleBySlugQueryOptions(slug).queryKey,
    })
    notifications.show({ title: 'Reply posted', message: 'Your reply was added.', color: 'green' })
    replyForm.reset()
    setReplyingTo(null)
  } catch (err: any) {
    notifications.show({ title: 'Failed', message: err?.message ?? 'Something went wrong', color: 'red' })
  }
}

  const visibleComments = showAllComments ? commentTree : commentTree.slice(0, 3)

  const renderCommentNode = (comment: CommentNode, depth = 0): React.ReactNode => {
    const isReplyTarget = replyingTo?.id === comment.id
    return (
      <div key={comment.id}>
        <div className="flex gap-3">
          <Avatar
            src={comment.authorImage || undefined}
            alt={comment.authorName || 'User'}
            radius="xl"
            size={depth === 0 ? 'sm' : 'xs'}
            className="shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {comment.authorName || 'Anonymous'}
              </span>
              <span className="text-xs text-slate-400">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {comment.content}
            </p>
            <button
              onClick={() => {
                if (!requireAuth()) return
                setReplyingTo(isReplyTarget ? null : {
                  id: comment.id,
                  authorName: comment.authorName,
                  depth,
                })
                replyForm.reset()
              }}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Reply size={12} />
              {isReplyTarget ? 'Cancel' : 'Reply'}
            </button>

            {isReplyTarget && (
              <div className="mt-3 flex gap-3">
                <Avatar
                  src={session?.user?.user_metadata?.avatar_url}
                  alt={session?.user?.user_metadata?.full_name}
                  radius="xl"
                  size="xs"
                  className="shrink-0 mt-1"
                />
                <div className="flex-1">
                  <form onSubmit={replyForm.onSubmit(handleReplySubmit)}>
                    <textarea
                      placeholder={`Reply to ${comment.authorName || 'Anonymous'}...`}
                      rows={2}
                      className="w-full text-sm border-b border-slate-300 dark:border-slate-600 focus:border-indigo-500 outline-none resize-none bg-transparent text-slate-800 dark:text-slate-200 py-0"
                      {...replyForm.getInputProps('content')}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => { setReplyingTo(null); replyForm.reset() }}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createCommentMutation.isPending}
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="mt-4 ml-1 border-l-2 border-slate-100 dark:border-slate-700 pl-4 space-y-4">
                {comment.replies.map((r: any) => renderCommentNode(r, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Stack align="center" gap="md">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <BookOpen size={32} className="text-slate-400" />
          </div>
          <Text fw={600} size="lg">Article not found</Text>
          <Text size="sm" c="dimmed">This article doesn't exist or was removed.</Text>
          <Link
            to="/articles"
            search={{ page: 1 }}
            className="inline-flex items-center gap-2 text-indigo-600 text-sm hover:underline"
          >
            <ArrowLeft size={14} /> Back to Articles
          </Link>
        </Stack>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Auth Modal */}
      <Modal
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={
          <Group gap="xs">
            <LogIn size={18} className="text-indigo-600" />
            <Text fw={600} size="sm">Sign in required</Text>
          </Group>
        }
        centered
        radius="lg"
        size="sm"
      >
        <Stack gap="md" pb="sm">
          <Text size="sm" c="dimmed">
            You need to be signed in to interact with this article.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" color="gray" size="sm" onClick={() => setAuthModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="indigo"
              size="sm"
              leftSection={<LogIn size={15} />}
              onClick={() => {
                setAuthModalOpen(false)
                router.navigate({
                  to: '/account',
                  search: { callbackUrl: `/articles/${encodeURIComponent(slug)}` },
                })
              }}
            >
              Sign In
            </Button>
          </Group>
        </Stack>
      </Modal>

      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* Top nav */}
        <Group justify="space-between" mb="xl">
          <Link
            to="/articles"
            search={{ page: 1 }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Articles
          </Link>

          {session?.user?.id === data.userId && (
            <Button
              variant="light"
              color="indigo"
              size="sm"
              radius="md"
              leftSection={<Edit2Icon size={14} />}
              onClick={() => router.navigate({
                to: '/articles/$slug/edit',
                params: { slug: data?.slug },
              })}
            >
              Edit Article
            </Button>
          )}
        </Group>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Cover image */}
            {data.coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-200 dark:bg-slate-800">
                <img
                  src={data.coverImage}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title + meta */}
            <div className="space-y-3">
              {data.categoryName && (
                <Badge variant="light" color="indigo" radius="xl" size="sm">
                  {data.categoryName}
                </Badge>
              )}
              <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                {data.title}
              </h1>
            </div>

            {/* Author + actions bar */}
            <Paper withBorder radius="xl" p="md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Group gap="sm">
                  <Avatar
                    src={data.authorImage || undefined}
                    alt={data.authorName || 'Author'}
                    radius="xl"
                    size="md"
                  />
                  <div>
                    <Text size="sm" fw={600} className="leading-tight">
                      {data.authorName || 'Unknown Author'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(data.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </Text>
                  </div>
                </Group>

                <Group gap="xs">
                  {/* Like / dislike */}
                  <div className="flex items-center rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={async () => {
                        if (!requireAuth()) return
                        if (likedByUser) return
                        setLikedByUser(true)
                        setLikes((p: number) => p + 1)
                        setIsLikePending(true)
                        try {
                          const result = await likeBlog({ data: { articleId: data.articleId } })
                          setLikes(result.likes)
                          setLikedByUser(result.likedByUser)
                        } catch (err: any) {
                          setLikedByUser(false)
                          setLikes((p: number) => p - 1)
                          notifications.show({ title: 'Failed to like', message: err?.message ?? 'Something went wrong.', color: 'red' })
                        } finally {
                          setIsLikePending(false)
                        }
                      }}
                      disabled={isLikePending || likedByUser}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                        likedByUser
                          ? 'bg-indigo-600 text-white cursor-default'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      } disabled:opacity-60`}
                    >
                      <ThumbsUp size={14} className={likedByUser ? 'fill-white' : ''} />
                      <span>{likes.toLocaleString()}</span>
                    </button>
                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                    <button
                      onClick={async () => {
                        if (!requireAuth()) return
                        if (!likedByUser) return
                        setLikedByUser(false)
                        setLikes((p: number) => p - 1)
                        setIsLikePending(true)
                        try {
                          const result = await dislikeArticle({ data: { articleId: data.articleId } })
                          setLikes(result.likes)
                          setLikedByUser(result.likedByUser)
                        } catch (err: any) {
                          setLikedByUser(true)
                          setLikes((p: number) => p + 1)
                          notifications.show({ title: 'Failed to dislike', message: err?.message ?? 'Something went wrong.', color: 'red' })
                        } finally {
                          setIsLikePending(false)
                        }
                      }}
                      disabled={isLikePending || !likedByUser}
                      className={`px-3 py-2 transition-colors ${
                        !likedByUser
                          ? 'text-slate-300 dark:text-slate-600 cursor-default'
                          : 'text-slate-500 hover:bg-red-50 hover:text-red-500'
                      } disabled:opacity-60`}
                    >
                      <ThumbsUp size={13} className="rotate-180" />
                    </button>
                  </div>

                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Share2 size={13} /> Share
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Bookmark size={13} /> Save
                  </button>
                </Group>
              </div>
            </Paper>

            {/* Last updated */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 px-1">
              <Eye size={12} />
              <span>
                Updated {new Date(data.updatedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>

            {/* Article body */}
            <Paper withBorder radius="xl" p="xl">
              <div className="prose prose-slate dark:prose-invert max-w-none leading-8 text-slate-700 dark:text-slate-300 text-[15px] whitespace-pre-wrap">
                {data.content}
              </div>
            </Paper>

            {/* Comments */}
            <Paper withBorder radius="xl" p="xl">
              <Stack gap="lg">
                <Group gap="xs">
                  <MessageCircle size={18} className="text-indigo-500" />
                  <Text fw={600} size="md">
                    {data.comments.length.toLocaleString()} {data.comments.length === 1 ? 'Comment' : 'Comments'}
                  </Text>
                </Group>

                <Divider />

                {/* Comment input */}
                <div className="flex gap-3">
                  <Avatar
                    src={session?.user?.user_metadata?.avatar_url}
                    alt={session?.user?.user_metadata?.full_name || 'You'}
                    radius="xl"
                    size="sm"
                    className="shrink-0 mt-1"
                  />
                  <div className="flex-1">
                    <form onSubmit={commentForm.onSubmit(handleCommentSubmit)}>
                      <textarea
                        placeholder={
                          hasInitialized && !session?.user
                            ? 'Sign in to leave a comment...'
                            : 'Share your thoughts...'
                        }
                        rows={1}
                        className="w-full text-sm border-b border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none resize-none bg-transparent text-slate-800 dark:text-slate-200 py-1 placeholder-slate-400 transition-colors"
                        onFocus={() => {
                          if (hasInitialized && !session?.user) setAuthModalOpen(true)
                        }}
                        {...commentForm.getInputProps('content')}
                      />
                      {commentForm.values.content && (
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => commentForm.reset()}
                            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={createCommentMutation.isPending}
                            className="px-4 py-1.5 text-sm bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                            {createCommentMutation.isPending ? 'Posting...' : 'Comment'}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Comment list */}
                {commentTree.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2">
                    <MessageCircle size={28} className="text-slate-300 dark:text-slate-600" />
                    <Text size="sm" c="dimmed">No comments yet. Be the first!</Text>
                  </div>
                ) : (
                  <Stack gap="lg">
                    {visibleComments.map((c) => renderCommentNode(c))}
                    {commentTree.length > 3 && (
                      <button
                        onClick={() => setShowAllComments((p) => !p)}
                        className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
                      >
                        {showAllComments
                          ? <><ChevronUp size={15} /> Show less</>
                          : <><ChevronDown size={15} /> Show {commentTree.length - 3} more comments</>
                        }
                      </button>
                    )}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* Author card */}
            <Paper withBorder radius="xl" p="lg">
              <Stack gap="md">
                <Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">
                  About the Author
                </Text>
                <Group gap="sm">
                  <Avatar
                    src={data.authorImage || undefined}
                    alt={data.authorName || 'Author'}
                    radius="xl"
                    size="lg"
                  />
                  <div>
                    <Text fw={600} size="sm">{data.authorName || 'Unknown'}</Text>
                    <Text size="xs" c="dimmed">Article Author</Text>
                  </div>
                </Group>

                <Divider />

                <Stack gap="xs">
                  <Group gap="sm" className="text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays size={14} className="text-slate-400 shrink-0" />
                    <Text size="sm" c="dimmed">
                      {new Date(data.createdAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <ThumbsUp size={14} className="text-slate-400 shrink-0" />
                    <Text size="sm" c="dimmed">
                      {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <MessageCircle size={14} className="text-slate-400 shrink-0" />
                    <Text size="sm" c="dimmed">
                      {data.comments.length} {data.comments.length === 1 ? 'comment' : 'comments'}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Paper>

            {/* Category card */}
            {data.categoryName && (
              <Paper withBorder radius="xl" p="lg">
                <Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest mb-3">
                  Category
                </Text>
                <Badge variant="light" color="indigo" radius="xl" size="md">
                  {data.categoryName}
                </Badge>
              </Paper>
            )}

            {/* Article stats */}
            <Paper withBorder radius="xl" p="lg">
              <Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest mb-3">
                Article Stats
              </Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Status</Text>
                  <Badge
                    variant="light"
                    color={data.status === 'published' ? 'green' : data.status === 'pending' ? 'yellow' : 'gray'}
                    radius="xl"
                    size="sm"
                  >
                    {data.status}
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Likes</Text>
                  <Text size="sm" fw={500}>{likes.toLocaleString()}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Comments</Text>
                  <Text size="sm" fw={500}>{data.comments.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Published</Text>
                  <Text size="sm" fw={500}>
                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </Text>
                </Group>
              </Stack>
            </Paper>

          </div>
        </div>
      </div>
    </div>
  )
}