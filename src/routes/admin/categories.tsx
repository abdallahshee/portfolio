import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
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
import {
  CategorySchema,
  type CategoryRequest,
  type EditCategoryRequest,
} from "@/db/validations/category.types"
import { zod4Resolver } from "mantine-form-zod-resolver"

export const Route = createFileRoute("/admin/categories")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      getAllCategoriesQueryOption()
    )
  },
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
    validate: zod4Resolver(CategorySchema)
  })

const { data: categories } = useSuspenseQuery(
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
<Stack gap="sm">
  {categories.length === 0 ? (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <Text size="sm" c="dimmed">
        No categories found yet.
      </Text>
    </div>
  ) : (
    categories.map((category) => {
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
    })
  )}
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