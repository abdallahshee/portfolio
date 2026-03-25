// src/routes/account/register.tsx
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
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
import { ImagePlus, UserPlus } from "lucide-react"

import { uploadImage } from "@/lib/utils"
import { useMemo, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { GithubButton, GoogleButton } from "@/components/Buttons"
import { SignUpSchema, type SignUpRequest } from "@/db/validations/user.types"
import { zod4Resolver } from "mantine-form-zod-resolver"

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
  const [file, setFile] = useState<File | null>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"github" | "google" | null>(
    null
  )

  const form = useForm<SignUpRequest>({
    initialValues: {
      name: "",
      email: "",
      image: null,
      password: "",
      confirmPassword: "",
    },
    validate:zod4Resolver(SignUpSchema),
    validateInputOnBlur:true,
    validateInputOnChange:true

  })
  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const handleSubmit = async (values: SignUpRequest) => {
    try {
      setIsSubmitting(true)
      console.log("1. Starting sign up...")
      let url = ""
      if (file) {
        url = await uploadImage(file)
      } else {
        url = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
      }
      const res = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        image: url,
      })

      console.log("3. Response received:", JSON.stringify(res, null, 2))

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

      console.log("4. No user in response, error:", res?.error)
      notifications.show({
        title: "Registration failed",
        message: res?.error?.message ?? "Account could not be created",
        color: "red",
      })
    } catch (err: any) {
      console.error("5. Exception caught:", err)
      notifications.show({
        title: "Registration failed",
        message: err?.message ?? "Something went wrong",
        color: "red",
      })
    } finally {
      console.log("6. Finally block — setIsSubmitting(false)")
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
        <div className="flex flex-col gap-3">
          <GoogleButton
            radius="xl"
            size="md"
            loading={oauthProvider === "google"}
            onClick={() => handleOAuthSignUp("google")}
          >
            Sign up with Google
          </GoogleButton>
          <GithubButton
            size="md"
            radius="xl"
            loading={oauthProvider === "github"}
            onClick={() => handleOAuthSignUp("github")}
          >
            Sign up with Github
          </GithubButton>
        </div>
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
              onChange={(e) => setFile(e)}
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