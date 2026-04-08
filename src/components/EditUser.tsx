
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Avatar,
  Title,
  Text,
  Paper,
  Container,
  Divider,
  Badge,
  Group,
  FileInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useUserUpdateProfileMutation } from '@/db/mutations/user.mutations'
import { useState } from 'react'
import { Camera, User, Mail, Lock, ShieldCheck, Save } from 'lucide-react'
import { notifications } from '@mantine/notifications'
import { UserUpdateSchema, type SupabaseUser } from '@/db/validations/user.types'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import z from 'zod'

// export type TargetUser = {
//   id: string
//   name: string
//   email: string
//   avatar_url: string | null
// }

type EditUserFormProps = {
  userId: string
  targetUser: SupabaseUser | null
  role: 'admin' | 'user'
}

// Infer the form values type directly from the schema (without userId)
type FormValues = z.infer<ReturnType<typeof UserUpdateSchema.omit<{ userId: true }>>>

export function EditUserForm({ userId, targetUser, role }: EditUserFormProps) {
  const isAdmin = role === 'admin'
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    targetUser?.user_metadata.avatar_url ?? null
  )

  const { mutate, isPending } = useUserUpdateProfileMutation()

  const form = useForm<FormValues>({
    validate: zod4Resolver(UserUpdateSchema.omit({ userId: true })),
    initialValues: {
      name: targetUser?.user_metadata.name ?? '',
      email: targetUser?.email ?? '',
      image: targetUser?.user_metadata.avatar_url ?? '',
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

  // ✅ values is typed as FormValues (no userId), userId injected from props
  const handleSubmit = (values: FormValues) => {
    mutate(
      {
        name: values.name,
        image: values.image,
        email: values.email,
        userId, // ✅ injected from props, not from form
      },
      {
        onSuccess: () => {
          notifications.show({
            color: 'green',
            title: 'Success',
            message: isAdmin
              ? 'User updated successfully'
              : 'Your profile has been updated',
          })
        },
        onError: (err) => {
          notifications.show({
            color: 'red',
            title: 'Update failed',
            message: err instanceof Error ? err.message : 'Something went wrong',
          })
        },
      }
    )
  }

  return (
    <Paper radius="2xl" withBorder shadow="sm" p="xl">
      <Stack gap="xl">
        {/* ── Header ── */}
        <Stack gap={4}>
          <Group gap="sm">
            {isAdmin ? (
              <ShieldCheck size={22} className="text-indigo-500" />
            ) : (
              <User size={22} className="text-teal-500" />
            )}
            <Title order={3} className="font-bold">
              {isAdmin ? 'Edit User' : 'My Profile'}
            </Title>
            <Badge
              variant="light"
              color={isAdmin ? 'indigo' : 'teal'}
              radius="xl"
              size="sm"
            >
              {isAdmin ? 'Admin' : 'Account Settings'}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed">
            {isAdmin
              ? `Editing profile for ${targetUser?.user_metadata.name} (${targetUser?.email})`
              : 'Update your personal information and password below.'}
          </Text>
        </Stack>

        <Divider />

        {/* ── Avatar Preview ── */}
        <Stack align="center" gap="sm">
          <div className="relative w-fit">
            <Avatar
              src={avatarPreview}
              size={90}
              radius="xl"
              color={isAdmin ? 'indigo' : 'teal'}
              className="border-2 border-gray-200 dark:border-slate-700"
            >
              {targetUser?.user_metadata.name?.[0]?.toUpperCase()}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow border border-gray-200 dark:border-slate-700">
              <Camera size={13} className="text-gray-500" />
            </div>
          </div>
          <Text size="xs" c="dimmed">
            {avatarPreview ? 'Image selected' : 'No image uploaded'}
          </Text>
        </Stack>

        {/* ── Form ── */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">

            <TextInput
              label="Display Name"
              placeholder="e.g. John Doe"
              leftSection={<User size={16} />}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              leftSection={<Mail size={16} />}
              {...form.getInputProps('email')}
            />

            <FileInput
              label="Profile Image"
              placeholder="Click to upload an image"
              accept="image/*"
              leftSection={<Camera size={16} />}
              onChange={handleImageChange}
              description="JPG, PNG or WEBP. Used as your avatar."
            />

            <Divider label="Change Password" labelPosition="left" />

            <Button
              type="submit"
              loading={isPending}
              radius="xl"
              color={isAdmin ? 'indigo' : 'teal'}
              leftSection={<Save size={16} />}
              fullWidth
            >
              {isAdmin ? 'Update User' : 'Save Changes'}
            </Button>

          </Stack>
        </form>

      </Stack>
    </Paper>
  )
}