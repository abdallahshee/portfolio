import { useForm } from "@mantine/form"
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { AlertCircle, LogIn } from "lucide-react"
import {
  Link,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router"

import { useState } from "react"
import { SignInSchema, type SignInRequest } from "@/db/validations/user.types"
import { FacebookButton, GoogleButton } from "@/components/Buttons"
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

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
  const [oauthProvider, setOauthProvider] = useState<"facebook" | "google" | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

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

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        setFormError(error.message)
        return
      }

      if (!values.rememberMe) {
        await supabase.auth.updateUser({
          data: { session_expiry: 'browser' }
        })
      }

      await router.navigate({ to: redirectTo })
      return data

    } catch (err: any) {
      setFormError(err?.message ?? "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    try {
      setOauthProvider(provider)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        },
      })
      if (error) throw error
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
    <Stack gap="lg">

      {/* Page title */}
      <div className="text-center">
        <Text fw={500} size="lg" className="text-slate-800 dark:text-slate-100">
          Sign in
        </Text>
        <Text c="dimmed" size="sm" mt={4}>
          Welcome back. Enter your details to continue.
        </Text>
      </div>

      {/* OAuth buttons */}
      <div className="flex flex-col gap-3">
        <GoogleButton
          radius="md"
          size="sm"
          loading={oauthProvider === "google"}
          onClick={() => handleOAuthSignIn("google")}
        >
          Continue with Google
        </GoogleButton>
        <FacebookButton
          size="sm"
          radius="md"
          loading={oauthProvider === "facebook"}
          onClick={() => handleOAuthSignIn("facebook")}
        >
          Continue with Facebook
        </FacebookButton>
      </div>

      {/* Error alert */}
      {formError && (
        <Alert
          color="red"
          radius="md"
          icon={<AlertCircle size={16} />}
          title="Sign in failed"
          withCloseButton
          onClose={() => setFormError(null)}
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
            size="sm"
            {...form.getInputProps("email")}

          />

          <div>
            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              size="sm"
              {...form.getInputProps("password")}

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
            radius="md"
            size="sm"
            loading={isSubmitting}
            leftSection={<LogIn size={16} />}
          >
            Sign in
          </Button>
        </Stack>
      </form>

      <Divider />

      <Text ta="center" size="sm" c="dimmed">
        Don't have an account?{" "}
        <Link
          to="/account/register"
          search={{ callbackUrl }}
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Sign up
        </Link>
      </Text>

    </Stack>
  )
}