import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "@mantine/form"
import {
  Button,
  Card,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Badge,
  ActionIcon,
  Divider,
  Modal,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { FolderPlus, Tag, Trash2, Shapes, Pencil, X, Check } from "lucide-react"
import { useState } from "react"

import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import {
  useCategoryCreateMutations,
  useDeleteCategoryMutation,
  useCategoryEditMutation,
} from "@/db/mutations/category.mutations"
import type {
  CategoryRequest,
  EditCategoryRequest,
} from "@/db/validations/category.types"

export const Route = createFileRoute("/admin/categories")({
  component: RouteComponent,
})

function RouteComponent() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const form = useForm<CategoryRequest>({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Category name is required"
        if (value.trim().length < 2) return "Category name is too short"
        return null
      },
    },
  })

  const { data: categories, isLoading, isError } = useQuery(
    getAllCategoriesQueryOption()
  )

  const createCategoryMutation = useCategoryCreateMutations(() => {
    notifications.show({
      title: "Success",
      message: "Category created successfully",
      color: "green",
    })
    form.reset()
  })

  const deleteCategoryMutation = useDeleteCategoryMutation()
  const editCategoryMutation = useCategoryEditMutation()

  const handleSubmit = async (values: CategoryRequest) => {
    try {
      await createCategoryMutation.mutateAsync({
        name: values.name.trim(),
      })
    } catch (error: any) {
      notifications.show({
        title: "Failed",
        message: error?.message || "Failed to create category",
        color: "red",
      })
    }
  }

  const startEdit = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId)
    setEditingName(currentName)
  }

  const cancelEdit = () => {
    setEditingCategoryId(null)
    setEditingName("")
  }

  const handleEdit = async (payload: EditCategoryRequest) => {
    try {
      await editCategoryMutation.mutateAsync(payload)
      notifications.show({
        title: "Success",
        message: "Category updated successfully",
        color: "green",
      })
      cancelEdit()
    } catch (error: any) {
      notifications.show({
        title: "Failed",
        message: error?.message || "Failed to update category",
        color: "red",
      })
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteCategoryMutation.mutateAsync(deleteTarget.id)
      notifications.show({
        title: "Deleted",
        message: "Category deleted successfully",
        color: "green",
      })
      setDeleteTarget(null)
    } catch (error: any) {
      notifications.show({
        title: "Failed",
        message: error?.message || "Failed to delete category",
        color: "red",
      })
    }
  }

  const isEditingCurrent = (categoryId: string) =>
    editCategoryMutation.isPending && editingCategoryId === categoryId

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="">
        <Stack gap="xl">
          <Paper
            radius="2xl"
            p="xl"
            withBorder
            className="bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={8}>
                <Group gap="xs">
                  <ThemeIcon variant="light" color="violet" radius="xl" size="lg">
                    <Shapes size={18} />
                  </ThemeIcon>
                  <Text fw={600} c="dimmed" size="sm">
                    Admin Category Manager
                  </Text>
                </Group>

                <Title order={1} className="text-3xl md:text-5xl">
                  Manage Categories
                </Title>

                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Create, edit, and delete categories from one place.
                </Text>
              </Stack>

              <Badge variant="light" color="violet" radius="xl" size="lg">
                Admin
              </Badge>
            </Group>
          </Paper>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Stack gap="lg">
                  <div>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon variant="light" color="blue" radius="xl">
                        <FolderPlus size={16} />
                      </ThemeIcon>
                      <Title order={3}>Create Category</Title>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Add a new category that can be used when creating articles.
                    </Text>
                  </div>

                  <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                      <TextInput
                        label="Category Name"
                        placeholder="e.g. Technology"
                        radius="md"
                        size="sm"
                        leftSection={<Tag size={16} />}
                        {...form.getInputProps("name")}
                      />

                      <Button
                        type="submit"
                        radius="md"
                        size="sm"
                        loading={createCategoryMutation.isPending}
                      >
                        Create Category
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Stack gap="lg">
                  <div>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon variant="light" color="teal" radius="xl">
                        <Tag size={16} />
                      </ThemeIcon>
                      <Title order={3}>All Categories</Title>
                    </Group>
                    <Text size="sm" c="dimmed">
                      View and manage all available categories.
                    </Text>
                  </div>

                  <Divider />

                  {isLoading ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <Group gap="sm">
                        <Loader size="sm" />
                        <Text size="sm" c="dimmed">
                          Loading categories...
                        </Text>
                      </Group>
                    </div>
                  ) : isError ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <Text c="red" size="sm">
                        Failed to load categories.
                      </Text>
                    </div>
                  ) : !categories || categories.length === 0 ? (
                    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <Text size="sm" c="dimmed">
                        No categories found yet.
                      </Text>
                    </div>
                  ) : (
                    <Stack gap="sm">
                      {categories.map((category) => {
                        const isEditing = editingCategoryId === category.id

                        return (
                          <Paper
                            key={category.id}
                            withBorder
                            radius="md"
                            p="md"
                            className="transition hover:shadow-sm"
                          >
                            <Group justify="space-between" align="center">
                              <Group gap="sm" className="flex-1">
                                <ThemeIcon variant="light" color="indigo" radius="xl">
                                  <Tag size={16} />
                                </ThemeIcon>

                                <div className="flex-1">
                                  {isEditing ? (
                                    <Stack gap="xs">
                                      <TextInput
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.currentTarget.value)}
                                        placeholder="Enter category name"
                                        radius="md"
                                        size="sm"
                                      />
                                      <Text size="xs" c="dimmed">
                                        ID: {category.id}
                                      </Text>
                                    </Stack>
                                  ) : (
                                    <>
                                      <Text fw={600}>{category.name}</Text>
                                      <Text size="xs" c="dimmed">
                                        ID: {category.id}
                                      </Text>
                                    </>
                                  )}
                                </div>
                              </Group>

                              <Group gap="xs">
                                {isEditing ? (
                                  <>
                                    <ActionIcon
                                      variant="light"
                                      color="green"
                                      radius="md"
                                      size="sm"
                                      loading={isEditingCurrent(category.id)}
                                      onClick={() =>
                                        handleEdit({
                                          categoryId: category.id,
                                          name: editingName.trim(),
                                        })
                                      }
                                      disabled={editingName.trim().length < 2}
                                    >
                                      <Check size={16} />
                                    </ActionIcon>

                                    <ActionIcon
                                      variant="light"
                                      color="gray"
                                      radius="md"
                                      size="sm"
                                      onClick={cancelEdit}
                                    >
                                      <X size={16} />
                                    </ActionIcon>
                                  </>
                                ) : (
                                  <>
                                    <ActionIcon
                                      variant="light"
                                      color="blue"
                                      radius="md"
                                      size="sm"
                                      onClick={() => startEdit(category.id, category.name)}
                                    >
                                      <Pencil size={16} />
                                    </ActionIcon>

                                    <ActionIcon
                                      variant="light"
                                      color="red"
                                      radius="md"
                                      size="sm"
                                      loading={
                                        deleteCategoryMutation.isPending &&
                                        deleteCategoryMutation.variables === category.id
                                      }
                                      onClick={() =>
                                        setDeleteTarget({
                                          id: category.id,
                                          name: category.name,
                                        })
                                      }
                                    >
                                      <Trash2 size={16} />
                                    </ActionIcon>
                                  </>
                                )}
                              </Group>
                            </Group>
                          </Paper>
                        )
                      })}
                    </Stack>
                  )}
                </Stack>
              </Card>
            </div>
          </div>
        </Stack>
      </Container>

      <Modal
        opened={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete category"
        centered
        radius="xl"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete{" "}
            <Text span fw={700}>
              {deleteTarget?.name}
            </Text>
            ? This action cannot be undone.
          </Text>

          <Group justify="flex-end">
            <Button
              variant="default"
              radius="md"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              radius="md"
              size="sm"
              loading={deleteCategoryMutation.isPending}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}