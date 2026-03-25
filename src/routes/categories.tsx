import { createFileRoute } from "@tanstack/react-router"
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Table,
  Text,
  TextInput,
  Title,
  ActionIcon,
  Stack,
  ThemeIcon,
  Divider,
  Box,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { FolderPlus, Trash2, Tag, Hash, LayoutList } from "lucide-react"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { useQuery } from "@tanstack/react-query"
import { useCategoryCreateMutations, useDeleteCategoryMutation } from "@/db/mutations/category.mutations"
import { categorySchema, type categoryRequest } from "@/db/validations/category.types"
import { ProjectSchema } from "@/db/validations/project.types"
import { zod4Resolver } from "mantine-form-zod-resolver"

export const Route = createFileRoute("/categories")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: CategoriesPage,
})

function CategoriesPage() {
  const [opened, { open, close }] = useDisclosure(false)
  const { data: categories } = useQuery(getAllCategoriesQueryOption())
  const createCategoryMutation = useCategoryCreateMutations(() => {
    form.reset()
    close()
  })
  const deleteCategoryMutation = useDeleteCategoryMutation()
  const form = useForm<categoryRequest>({
    initialValues: { name: "" },
    validate: zod4Resolver(categorySchema),
    validateInputOnBlur:true,
    validateInputOnChange:true
  })

  const handleSubmit = (values: categoryRequest) => {
    createCategoryMutation.mutate(values)
  }

  return (
    <Container size="md" className="py-12 space-y-8">

      {/* Page Header */}
      <div className="space-y-4">
        <Group gap="xs">
          <Badge variant="light" color="grape" size="sm" tt="uppercase" fw={700}>
            Admin
          </Badge>
        </Group>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                <LayoutList size={18} />
              </ThemeIcon>
              <Title order={1} fw={700}>
                Blog Categories
              </Title>
            </Group>
            <Text c="dimmed" size="sm" ml={46}>
              Organise your content by managing the categories that blogs are assigned to.
            </Text>
          </div>

          <Button
            leftSection={<FolderPlus size={15} />}
            color="grape"
            radius="xl"
            variant="filled"
            className="flex-shrink-0 self-start"
            onClick={open}
          >
            New Category
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <Group gap="xl">
        <div className="space-y-0.5">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} className="tracking-widest">
            Total
          </Text>
          <Text size="xl" fw={700}>
            {categories?.length ?? 0}
          </Text>
        </div>
        <Divider orientation="vertical" />
        <div className="space-y-0.5">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} className="tracking-widest">
            Status
          </Text>
          <Badge color="green" variant="light" size="md">
            Active
          </Badge>
        </div>
      </Group>

      {/* Table Card */}
      <Card withBorder radius="lg" p={0} className="overflow-hidden">

        {/* Card Header */}
        <Box px="lg" py="md" className="border-b border-gray-100 dark:border-gray-800">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Tag size={15} className="text-grape-500" />
              <Text fw={600} size="sm">
                All Categories
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              {categories?.length ?? 0} {categories?.length === 1 ? "entry" : "entries"}
            </Text>
          </Group>
        </Box>

        {/* Empty State */}
        {categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <ThemeIcon variant="light" color="gray" size={56} radius="xl">
              <Tag size={24} />
            </ThemeIcon>
            <div className="space-y-1">
              <Text fw={500} size="sm">No categories yet</Text>
              <Text size="xs" c="dimmed" className="max-w-xs">
                Create your first category to start organising your blog posts.
              </Text>
            </div>
            <Button
              mt="xs"
              size="xs"
              variant="light"
              color="grape"
              leftSection={<FolderPlus size={13} />}
              onClick={open}
            >
              Create first category
            </Button>
          </div>
        ) : (
          <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 60 }}>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed" className="tracking-widest">
                    #
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed" className="tracking-widest">
                    Name
                  </Text>
                </Table.Th>
                <Table.Th style={{ width: 60 }} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories?.map((cat, index) => (
                <Table.Tr key={cat.id}>
                  <Table.Td>
                    <Group gap={4}>
                      <Hash size={12} className="text-slate-300" />
                      <Text size="xs" c="dimmed" fw={500}>
                        {cat.id}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Badge
                        variant="light"
                        color="grape"
                        radius="md"
                        size="md"
                        leftSection={<Tag size={10} />}
                      >
                        {cat.name}
                      </Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        radius="md"
                        loading={deleteCategoryMutation.isPending}
                        onClick={() => deleteCategoryMutation.mutate(cat.id)}
                      >
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <ThemeIcon variant="light" color="grape" size="sm" radius="md">
              <FolderPlus size={13} />
            </ThemeIcon>
            <Text fw={600} size="sm">New Category</Text>
          </Group>
        }
        centered
        radius="lg"
        size="sm"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" pt="xs">
            <TextInput
              label="Category name"
              description="Use a clear, concise name like React, DevOps, or Career."
              placeholder="e.g. React, TypeScript, Career…"
              radius="md"
              leftSection={<Tag size={14} />}
              {...form.getInputProps("name")}
            />
            <Group justify="flex-end" mt="xs">
              <Button variant="subtle" color="gray" radius="xl" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="grape"
                radius="xl"
                size="sm"
                loading={createCategoryMutation.isPending}
                leftSection={<FolderPlus size={14} />}
              >
                Create Category
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  )
}