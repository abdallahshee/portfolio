import { useForm } from "@mantine/form"
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Github, Globe, Lock, LogIn } from "lucide-react"
import {
  Link,
  createFileRoute,
  useRouter,
  useSearch,
} from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}



// src/routes/account/index.tsx
export const Route = createFileRoute("/account/")({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === "string" ? search.callbackUrl : "/",
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } =Route.useSearch()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"github" | "google" | null>(
    null
  )

  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Please enter a valid email",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  })

  const handleSubmit = async (values: LoginForm) => {
    try {
      setIsSubmitting(true)

      const res = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: callbackUrl,
      })

      if (res?.data?.user) {
        notifications.show({
          title: "Login successful",
          message: "Welcome back 👋",
          color: "green",
        })

        router.navigate({ to: "/projects" })
        return
      }

      notifications.show({
        title: "Login failed",
        message: "Could not sign you in. Please try again.",
        color: "red",
      })
    } catch (err: any) {
      notifications.show({
        title: "Login failed",
        message: err?.message ?? "Invalid email or password",
        color: "red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      setOauthProvider(provider)

      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })
    } catch (err: any) {
      notifications.show({
        title: "OAuth login failed",
        message: err?.message ?? `Could not continue with ${provider}`,
        color: "red",
      })
    } finally {
      setOauthProvider(null)
    }
  }

  return (
    <Paper radius="2xl" p="xl" withBorder className="w-full shadow-lg md:p-8">
      <Stack gap="lg">
        <div className="text-center">
          <Group justify="center" mb="sm">
            <ThemeIcon variant="light" color="indigo" radius="xl" size="xl">
              <LogIn size={20} />
            </ThemeIcon>
          </Group>

          <Title order={2} className="text-3xl">
            Sign In
          </Title>

          <Text c="dimmed" size="sm" mt={6}>
            Welcome back. Sign in to continue.
          </Text>
        </div>

        <Stack gap="sm">
          <Button
            variant="outline"
            color="dark"
            fullWidth
            radius="xl"
            size="md"
            loading={oauthProvider === "github"}
            onClick={() => handleOAuthSignIn("github")}
          >
            <div className="flex items-center justify-center gap-2">
              <Github size={18} />
              <span>Sign in with GitHub</span>
            </div>
          </Button>

          <Button
            variant="outline"
            fullWidth
            radius="xl"
            size="md"
            loading={oauthProvider === "google"}
            onClick={() => handleOAuthSignIn("google")}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span>Sign in with Google</span>
            </div>
          </Button>
        </Stack>

        <Divider label="Or continue with email" labelPosition="center" my="xs" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="you@example.com"
              radius="md"
              size="md"
              {...form.getInputProps("email")}
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              size="md"
              {...form.getInputProps("password")}
              required
            />

            <Button
              type="submit"
              fullWidth
              mt="sm"
              radius="xl"
              size="md"
              loading={isSubmitting}
              leftSection={<LogIn size={18} />}
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Divider my="xs" />

       <Text ta="center" size="sm" c="dimmed">
  Don’t have an account?{" "}
<Link
  to="/account/register"
  search={{ callbackUrl: callbackUrl }}  // ← forward the original callbackUrl
  className="text-blue-600 hover:underline font-medium"
>
  Sign Up
</Link>
</Text>
      </Stack>
    </Paper>
  )
}