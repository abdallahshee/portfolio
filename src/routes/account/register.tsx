// src/routes/account/register.tsx
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useForm } from "@mantine/form"
import {
  Alert,
  Anchor,
  Button,
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
import { AlertCircle, UserPlus } from "lucide-react"
import { useState } from "react"
import { FacebookButton, GoogleButton } from "@/components/Buttons"
import { SignUpSchema, type SignUpRequest } from "@/db/validations/user.types"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"


export const Route = createFileRoute("/account/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl:
      typeof search.callbackUrl === "string" ? search.callbackUrl : "/projects",
  }),
  component: RouteComponent,
})

// ✅ default avatar public URL from your avatars bucket
const DEFAULT_AVATAR_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/default/avatar.png`

function RouteComponent() {
  const { callbackUrl } = Route.useSearch()
  const router = useRouter()
  const client = getSupabaseBrowserClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"facebook" | "google" | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<SignUpRequest>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      image: DEFAULT_AVATAR_URL, // ✅ set default avatar as initial value
      confirmPassword: "",
    },
    validate: zod4Resolver(SignUpSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: SignUpRequest) => {
    setFormError(null)
    try {
      setIsSubmitting(true)

      const { data, error } = await client.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            name: values.name,
            avatar_url: DEFAULT_AVATAR_URL, // ✅ always use default on signup
            role: "user"
          },
        },
      })

      if (error) {
        setFormError(error.message)
        return
      }

      if (data.user && !data.session) {
        // ✅ email confirmation required
        notifications.show({
          title: "Almost there!",
          message: "Check your email and click the confirmation link to activate your account.",
          color: "blue",
          autoClose: false,
        })
        await router.navigate({
          to: "/account",
          search: { callbackUrl },
        })
        return
      }

      if (data.user && data.session) {
        notifications.show({
          title: "Account created",
          message: "Your account has been created successfully 🎉",
          color: "green",
        })
        await router.navigate({
          to: "/account",
          search: { callbackUrl },
        })
      }

    } catch (err: any) {
      setFormError(err?.message ?? "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google"|"facebook") => {
    try {
      setOauthProvider(provider)
      const { error } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${callbackUrl}`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      notifications.show({
        title: "OAuth sign up failed",
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
              <UserPlus size={20} />
            </ThemeIcon>
          </Group>
          <Title order={2} className="heading">Create Account</Title>
          <Text c="dimmed" size="sm" mt={6}>
            Join and start exploring projects and blogs.
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <GoogleButton
            radius="xl"
            size="md"
            loading={oauthProvider === "google"}
            onClick={() => handleOAuthSignUp("google")}
          >
            Sign up with Google
          </GoogleButton>
          <FacebookButton
            size="md"
            radius="xl"
            loading={oauthProvider === "facebook"}
            onClick={() => handleOAuthSignUp("facebook")}
          >
            Sign up with Facebook
          </FacebookButton>
        </div>

        <Divider label="Or create account with email" labelPosition="center" my="xs" />

        {formError && (
          <Alert
            color="red"
            radius="md"
            icon={<AlertCircle size={24} />}
            title="Sign up failed"
            withCloseButton
            onClose={() => setFormError(null)}
          >
            {formError}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              placeholder="John Doe"
              radius="md"
              size="md"
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              radius="md"
              size="md"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password"
              radius="md"
              size="md"
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat password"
              radius="md"
              size="md"
              {...form.getInputProps("confirmPassword")}
            />

            <Button
              type="submit"
              fullWidth
              mt="sm"
              radius="xl"
              size="md"
              loading={isSubmitting}
              leftSection={<UserPlus size={18} />}
            >
              Create Account
            </Button>
          </Stack>
        </form>

        <Divider my="xs" />

        <Text ta="center" size="md" c="dimmed">
          Already have an account?{" "}
          <Anchor component={Link} to="/account">
            Sign In
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  )
}