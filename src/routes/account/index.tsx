import { useForm } from "@mantine/form"
import {
  Alert,
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
import { AlertCircle, LogIn } from "lucide-react"
import {
  Link,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { SignInSchema, type SignInRequest } from "@/db/validations/user.types"
import { GithubButton, GoogleButton } from "@/components/Buttons"
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { getAuthError } from "@/lib/utils"

export const Route = createFileRoute("/account/")({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl: typeof search.callbackUrl === "string" ? search.callbackUrl : "/",
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = Route.useSearch()
  const router = useRouter()
  const redirectTo = callbackUrl === "/" ? "/projects" : callbackUrl
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"github" | "google" | null>(null)
  const [formError, setFormError] = useState<string | null>(null) // ← new

  const form = useForm<SignInRequest>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: zod4Resolver(SignInSchema),
    validateInputOnBlur: true,
  })


  const handleSubmit = async (values: SignInRequest) => {
    setFormError(null)
    try {
      setIsSubmitting(true)

      const res = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: redirectTo,
      })

      if (res?.data?.user) {
        notifications.show({
          title: "Login successful",
          message: "Welcome back 👋",
          color: "green",
        })
        router.navigate({ to: redirectTo })
        return
      }

      const code = res?.error?.code
      const message = getAuthError(code, res?.error?.message)
      setFormError(message)

    } catch (err: any) {
      const code = err?.code
      const message = getAuthError(code, err?.code.message)
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      setOauthProvider(provider)
      await authClient.signIn.social({ provider, callbackURL: redirectTo })
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
          <Title order={2} className="text-3xl">Sign In</Title>
          <Text c="dimmed" size="sm" mt={6}>
            Welcome back. Sign in to continue.
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <GoogleButton
            radius="xl"
            size="md"
            loading={oauthProvider === "google"}
            onClick={() => handleOAuthSignIn("google")}
          >
            Sign in with Google
          </GoogleButton>
          <GithubButton
            size="md"
            radius="xl"
            loading={oauthProvider === "github"}
            onClick={() => handleOAuthSignIn("github")}
          >
            Sign in with Github
          </GithubButton>
        </div>

        <Divider label="Or continue with email" labelPosition="center" my="xs" />

        {/* ← Error alert shown above the form fields */}
        {formError && (
          <Alert
            color="red"
            radius="md"
            icon={<AlertCircle size={24} />}
            title="Sign in failed"
            withCloseButton
            onClose={() => setFormError(null)} // ← allow user to dismiss it
          >
            {formError}
          </Alert>
        )}

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