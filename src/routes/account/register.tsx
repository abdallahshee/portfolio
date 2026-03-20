// src/routes/account/register.tsx
import { createFileRoute, Link, useRouter, useSearch } from "@tanstack/react-router"
import { useForm } from "@mantine/form"
import {
  Anchor,
  Avatar,
  Button,
  Divider,
  FileInput,
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
import { Github, Globe, ImagePlus, UserPlus } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { uploadImage } from "@/lib/utils"
import { useMemo, useState } from "react"
import { GoogleButton } from "@/components/GoogleButton"
import { GithubButton } from "@/components/GIthubButton"

interface SignUpForm {
  name: string
  email: string
  image: File | null
  password: string
  confirmPassword: string
}

export const Route = createFileRoute("/account/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    callbackUrl:
      typeof search.callbackUrl === "string" ? search.callbackUrl : "/projects",
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { callbackUrl } = Route.useSearch()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"github" | "google" | null>(
    null
  )

  const form = useForm<SignUpForm>({
    initialValues: {
      name: "",
      email: "",
      image: null,
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name must be at least 2 characters" : null,
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Please enter a valid email address",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  })

  const handleSubmit = async (values: SignUpForm) => {
    try {
      setIsSubmitting(true)

      let imageUrl = ""
      if (values.image) {
        imageUrl = await uploadImage(values.image)
      }

      const defaultUrl =
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"

      const res = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        image: imageUrl || defaultUrl,
      })

      if (res?.data?.user) {
        notifications.show({
          title: "Account created",
          message: "Your account has been created successfully 🎉",
          color: "green",
        })

        router.navigate({
          to: "/account",
          search: { callbackUrl },
        })
        return
      }

      notifications.show({
        title: "Registration failed",
        message: "Account could not be created",
        color: "red",
      })
    } catch (err: any) {
      notifications.show({
        title: "Registration failed",
        message: err?.message ?? "Something went wrong",
        color: "red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignUp = async (provider: "github" | "google") => {
    try {
      setOauthProvider(provider)

      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })
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

  const previewUrl = useMemo(() => {
    if (!form.values.image) return null
    return URL.createObjectURL(form.values.image)
  }, [form.values.image])

  return (
    <Paper radius="2xl" p="xl" withBorder className="w-full shadow-lg md:p-8">
      <Stack gap="lg">
        <div className="text-center">
          <Group justify="center" mb="sm">
            <ThemeIcon variant="light" color="indigo" radius="xl" size="xl">
              <UserPlus size={20} />
            </ThemeIcon>
          </Group>

          <Title order={2} className="text-3xl">
            Create Account
          </Title>

          <Text c="dimmed" size="sm" mt={6}>
            Join and start exploring projects and blogs.
          </Text>
        </div>
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" loading={oauthProvider === "google"} onClick={() => handleOAuthSignUp("google")}>Sign up with Google</GoogleButton>
          <GithubButton radius="xl" loading={oauthProvider === "github"} onClick={() => handleOAuthSignUp("github")}>
            Sign up with Github
          </GithubButton>
        </Group>
        <Divider label="Or create account with email" labelPosition="center" my="xs" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {previewUrl && (
              <div className="flex justify-center">
                <Avatar
                  src={previewUrl}
                  alt="Profile Preview"
                  size={96}
                  radius="xl"
                  className="border border-slate-200 shadow-sm"
                />
              </div>
            )}

            <TextInput
              label="Full Name"
              placeholder="John Doe"
              radius="md"
              size="md"
              {...form.getInputProps("name")}
              required
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              radius="md"
              size="md"
              {...form.getInputProps("email")}
              required
            />

            <FileInput
              label="Profile Image"
              placeholder="Upload profile image"
              radius="md"
              size="md"
              leftSection={<ImagePlus size={16} />}
              accept="image/*"
              {...form.getInputProps("image")}
              clearable
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password"
              radius="md"
              size="md"
              {...form.getInputProps("password")}
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat password"
              radius="md"
              size="md"
              {...form.getInputProps("confirmPassword")}
              required
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