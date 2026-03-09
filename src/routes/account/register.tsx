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
  Stack
} from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { Github, Globe } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const Route = createFileRoute('/account/register')({
    validateSearch: (search: Record<string, unknown>) => {
    return {
      callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : '/',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const search = useSearch({ from: '/account/register' })
  const callbackUrl = search.callbackUrl ?? '/'

  const form = useForm<SignUpForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    }
  })

  const handleSubmit = async (values: SignUpForm) => {
    try {

      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: callbackUrl
      })

      notifications.show({
        title: 'Account created',
        message: 'Your account has been created successfully 🎉',
        color: 'green'
      })

    } catch (err: any) {

      notifications.show({
        title: 'Registration failed',
        message: err?.message ?? 'Something went wrong',
        color: 'red'
      })

    }
  }

  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-md p-6 shadow-md rounded-lg"
        radius="md"
        withBorder
      >
        <Title order={2} className="text-center mb-4">
          Create Account
        </Title>

        {/* OAuth Buttons */}
        <Stack gap="sm" className="mb-4">

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

        <Divider
          label="Or create account with email"
          labelPosition="center"
          my="md"
        />

        {/* Sign Up Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">

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

        {/* Sign In Link */}
        <Group justify="center" mt="md">
          <Anchor component={Link} to="/account" size="sm">
            Already have an account? Sign In
          </Anchor>
        </Group>
      </Paper>
    </div>
  )
}