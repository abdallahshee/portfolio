import { Avatar, Modal, Button, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import moment from 'moment'
import { notifications } from '@mantine/notifications'
import { useMemo, useState } from 'react'
import {
  ArrowLeft, CalendarDays, Edit2Icon, MessageCircle,
  Reply, Tag, ThumbsUp, Share2, Bookmark, Eye,
  ChevronDown, ChevronUp, LogIn,
} from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { dislikeBlog, likeBlog } from '@/server/blog-like.functions'
import { useCreateCommentMutation } from '@/db/mutations/comment.mutations'

interface CommentForm {
  content: string
}

interface Props {
  slug: string
  data: any
  userData?: any
  isAdmin?: boolean
}

export default function ArticleDetails({ slug, data, userData, isAdmin = false }: Props) {
  const createCommentMutation = useCreateCommentMutation()
  const router = useRouter()

  const [likes, setLikes] = useState(data?.likes ?? 0)
  const [likedByUser, setLikedByUser] = useState(data?.likedByUser ?? false)
  const [isLikePending, setIsLikePending] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{
    id: string
    authorName: string | null
    depth: number
  } | null>(null)

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

  const requireAuth = (): boolean => {
    if (!userData) {
      setAuthModalOpen(true)
      return false
    }
    return true
  }

  type BlogComment = (typeof data.comments)[number]
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
  }, [data.comments])

  const handleCommentSubmit = async (values: CommentForm) => {
    if (!requireAuth()) return
    try {
      await createCommentMutation.mutateAsync({
        blogId: data?.id, slug, content: values.content, parentId: null,
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
        blogId: data?.id, slug, content: values.content, parentId: replyingTo.id,
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
      <div key={comment.id} className="group">
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
              <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                {comment.authorName || 'Anonymous'}
              </span>
              <span className="text-gray-400 text-xs">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center gap-3 mt-2">
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
                className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 text-xs font-medium transition-colors"
              >
                <Reply size={13} />
                {isReplyTarget ? 'Cancel' : 'Reply'}
              </button>
            </div>

            {isReplyTarget && (
              <div className="mt-3 flex gap-3">
                <Avatar
                  src={userData?.image || undefined}
                  alt={userData?.name || 'You'}
                  radius="xl"
                  size="xs"
                  className="shrink-0 mt-1"
                />
                <div className="flex-1">
                  <form onSubmit={replyForm.onSubmit(handleReplySubmit)}>
                    <textarea
                      placeholder={`Reply to ${comment.authorName || 'Anonymous'}...`}
                      rows={2}
                      className="w-full text-sm border-b border-gray-300 focus:border-indigo-500 outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 py-0"
                      {...replyForm.getInputProps('content')}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => { setReplyingTo(null); replyForm.reset() }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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
              <div className="mt-3 ml-1 border-l-2 border-gray-100 pl-4 space-y-4">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h2 className="text-gray-800 dark:text-gray-200 text-xl font-semibold">Blog not found</h2>
          <p className="text-gray-500 text-sm">This article doesn't exist or was removed.</p>
          <Link
            to="/articles"
            search={{ page: 1 }}
            className="inline-flex items-center gap-2 text-indigo-600 text-sm hover:underline"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">

      {/* Auth Modal */}
      <Modal
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <LogIn size={18} className="text-indigo-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">Sign in required</span>
          </div>
        }
        centered
        radius="lg"
        size="sm"
      >
        <div className="space-y-4 pb-2">
          <Text size="sm" c="dimmed">
            You need to be signed in to interact with this article.
          </Text>
          <div className="flex gap-3 justify-end">
            <Button variant="subtle" color="gray" onClick={() => setAuthModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="indigo"
              leftSection={<LogIn size={15} />}
              onClick={() => {
                setAuthModalOpen(false)
                router.navigate({
                  to: '/account',
                  search: { callbackUrl: `/blogs/${encodeURIComponent(slug)}/details` },
                })
              }}
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </Modal>

      <div className="max-w-[1280px] mx-auto px-4 py-6">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={isAdmin ? '/admin/articles' : '/articles'}
            search={{ page: 1 }}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Articles'
          </Link>

          {/* Edit button — shown to author OR admin */}
          {(userData?.id === data.userId) && (
            <Button
              variant="filled"
              onClick={() => router.navigate({
                to: '/articles/$slug/edit',
                params: { slug: data.slug },
              })}
              className="flex items-center gap-2"
            >
              Edit Article&nbsp;
              <Edit2Icon size={14} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {data.coverImage && (
              <div className="rounded-xl overflow-hidden bg-gray-200 aspect-video">
                <img src={data.coverImage} alt={data.title} className="w-full h-full object-cover" />
              </div>
            )}

            <h1 className="text-2xl font-bold leading-snug">{data.title}</h1>

            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs rounded-full cursor-pointer transition-colors"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between py-3 border-y border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Avatar src={data.authorImage || undefined} alt={data.authorName || 'Author'} radius="xl" size="md" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{data.authorName || 'Unknown Author'}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={async () => {
                      if (!requireAuth()) return
                      if (likedByUser) return
                      setLikedByUser(true)
                      setLikes((p: number) => p + 1)
                      setIsLikePending(true)
                      try {
                        const result = await likeBlog({ data: { blogId: data.id } })
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
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150 ${likedByUser ? 'bg-indigo-600 text-white cursor-default' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'} disabled:opacity-60`}
                  >
                    <ThumbsUp size={15} className={likedByUser ? 'fill-white' : ''} />
                    <span>{likes.toLocaleString()}</span>
                  </button>

                  <div className="w-px h-5 bg-gray-200 dark:bg-slate-700" />

                  <button
                    onClick={async () => {
                      if (!requireAuth()) return
                      if (!likedByUser) return
                      setLikedByUser(false)
                      setLikes((p: number) => p - 1)
                      setIsLikePending(true)
                      try {
                        const result = await dislikeBlog({ data: { blogId: data.id } })
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
                    className={`px-3 py-2 transition-colors ${!likedByUser ? 'text-gray-300 cursor-default' : 'text-gray-600 hover:bg-red-50 hover:text-red-500'} disabled:opacity-60`}
                  >
                    <ThumbsUp size={14} className="rotate-180" />
                  </button>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full transition-colors">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full transition-colors">
                  <Bookmark size={14} /> Save
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
              <span className="flex items-center gap-1.5">
                <Eye size={13} />
                Updated {new Date(data.updatedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 leading-8 text-gray-700 dark:text-gray-300 text-[15px] whitespace-pre-wrap shadow-sm">
              {data.content}
            </div>

            {/* Comments */}
            <div className="space-y-5 pt-2">
              <h3 className="font-semibold text-lg">
                {data.comments.length.toLocaleString()} Comments
              </h3>

              <form onSubmit={commentForm.onSubmit(handleCommentSubmit)}>
                <div className="flex gap-3">
                  <Avatar src={userData?.image || undefined} alt={userData?.name || 'You'} radius="xl" size="sm" className="shrink-0 mt-1" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      rows={1}
                      className="w-full text-sm border-b border-gray-300 dark:border-slate-600 focus:border-indigo-500 outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 py-0.5 placeholder-gray-400"
                      onFocus={() => { if (!userData) setAuthModalOpen(true) }}
                      {...commentForm.getInputProps('content')}
                    />
                    {commentForm.values.content && (
                      <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => commentForm.reset()} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                          Cancel
                        </button>
                        <button type="submit" disabled={createCommentMutation.isPending} className="px-3 py-1.5 text-sm bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50">
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="space-y-6">
                {commentTree.length === 0 ? (
                  <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
                ) : (
                  <>
                    {visibleComments.map((c) => renderCommentNode(c))}
                    {commentTree.length > 3 && (
                      <button
                        onClick={() => setShowAllComments((p) => !p)}
                        className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
                      >
                        {showAllComments
                          ? <><ChevronUp size={16} /> Show less</>
                          : <><ChevronDown size={16} /> Show {commentTree.length - 3} more comments</>
                        }
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-4 shadow-sm">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">About the Author</p>
              <div className="flex items-center gap-3">
                <Avatar src={data.authorImage || undefined} alt={data.authorName || 'Author'} radius="xl" size="lg" />
                <div>
                  <p className="font-semibold">{data.authorName || 'Unknown'}</p>
                  <p className="text-gray-400 text-xs">Article Author</p>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 pt-3 space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarDays size={14} className="text-gray-400" />
                  <span>{new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <ThumbsUp size={14} className="text-gray-400" />
                  <span>{likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <MessageCircle size={14} className="text-gray-400" />
                  <span>{data.comments.length} {data.comments.length === 1 ? 'comment' : 'comments'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-3 shadow-sm">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs rounded-full cursor-pointer transition-colors">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}