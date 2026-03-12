import { createFileRoute, Link, useRouter, useSearch } from '@tanstack/react-router'
import { useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Divider,
  Group,
  Anchor,
  Stack,
  FileInput,
  Avatar,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Github, Globe, ImagePlus } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { uploadImage } from '@/lib/utils'
import { useState } from 'react'

interface SignUpForm {
  name: string
  email: string
  image: File | null
  password: string
  confirmPassword: string
}

export const Route = createFileRoute('/account/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : '/projects',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = useSearch({ from: '/account/register' })
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<'github' | 'google' | null>(null)

  const form = useForm<SignUpForm>({
    initialValues: {
      name: '',
      email: '',
      image: null,
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email address',
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  })

  const handleSubmit = async (values: SignUpForm) => {
    try {
      setIsSubmitting(true)

      let imageUrl = ''
      if (values.image) {
        imageUrl = await uploadImage(values.image)
      }

      const defaultUrl =
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'

      const res = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        image: imageUrl || defaultUrl,
      })

      if (res?.data?.user) {
        notifications.show({
          title: 'Account created',
          message: 'Your account has been created successfully 🎉',
          color: 'green',
        })

        router.navigate({
          to: '/account',
          search: {
            callbackUrl,
          },
        })
        return
      }

      notifications.show({
        title: 'Registration failed',
        message: 'Account could not be created',
        color: 'red',
      })
    } catch (err: any) {
      notifications.show({
        title: 'Registration failed',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    try {
      setOauthProvider(provider)

      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })
    } catch (err: any) {
      notifications.show({
        title: 'OAuth sign up failed',
        message: err?.message ?? `Could not continue with ${provider}`,
        color: 'red',
      })
    } finally {
      setOauthProvider(null)
    }
  }

  const previewUrl = form.values.image
    ? URL.createObjectURL(form.values.image)
    : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-xl rounded-xl p-6 shadow-md"
        radius="md"
        withBorder
      >
        <Stack gap="xs" className="mb-6">
          <Title order={2} ta="center">
            Create Account
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            Join and start exploring projects and blogs
          </Text>
        </Stack>

        <Stack gap="sm" className="mb-5">
          <Button
            variant="outline"
            color="dark"
            fullWidth
            loading={oauthProvider === 'github'}
            onClick={() => handleOAuthSignUp('github')}
          >
            <div className="flex items-center justify-center gap-2">
              <Github size={18} />
              <span>Sign up with GitHub</span>
            </div>
          </Button>

          <Button
            variant="outline"
            color="gray"
            fullWidth
            loading={oauthProvider === 'google'}
            onClick={() => handleOAuthSignUp('google')}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span>Sign up with Google</span>
            </div>
          </Button>
        </Stack>

        <Divider label="Or create account with email" labelPosition="center" my="md" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            {previewUrl && (
              <Avatar
                src={previewUrl}
                alt="Profile Preview"
                size={100}
                radius="xl"
                className="mx-auto"
              />
            )}

            <TextInput
              label="Full Name"
              placeholder="John Doe"
              {...form.getInputProps('name')}
              required
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...form.getInputProps('email')}
              required
            />

            <FileInput
              label="Profile Image"
              placeholder="Upload profile image"
              leftSection={<ImagePlus size={16} />}
              accept="image/*"
              {...form.getInputProps('image')}
              clearable
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password"
              {...form.getInputProps('password')}
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat password"
              {...form.getInputProps('confirmPassword')}
              required
            />

            <Button type="submit" fullWidth mt="sm" loading={isSubmitting}>
              Create Account
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt="md">
          <Anchor
            component={Link}
            to="/account"
            // search={{ callbackUrl }}
            size="sm"
          >
            Already have an account? Sign In
          </Anchor>
        </Group>
      </Paper>
    </div>
  )
}