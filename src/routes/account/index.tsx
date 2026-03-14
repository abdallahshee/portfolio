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
  Switch,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Github, Globe } from 'lucide-react'
import {
  Link,
  createFileRoute,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export const Route = createFileRoute('/account/')({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : '/',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = useSearch({ from: '/account/' })
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<'github' | 'google' | null>(null)

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email',
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
    },
  })

  const handleSubmit = async (values: LoginForm) => {
    try {
      setIsSubmitting(true)

      const res = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL:callbackUrl
      })

      if (res?.data?.user) {
        notifications.show({
          title: 'Login successful',
          message: 'Welcome back 👋',
          color: 'green',
        })

        router.navigate({ to: '/projects' })
        return
      }

      notifications.show({
        title: 'Login failed',
        message: 'Could not sign you in. Please try again.',
        color: 'red',
      })
    } catch (err: any) {
      notifications.show({
        title: 'Login failed',
        message: err?.message ?? 'Invalid email or password',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setOauthProvider(provider)

      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })
    } catch (err: any) {
      notifications.show({
        title: 'OAuth login failed',
        message: err?.message ?? `Could not continue with ${provider}`,
        color: 'red',
      })
    } finally {
      setOauthProvider(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-xl p-6 shadow-md rounded-lg"
        radius="md"
        withBorder
      >
        <Stack gap="xs" className="mb-4">
          <Title order={2} ta="center">
            Sign In
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            Welcome back. Sign in to continue.
          </Text>
        </Stack>

        {/* OAuth Buttons */}
        <Stack gap="sm" className="mb-4">
          <Button
            variant="outline"
            color="dark"
            fullWidth
            loading={oauthProvider === 'github'}
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
            loading={oauthProvider === 'google'}
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

            <Switch
              label="Remember Me"
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />

            <Button type="submit" fullWidth mt="sm" loading={isSubmitting}>
              Sign In
            </Button>
          </Stack>
        </form>

        {/* Links */}
        <Group justify="apart" mt="md">
          <Anchor
            component={Link}
            to="/account/register"
            // search={{ callbackUrl }}
            size="sm"
          >
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