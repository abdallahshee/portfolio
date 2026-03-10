import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
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
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Github, Globe } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { uploadImage } from '@/lib/utils'

interface SignUpForm {
  name: string
  email: string
  image: File | null
  password: string
  confirmPassword: string
}

export const Route = createFileRoute('/account/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : '/',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: '/account/register' })
  const callbackUrl = search.callbackUrl ?? '/'

  const form = useForm<SignUpForm>({
    initialValues: {
      name: '',
      email: '',
      image: null,
      password: '',
      confirmPassword: '',
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  })
  // Handle email sign up
  const handleSubmit = async (values: SignUpForm) => {
    try {
      let imageUrl = ''
      if (values.image) {
        // Upload image and get URL
        imageUrl = await uploadImage(values.image)
      }

      const defaultUrl =
        'https://www.istockphoto.com/photos/profile-photo-placeholder'

      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: imageUrl || defaultUrl, // Pass uploaded URL or default
        callbackURL: callbackUrl,
      })

      notifications.show({
        title: 'Account created',
        message: 'Your account has been created successfully 🎉',
        color: 'green',
      })
    } catch (err: any) {
      notifications.show({
        title: 'Registration failed',
        message: err?.message ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  // Handle OAuth sign up
  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-md p-6 shadow-md rounded-lg"
        radius="md"
        withBorder
      >
        <Title order={2} className="text-center mb-6">
          Create Account
        </Title>

        {/* OAuth Sign-Up */}
        <Stack gap="sm" className="mb-5">
          <Button
            variant="outline"
            color="dark"
            fullWidth
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
            onClick={() => handleOAuthSignUp('google')}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span>Sign up with Google</span>
            </div>
          </Button>
        </Stack>

        <Divider label="Or create account with email" labelPosition="center" my="md" />

        {/* Sign-Up Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
                 {form.values.image && (
                <Avatar
                  src={URL.createObjectURL(form.values.image)}
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
            {/* Profile Image Upload */}
            <Stack gap="xs">
         
              <FileInput
                placeholder="Upload profile image"
                accept="image/*"
                {...form.getInputProps('image')}
                defaultValue={null}
              />
            </Stack>

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

            <Button type="submit" fullWidth mt="sm">
              Create Account
            </Button>
          </Stack>
        </form>

        {/* Sign-In Link */}
        <Group justify="center" mt="md">
          <Anchor component={Link} to="/account" size="sm">
            Already have an account? Sign In
          </Anchor>
        </Group>
      </Paper>
    </div>
  )
}