import { getAuthUserQueryOptions } from '@/db/queries/user.queries'
import { useUserUpdateProfileMutation } from '@/db/mutations/user.mutations'
import { UserUpdateProfileSchema, type UserUpdateProfileRequest } from '@/db/validations/user.types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  Alert,
  Avatar,
  Button,
  Container,
  Divider,
  FileInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Group,
  ThemeIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Camera, Save, User as ProfileUserIcon } from 'lucide-react'
import { AuthenticatedMiddleware } from '@/server/middleware/auth.middleware'

export const Route = createFileRoute('/account/profile/edit/')({
  server:{
    middleware:[AuthenticatedMiddleware]
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getAuthUserQueryOptions()
    )
  },
  component: RouteComponent,
})



function RouteComponent() {
  const { data: user } = useSuspenseQuery(
    getAuthUserQueryOptions()
  )

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.user_metadata.avatar_url
  )

  const { mutate, isPending } = useUserUpdateProfileMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<UserUpdateProfileRequest>({
    validate: zod4Resolver(UserUpdateProfileSchema),
    initialValues: {
      name: user.user_metadata.name ?? '',
      image: user.user_metadata.avatar_url ?? '',
    },
  })

  const handleImageChange = (file: File | null) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      form.setFieldValue('image', result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (values: UserUpdateProfileRequest) => {
    setFormError(null)

    mutate(
      { ...values },
      {
        onSuccess: () =>
          notifications.show({
            color: 'teal',
            title: 'Profile updated',
            message: 'Your profile has been updated successfully.',
          }),
        onError: (err) =>
          setFormError(
            err instanceof Error ? err.message : 'Something went wrong'
          ),
      }
    )
  }

  return (
    <Container size="sm" >
      <Paper radius="2xl" p="xl" withBorder className="shadow-lg md:p-8">
        <Stack gap="lg">
          {/* Header (matches register page style) */}
          <div className="text-center">
            <Group justify="center" mb="sm">
              <ThemeIcon variant="light" color="teal" radius="xl" size="xl">
                <ProfileUserIcon size={20} />
              </ThemeIcon>
            </Group>

            <Title order={2} className="heading">Edit Profile</Title>

            <Text c="dimmed" size="md" mt={6}>
              Update your personal information and profile picture.
            </Text>
          </div>

          <Divider />

          {/* Avatar section */}
          <Stack align="center" gap="xs">
            <div className="relative w-fit">
              <Avatar
                src={avatarPreview}
                size={90}
                radius="xl"
                color="teal"
                className="border-2 border-slate-200 dark:border-slate-700"
              >
                {user.user_metadata.name?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>

              <div className="absolute -bottom-1 -right-1 rounded-full border border-slate-200 bg-white p-1 shadow dark:border-slate-700 dark:bg-slate-800">
                <Camera size={12} className="text-slate-500" />
              </div>
            </div>

            <Text size="md" c="dimmed">
              {avatarPreview ? 'Image ready to save' : 'No image uploaded'}
            </Text>
          </Stack>

          {/* Error */}
          {formError && (
            <Alert color="red" radius="md" title="Update failed">
              {formError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Display Name"
                placeholder="John Doe"
                radius="md"
                size="md"
                leftSection={<ProfileUserIcon size={16} />}
                {...form.getInputProps('name')}
              />


              <FileInput
                label="Profile Picture"
                placeholder="Upload image"
                radius="md"
                size="md"
                accept="image/*"
                leftSection={<Camera size={16} />}
                onChange={handleImageChange}
                description="JPG, PNG or WEBP"
              />

              <Button
                type="submit"
                fullWidth
                mt="sm"
                radius="xl"
                size="md"
                loading={isPending}
                leftSection={<Save size={18} />}
              >
                Save Changes
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  )
}