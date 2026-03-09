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
  Checkbox
} from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { Github, Globe } from 'lucide-react'
import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export const Route = createFileRoute('/account/')({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl:
      typeof search.callbackUrl === 'string' ? search.callbackUrl : '/',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = useSearch({ from: '/account/' })

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const handleSubmit = async (values: LoginForm) => {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: callbackUrl,
      })

      notifications.show({
        title: 'Login successful',
        message: 'Welcome back 👋',
        color: 'green',
      })
    } catch (error: any) {
      notifications.show({
        title: 'Login failed',
        message: error?.message ?? 'Invalid email or password',
        color: 'red',
      })
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
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
        <Title order={2} className="text-center mb-4">
          Sign In
        </Title>

        {/* OAuth Buttons */}
        <Stack gap="sm" className="mb-4">
          <Button
            variant="outline"
            color="dark"
            fullWidth
            onClick={() => handleOAuthSignIn('github')}
          >
            <div className="flex items-center justify-center gap-2">
              <Github size={18} />
              <span>Sign in with GitHub</span>
            </div>
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => handleOAuthSignIn('google')}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span>Sign in with Google</span>
            </div>
          </Button>
        </Stack>

        <Divider label="Or continue with email" labelPosition="center" my="md" />

        {/* Email / Password Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...form.getInputProps('email')}
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              required
            />

            <Checkbox
              label="Remember me"
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />

            <Button type="submit" fullWidth mt="sm">
              Sign In
            </Button>
          </Stack>
        </form>

        {/* Links */}
        <Group justify="apart" mt="md">
          <Anchor component={Link} to="/account/register" size="sm">
            Don’t have an account? Sign Up
          </Anchor>

          <Anchor component={Link} to="/account/forgot-password" size="sm">
            Forgot Password?
          </Anchor>
        </Group>
      </Paper>
    </div>
  )
}