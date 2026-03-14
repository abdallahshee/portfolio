import { getBlogBySlugQueryOptions } from '@/queries/blog.queries'
import { useCreateCommentMutation } from '@/queries/blog.mutations'
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import moment from 'moment'
import { notifications } from '@mantine/notifications'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit2Icon,
  Heart,
  MessageCircle,
  Reply,
  Send,
  Tag,
  X,
} from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getSessionQueryOptions } from '@/queries/utils.queries'
import { toggleBlogLike } from '@/server/block-like.functions'

export const Route = createFileRoute('/blogs/$slug/details')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getBlogBySlugQueryOptions(params.slug)
    )
    const session = await context.queryClient.fetchQuery(getSessionQueryOptions())
    return session

  },
  component: RouteComponent,
})

interface CommentForm {
  content: string
}

function RouteComponent() {
  const { slug } = Route.useParams()
  const { data } = useSuspenseQuery(getBlogBySlugQueryOptions(slug))
  const createCommentMutation = useCreateCommentMutation()
  const userData = Route.useLoaderData()?.user

  // 👇 move null check here, before any state
  if (!data) {
    return (
      <Container size="md" className="py-20">
        <Paper withBorder radius="xl" className="p-10 text-center">
          <Stack align="center" gap="sm">
            <Title order={2}>Blog not found</Title>
            <Text c="dimmed">
              The article you are looking for does not exist or may have been removed.
            </Text>
            <Button component={Link} to="/blogs" leftSection={<ArrowLeft size={16} />}>
              Back to Blogs
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
  }
  const [likes, setLikes] = useState(data.likes)
  const [likedByUser, setLikedByUser] = useState(data.likedByUser)
  const [isLikePending, setIsLikePending] = useState(false)

  const handleLikeToggle = async () => {
    if (!userData) {
      notifications.show({
        title: 'Login required',
        message: 'You must be logged in to like an article.',
        color: 'orange',
      })
      return
    }

    // Optimistic update
    setLikedByUser((prev: any) => !prev)
    setLikes((prev) => (likedByUser ? prev - 1 : prev + 1))
    setIsLikePending(true)

    try {
      const result = await toggleBlogLike({ data: { blogId: data?.id! } })
      setLikes(result.likes)
      setLikedByUser(result.likedByUser)
    } catch (err: any) {
      // Revert on error
      setLikedByUser((prev: any) => !prev)
      setLikes((prev) => (likedByUser ? prev + 1 : prev - 1))
      notifications.show({
        title: 'Failed to update like',
        message: err?.message ?? 'Something went wrong.',
        color: 'red',
      })
    } finally {
      setIsLikePending(false)
    }
  }
  const [replyingTo, setReplyingTo] = useState<{
    id: string
    authorName: string | null
    depth: number
  } | null>(null)

  const commentForm = useForm<CommentForm>({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) =>
        value.trim().length < 3
          ? 'Comment must be at least 3 characters'
          : null,
    },
  })

  const replyForm = useForm<CommentForm>({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) =>
        value.trim().length < 3 ? 'Reply must be at least 3 characters' : null,
    },
  })

  if (!data) {
    return (
      <Container size="md" className="py-20">
        <Paper withBorder radius="xl" className="p-10 text-center">
          <Stack align="center" gap="sm">
            <Title order={2}>Blog not found</Title>
            <Text c="dimmed">
              The article you are looking for does not exist or may have been
              removed.
            </Text>
            <Button
              component={Link}
              to="/blogs"
              // search={{ page: 1 }}
              leftSection={<ArrowLeft size={16} />}
            >
              Back to Blogs
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
  }

  type BlogComment = (typeof data.comments)[number]
  type CommentNode = BlogComment & { replies: CommentNode[] }

  const commentTree = useMemo<CommentNode[]>(() => {
    const map = new Map<string, CommentNode>()
    const roots: CommentNode[] = []

    data.comments.forEach((comment) => {
      map.set(comment.id, { ...comment, replies: [] })
    })

    map.forEach((commentNode) => {
      if (commentNode.parentId) {
        const parent = map.get(commentNode.parentId)
        if (parent) {
          parent.replies.push(commentNode)
        } else {
          roots.push(commentNode)
        }
      } else {
        roots.push(commentNode)
      }
    })

    return roots
  }, [data.comments])

  const handleCommentSubmit = async (values: CommentForm) => {
    try {
      await createCommentMutation.mutateAsync({
        blogId: data.id,
        slug,
        content: values.content,
        parentId: null,
      })

      notifications.show({
        title: 'Comment submitted',
        message: 'Your comment has been added successfully.',
        color: 'green',
      })

      commentForm.reset()
    } catch (err: any) {
      notifications.show({
        title: 'Failed to add comment',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const handleReplySubmit = async (values: CommentForm) => {
    if (!replyingTo) return

    try {
      await createCommentMutation.mutateAsync({
        blogId: data.id,
        slug,
        content: values.content,
        parentId: replyingTo.id,
      })

      notifications.show({
        title: 'Reply submitted',
        message: 'Your reply has been added successfully.',
        color: 'green',
      })

      replyForm.reset()
      setReplyingTo(null)
    } catch (err: any) {
      notifications.show({
        title: 'Failed to add reply',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const getIndentClass = (depth: number) => {
    const d = Math.min(depth, 1)
    if (d === 0) return ''
    return 'ml-2'
  }

  const renderCommentNode = (comment: CommentNode, depth = 0): React.ReactNode => {
    const indentClass = getIndentClass(depth)
    const isReplyTarget = replyingTo?.id === comment.id

    return (
      <div key={comment.id} className="space-y-3">
        <div className={indentClass}>
          <Paper
            radius="xl"
            withBorder
            className={`${depth === 0 ? 'bg-gray-50' : 'bg-white'} p-4`}
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={comment.authorImage || undefined}
                    alt={comment.authorName || 'User'}
                    radius="xl"
                    size="sm"
                  />

                  <div className="min-w-0">
                    <Text fw={600} size="sm">
                      {comment.authorName || 'Anonymous'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {moment(comment.createdAt).fromNow()}
                    </Text>
                  </div>
                </Group>
              </Group>

              <Text
                size="sm"
                c="dark"
                className="leading-7 whitespace-pre-wrap"
              >
                {comment.content}
              </Text>

              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<Reply size={14} />}
                  onClick={() => {
                    setReplyingTo(
                      isReplyTarget
                        ? null
                        : {
                          id: comment.id,
                          authorName: comment.authorName,
                          depth,
                        }
                    )
                    replyForm.reset()
                  }}
                >
                  {isReplyTarget ? 'Cancel' : 'Reply'}
                </Button>
              </Group>
            </Stack>
          </Paper>
        </div>

        {/* Shared reply form, width no longer keeps shrinking */}

        {isReplyTarget ? (
          <div className="mt-3">
            <Paper withBorder radius="lg" className="p-3 bg-white">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Replying to {comment.authorName || 'Anonymous'}
                  </Text>

                  <Button
                    variant="subtle"
                    size="xs"
                    color="gray"
                    leftSection={<X size={14} />}
                    onClick={() => {
                      setReplyingTo(null)
                      replyForm.reset()
                    }}
                  >
                    Close
                  </Button>
                </Group>

                <form onSubmit={replyForm.onSubmit(handleReplySubmit)}>
                  <Stack gap="sm">
                    <Textarea
                      placeholder="Write your reply..."
                      minRows={3}
                      autosize
                      {...replyForm.getInputProps('content')}
                    />

                    <Group justify="flex-end">
                      <Button
                        type="submit"
                        size="sm"
                        loading={createCommentMutation.isPending}
                        rightSection={<Send size={14} />}
                      >
                        Reply
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Stack>
            </Paper>
          </div>
        ) : null}
        {comment.replies.length > 0 ? (
          <div className={`${depth === 0 ? 'ml-2' : 'ml-4'} border-l border-gray-200 pl-3`}>
            <Stack gap="sm">
              {comment.replies.map((reply) => renderCommentNode(reply, depth + 1))}
            </Stack>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Container size="lg" className="py-12 lg:py-16 space-y-10">
      <Group justify='space-between'>
        <Button
          component={Link}
          to="/blogs"
          // search={{ page: 1 }}
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
        >
          Back to Blogs
        </Button>
        {((userData?.id === data?.userId) || (userData?.role === "admin")) &&
          <Button
            color='green'
            component={Link}
            to="/blogs"
            // search={{ page: 1 }}
            variant="filled"
            leftSection={<Edit2Icon size={16} />}
          >
            Edit this Article
          </Button>
        }
      </Group>

      <section className="space-y-8">
        {data.coverImage ? (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
            <img
              src={data.coverImage}
              alt={data.title}
              className="h-[260px] w-full object-cover md:h-[380px]"
            />
          </div>
        ) : null}

        <div className="space-y-5">
          <Group gap="xs">
            {data.tags.map((tag) => (
              <Badge
                key={tag}
                variant="light"
                color="indigo"
                leftSection={<Tag size={12} />}
              >
                {tag}
              </Badge>
            ))}
          </Group>

          <Title className="text-3xl md:text-5xl font-extrabold leading-tight">
            {data.title}
          </Title>

          <Group justify="space-between" align="center" className="gap-4">
            <Group gap="sm">
              <Avatar
                src={data.authorImage || undefined}
                alt={data.authorName || 'Author'}
                radius="xl"
                size="md"
              />
              <div>
                <Text fw={500}>{data.authorName || 'Unknown Author'}</Text>
                <Text size="sm" c="dimmed">
                  Article Author
                </Text>
              </div>
            </Group>

            <Group gap="lg" className="flex-wrap">
              <Group gap={6}>
                <button
                  onClick={handleLikeToggle}
                  disabled={isLikePending}
                  aria-label={likedByUser ? 'Unlike this article' : 'Like this article'}
                  className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
      ${likedByUser
                      ? 'bg-rose-50 border-rose-300 text-rose-500 hover:bg-rose-100'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-400'
                    }
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
                >
                  <Heart
                    size={16}
                    className={`transition-all duration-200 ${likedByUser
                        ? 'fill-rose-500 stroke-rose-500 scale-110'
                        : 'stroke-current'
                      }`}
                  />
                  <span className="text-sm font-medium">
                    {likes} {likes === 1 ? 'like' : 'likes'}
                  </span>
                </button>
              </Group>


              <Group gap={6}>
                <CalendarDays size={18} className="text-gray-500" />
                <Text size="sm" c="dimmed">
                  {new Date(data.createdAt).toLocaleDateString()}
                </Text>
              </Group>

              <Group gap={6}>
                <Clock3 size={18} className="text-gray-500" />
                <Text size="sm" c="dimmed">
                  Updated {new Date(data.updatedAt).toLocaleDateString()}
                </Text>
              </Group>
            </Group>
          </Group>
        </div>
      </section>

      <Divider />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_420px] h-[calc(100vh-220px)]">
        {/* LEFT: article panel */}
        <article className="min-h-0">
          <Paper
            withBorder
            radius="2xl"
            className="h-full p-0 overflow-hidden"
          >
            <div className="h-full overflow-y-auto p-6 md:p-8">
              <Stack gap="lg">
                <Title order={3}>Article</Title>

                <Text
                  className="leading-8 whitespace-pre-wrap text-[15px] md:text-base"
                  c="dark"
                >
                  {data.content}
                </Text>
              </Stack>
            </div>
          </Paper>
        </article>

        {/* RIGHT: comments panel */}
        <aside className="min-h-0">
          <Paper
            withBorder
            radius="2xl"
            shadow="sm"
            className="h-full overflow-hidden"
          >
            <div className="flex h-full flex-col">
              {/* Sticky / fixed top area inside comments panel */}
              <div className="shrink-0 border-b border-gray-200 p-5 bg-white">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <MessageCircle size={18} className="text-indigo-500" />
                      <Title order={4}>Comments</Title>
                    </Group>

                    <Badge variant="light" color="grape">
                      {data.comments.length}
                    </Badge>
                  </Group>

                  <form onSubmit={commentForm.onSubmit(handleCommentSubmit)}>
                    <Stack gap="sm">
                      <Textarea
                        label="Add a comment"
                        placeholder="Write your thoughts about this article..."
                        minRows={3}
                        autosize
                        {...commentForm.getInputProps('content')}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        loading={createCommentMutation.isPending}
                        rightSection={<Send size={16} />}
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        Post Comment
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </div>

              {/* Scrollable comments area */}
              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                {commentTree.length > 0 ? (
                  <Stack gap="sm">
                    {commentTree.map((comment) => renderCommentNode(comment))}
                  </Stack>
                ) : (
                  <Text c="dimmed" size="sm">
                    No comments yet. Be the first to leave one.
                  </Text>
                )}
              </div>
            </div>
          </Paper>
        </aside>
      </section>
    </Container>
  )
}