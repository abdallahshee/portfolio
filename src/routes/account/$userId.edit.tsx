import { getAuthUserByIdQueryOptions } from '@/db/queries/user.queries'
import { useUserUpdateMutation } from '@/db/mutations/user.mutations'
import { UserUpdateSchema } from '@/db/validations/user.types'
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
import { Camera, Mail, Save, User as ProfileUserIcon } from 'lucide-react'
import z from 'zod'

export const Route = createFileRoute('/account/$userId/edit')({
  loader: async ({ context, params }) => {
    const userId = params.userId
    await context.queryClient.ensureQueryData(
      getAuthUserByIdQueryOptions(userId)
    )
  },
  component: RouteComponent,
})

const ProfileSchema = UserUpdateSchema.omit({ userId: true })
type ProfileValues = z.infer<typeof ProfileSchema>

function RouteComponent() {
  const { userId } = Route.useParams()
  const { data: user } = useSuspenseQuery(
    getAuthUserByIdQueryOptions(userId)
  )

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.user_metadata.avatar_url
  )

  const { mutate, isPending } = useUserUpdateMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ProfileValues>({
    validate: zod4Resolver(ProfileSchema),
    initialValues: {
      name: user.user_metadata.name ?? '',
      email: user.email ?? '',
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

  const handleSubmit = (values: ProfileValues) => {
    setFormError(null)

    mutate(
      { ...values, userId },
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
    <Container size="sm" className="py-12">
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

            <Text c="dimmed" size="sm" mt={6}>
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

            <Text size="xs" c="dimmed">
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

              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                radius="md"
                size="md"
                leftSection={<Mail size={16} />}
                {...form.getInputProps('email')}
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