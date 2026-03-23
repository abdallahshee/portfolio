import { useForm } from "@mantine/form"
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Github, Globe, LogIn } from "lucide-react"
import {
  Link,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { GoogleButton } from "@/components/GoogleButton"
import { GithubButton } from "@/components/GIthubButton"

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export const Route = createFileRoute("/account/")({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === "string" ? search.callbackUrl : "/",
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = Route.useSearch()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"github" | "google" | null>(null)

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

      if (res?.data?.user ) {
        notifications.show({
          title: "Login successful",
          message: "Welcome back 👋",
          color: "green",
        })
        router.navigate({ to: callbackUrl })
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
      await authClient.signIn.social({ provider, callbackURL: callbackUrl })
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

        {/* Header */}
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
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" loading={oauthProvider === "google"} onClick={() => handleOAuthSignIn("google")}>Sign in with Google</GoogleButton>
          <GithubButton radius="xl" loading={oauthProvider === "github"} onClick={() => handleOAuthSignIn("github")}>
            Sign in with Github
          </GithubButton>
        </Group>
   

        <Divider label="Or continue with email" labelPosition="center" my="xs" />

        {/* Email form */}
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

            {/* Password + Forgot + Remember me row */}
            <div>
              <PasswordInput
                label="Password"
                placeholder="Your password"
                radius="md"
                size="md"
                {...form.getInputProps("password")}
                required
              />

              <Group justify="space-between" mt="xs">
                <Checkbox
                  label="Remember me"
                  size="sm"
                  {...form.getInputProps("rememberMe", { type: "checkbox" })}
                />
                <Link
                  to="/account/forgot-password"
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Forgot password?
                </Link>
              </Group>
            </div>

            {/* Remember me */}


            <Button
              type="submit"
              fullWidth
              mt="xs"
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

        <Text ta="center" size="md" c="dimmed">
          Don't have an account?{" "}
          <Link
            to="/account/register"
            search={{ callbackUrl }}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign Up
          </Link>
        </Text>

      </Stack>
    </Paper>
  )
}