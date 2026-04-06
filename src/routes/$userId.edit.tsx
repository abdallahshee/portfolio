import { getAuthUserByIdQueryOptions } from '@/db/queries/user.queries'
import { useUserUpdateMutation } from '@/db/mutations/user.mutations'
import { UserUpdateSchema } from '@/db/validations/user.types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
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
  Badge,
  Group,
  ThemeIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Camera, Mail, Save, User as ProfileUserIcon } from 'lucide-react'
import z from 'zod'

export const Route = createFileRoute('/$userId/edit')({
  loader: async ({ context, params }) => {
    const userId = params.userId
    await context.queryClient.ensureQueryData(getAuthUserByIdQueryOptions(userId))
  },
  pendingComponent: () => (
    <Container size="sm" className="py-10">
      <Stack gap="lg">
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </Stack>
    </Container>
  ),
  component: RouteComponent,
})

const ProfileSchema = UserUpdateSchema.omit({ userId: true })
type ProfileValues = z.infer<typeof ProfileSchema>

function RouteComponent() {
  const { userId } = Route.useParams()
  const { data: user } = useSuspenseQuery(getAuthUserByIdQueryOptions(userId))

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.user_metadata.avatar_url
  )

  const { mutate, isPending } = useUserUpdateMutation()

  const form = useForm<ProfileValues>({
    validate: zod4Resolver(ProfileSchema),
    initialValues: {
      name: user.user_metadata.name?? '',
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
    mutate(
      { ...values, userId },
      {
        onSuccess: () =>
          notifications.show({
            color: 'teal',
            title: 'Profile updated',
            message: 'Your name, email and avatar have been saved.',
          }),
        onError: (err) =>
          notifications.show({
            color: 'red',
            title: 'Update failed',
            message: err instanceof Error ? err.message : 'Something went wrong',
          }),
      }
    )
  }

  return (
    <Container size="sm" className="py-10">
      <Stack gap="xl">
        <div>
          <Title order={2} className="text-2xl font-bold">
            My Profile
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Update your profile information below.
          </Text>
        </div>

        <Paper radius="2xl" withBorder shadow="sm" p="xl">
          <Stack gap="lg">
            <Group gap="sm">
              <ThemeIcon variant="light" color="teal" radius="xl" size="lg">
                <ProfileUserIcon size={18} />
              </ThemeIcon>

              <div>
                <Title order={4}>Profile Information</Title>
                <Text size="xs" c="dimmed">
                  Update your name, email and profile picture.
                </Text>
              </div>

              <Badge variant="light" color="teal" radius="xl" ml="auto">
                Profile
              </Badge>
            </Group>

            <Divider />

            <Stack align="center" gap="xs">
              <div className="relative w-fit">
                <Avatar
                  src={avatarPreview}
                  size={80}
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

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Display Name"
                  placeholder="e.g. John Doe"
                  leftSection={<ProfileUserIcon size={15} />}
                  {...form.getInputProps('name')}
                />

                <TextInput
                  label="Email Address"
                  placeholder="you@example.com"
                  leftSection={<Mail size={15} />}
                  {...form.getInputProps('email')}
                />

                <FileInput
                  label="Profile Picture"
                  placeholder="Click to upload"
                  accept="image/*"
                  leftSection={<Camera size={15} />}
                  onChange={handleImageChange}
                  description="JPG, PNG or WEBP. Used as your avatar."
                />

                <Button
                  type="submit"
                  loading={isPending}
                  color="teal"
                  radius="xl"
                  leftSection={<Save size={15} />}
                  fullWidth
                  mt="xs"
                >
                  Save Profile
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}