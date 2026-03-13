import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  Image,
  Pagination,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Heart, MessageCircle } from 'lucide-react'
import { getPaginatedBlogsQueryOptions } from '@/queries/blog.queries'

export const Route = createFileRoute('/blogs/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      typeof search.page === 'number'
        ? search.page
        : typeof search.page === 'string'
          ? Number(search.page)
          : 1,
  }),
    loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  loader: async ({ context,deps }) => {
    const data=await context.queryClient.fetchQuery(
      getPaginatedBlogsQueryOptions(deps.page,3)
    )
    // const data = await getPaginatedBlogs({
    //   data: {
    //     page: search.page,
    //     limit: 6,
    //   },
    // })

    return data
  },
  component: BlogsPage,
})

function BlogsPage() {
  const navigate = useNavigate()
  const data = Route.useLoaderData()

  const blogs = data.blogs
  const pagination = data.pagination

  return (
    <Container size="xl" className="py-12 space-y-10">
      <div className="space-y-2">
        <Badge variant="light" color="grape">
          Blog
        </Badge>
        <Title order={1}>Articles & Writing</Title>
        <Text c="dimmed" className="max-w-2xl">
          Thoughts, tutorials, and practical notes on building modern web
          applications.
        </Text>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to="/blogs/$slug/details"
            params={{ slug: blog.slug }}
            className="no-underline"
          >
            <Card
              withBorder
              radius="xl"
              shadow="sm"
              className="max-h-[500] overflow-y-auto transition hover:-translate-y-1 hover:shadow-lg "
            >
              <Stack gap="md">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    h={220}
                    radius="lg"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-[220px] rounded-lg bg-gray-100" />
                )}

                <div className="space-y-2">
                  <Title order={4} lineClamp={2}>
                    {blog.title}
                  </Title>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {blog.excerpt}
                  </Text>
                </div>

                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <Avatar
                      src={blog.authorImage || undefined}
                      alt={blog.title}
                      radius="xl"
                      size="sm"
                    />
                    <Text size="xs" c="dimmed">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Text>
                  </Group>

                  <Group gap="md">
                    <Group gap={4}>
                      <Heart size={15} />
                      <Text size="sm">{blog.likes}</Text>
                    </Group>

                    <Group gap={4}>
                      <MessageCircle size={15} />
                      <Text size="sm">{blog.comments}</Text>
                    </Group>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Link>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={pagination.totalPages}
            onChange={(page) =>
              navigate({
                to: '/blogs',
                search: { page },
              })
            }
          />
        </Group>
      )}
    </Container>
  )
}