import { getBlogBySlugQueryOptions } from '@/queries/blog.queries'
import { createFileRoute, Link } from '@tanstack/react-router'
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
import { notifications } from '@mantine/notifications'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Reply,
  Send,
  Tag,
} from 'lucide-react'
import { useCreateCommentMutation } from '@/queries/blog.mutations'

export const Route = createFileRoute('/blogs/$slug/details')({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(
      getBlogBySlugQueryOptions(params.slug)
    )
    return data
  },
  component: RouteComponent,
})

interface CommentForm {
  content: string
}

interface ReplyFormProps {
  blogId: string
  slug: string
  parentId: string
  onSuccess?: () => void
}

function ReplyForm({ blogId, slug, parentId, onSuccess }: ReplyFormProps) {
  const mutation = useCreateCommentMutation()

  const form = useForm<CommentForm>({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) =>
        value.trim().length < 3 ? 'Reply must be at least 3 characters' : null,
    },
  })

  const handleReply = async (values: CommentForm) => {
    try {
      await mutation.mutateAsync({
        blogId,
        slug,
        content: values.content,
        parentId,
      })

      notifications.show({
        title: 'Reply submitted',
        message: 'Your reply has been added successfully.',
        color: 'green',
      })

      form.reset()
      onSuccess?.()
    } catch (err: any) {
      notifications.show({
        title: 'Failed to add reply',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleReply)}>
      <Stack gap="xs" mt="sm">
        <Textarea
          placeholder="Write your reply..."
          minRows={3}
          autosize
          {...form.getInputProps('content')}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            size="xs"
            loading={mutation.isPending}
            rightSection={<Send size={14} />}
          >
            Reply
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const { slug } = Route.useParams()
  const createCommentMutation = useCreateCommentMutation()
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

  if (!loaderData) {
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

  const data = loaderData
  type BlogComment = (typeof data.comments)[number]

  const form = useForm<CommentForm>({
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

  const commentTree = useMemo(() => {
    const rootComments: BlogComment[] = data.comments.filter(
      (comment) => !comment.parentId
    )

    const repliesMap = new Map<string, BlogComment[]>()

    data.comments.forEach((comment) => {
      if (comment.parentId) {
        const existing = repliesMap.get(comment.parentId) ?? []
        repliesMap.set(comment.parentId, [...existing, comment])
      }
    })

    return { rootComments, repliesMap }
  }, [data.comments])

  const handleSubmit = async (values: CommentForm) => {
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

      form.reset()
    } catch (err: any) {
      notifications.show({
        title: 'Failed to add comment',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  return (
    <Container size="lg" className="py-12 lg:py-16 space-y-10">
      <Group>
        <Button
          component={Link}
          to="/blogs"
          // search={{ page: 1 }}
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
        >
          Back to Blogs
        </Button>
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
                <Text fw={600}>{data.authorName || 'Unknown Author'}</Text>
                <Text size="sm" c="dimmed">
                  Article Author
                </Text>
              </div>
            </Group>

            <Group gap="lg" className="flex-wrap">
              <Group gap={6}>
                <Heart size={16} className="text-rose-500" />
                <Text size="sm" c="dimmed">
                  {data.likes} {data.likes === 1 ? 'like' : 'likes'}
                </Text>
              </Group>

              <Group gap={6}>
                <CalendarDays size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">
                  {new Date(data.createdAt).toLocaleDateString()}
                </Text>
              </Group>

              <Group gap={6}>
                <Clock3 size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">
                  Updated {new Date(data.updatedAt).toLocaleDateString()}
                </Text>
              </Group>
            </Group>
          </Group>
        </div>
      </section>

      <Divider />

      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_360px] items-start">
        <article>
          <Paper withBorder radius="2xl" className="p-6 md:p-8">
            <Stack gap="lg">
              <Title order={3}>Article</Title>

              <Text
                className="leading-8 whitespace-pre-wrap text-[15px] md:text-base"
                c="dark"
              >
                {data.content}
              </Text>
            </Stack>
          </Paper>
        </article>

        <aside className="space-y-6">
          <Card withBorder radius="2xl" shadow="sm" className="p-5">
            <Stack gap="md">
              <Group gap="sm">
                <MessageCircle size={18} className="text-indigo-500" />
                <Title order={4}>Add a Comment</Title>
              </Group>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="sm">
                  <Textarea
                    label="Your Comment"
                    placeholder="Write your thoughts about this article..."
                    minRows={5}
                    autosize
                    {...form.getInputProps('content')}
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
          </Card>

          <Card withBorder radius="2xl" shadow="sm" className="p-5">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Comments</Title>
                <Badge variant="light" color="grape">
                  {data.comments.length}
                </Badge>
              </Group>

              <Divider />

              {commentTree.rootComments.length > 0 ? (
                <Stack gap="md">
                  {commentTree.rootComments.map((comment) => {
                    const replies = commentTree.repliesMap.get(comment.id) ?? []

                    return (
                      <Paper
                        key={comment.id}
                        radius="xl"
                        withBorder
                        className="p-4 bg-gray-50"
                      >
                        <Stack gap="sm">
                          <Group justify="space-between" align="flex-start">
                            <Group gap="sm">
                              <Avatar
                                src={comment.authorImage || undefined}
                                alt={comment.authorName || 'User'}
                                radius="xl"
                                size="sm"
                              />
                              <div>
                                <Text fw={600} size="sm">
                                  {comment.authorName || 'Anonymous'}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {new Date(comment.createdAt).toLocaleDateString()}
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
                              onClick={() =>
                                setActiveReplyId((prev) =>
                                  prev === comment.id ? null : comment.id
                                )
                              }
                            >
                              {activeReplyId === comment.id ? 'Cancel' : 'Reply'}
                            </Button>
                          </Group>

                          {activeReplyId === comment.id ? (
                            <ReplyForm
                              blogId={data.id}
                              slug={slug}
                              parentId={comment.id}
                              onSuccess={() => setActiveReplyId(null)}
                            />
                          ) : null}

                          {replies.length > 0 ? (
                            <Stack
                              gap="sm"
                              mt="xs"
                              className="pl-5 border-l border-gray-200"
                            >
                              {replies.map((reply) => (
                                <Paper
                                  key={reply.id}
                                  radius="lg"
                                  withBorder
                                  className="p-3 bg-white"
                                >
                                  <Stack gap="xs">
                                    <Group gap="sm">
                                      <Avatar
                                        src={reply.authorImage || undefined}
                                        alt={reply.authorName || 'User'}
                                        radius="xl"
                                        size="xs"
                                      />
                                      <div>
                                        <Text fw={600} size="xs">
                                          {reply.authorName || 'Anonymous'}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {new Date(reply.createdAt).toLocaleDateString()}
                                        </Text>
                                      </div>
                                    </Group>

                                    <Text
                                      size="sm"
                                      c="dark"
                                      className="leading-6 whitespace-pre-wrap"
                                    >
                                      {reply.content}
                                    </Text>
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          ) : null}
                        </Stack>
                      </Paper>
                    )
                  })}
                </Stack>
              ) : (
                <Text c="dimmed" size="sm">
                  No comments yet. Be the first to leave one.
                </Text>
              )}
            </Stack>
          </Card>
        </aside>
      </section>
    </Container>
  )
}