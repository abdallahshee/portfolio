import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Alert, Button, Divider, Group, Paper, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, CheckCircle, KeyRound, Mail } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/account/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false) // ✅ track success state
  const supabase = getSupabaseBrowserClient()

  const form = useForm<{ email: string }>({
    initialValues: { email: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email address',
    },
    validateInputOnBlur: true,
  })

  const handleSendResetUrl = async (values: { email: string }) => {
    setFormError(null)
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      })

      if (error) {
        setFormError(error.message)
        return
      }

      setEmailSent(true) // ✅ show success screen
    } catch (err: any) {
      setFormError(err?.message ?? "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Paper radius="2xl" p="xl" withBorder className="w-full shadow-lg md:p-8">
      <Stack gap="lg">

        {/* Header */}
        <div className="text-center">
          <Group justify="center" mb="sm">
            <ThemeIcon variant="light" color="indigo" radius="xl" size="xl">
              <KeyRound size={20} />
            </ThemeIcon>
          </Group>
          <Title order={2} className="text-3xl">Reset Password</Title>
          <Text c="dimmed" size="sm" mt={6}>
            Enter your registered email and we'll send you a reset link.
          </Text>
        </div>

        <Divider my="xs" />

        {/* ✅ success state — shown after email is sent */}
        {emailSent ? (
          <Stack gap="md" align="center" py="md">
            <ThemeIcon variant="light" color="green" radius="xl" size={64}>
              <CheckCircle size={32} />
            </ThemeIcon>
            <Title order={3} ta="center">Check your inbox</Title>
            <Text c="dimmed" size="sm" ta="center" maw={340}>
              We sent a password reset link to{" "}
              <strong>{form.values.email}</strong>.
              Check your email and click the link to reset your password.
            </Text>
            <Text c="dimmed" size="xs" ta="center">
              Didn't receive it? Check your spam folder or{" "}
              <button
                type="button"
                className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
                onClick={() => {
                  setEmailSent(false)
                  form.reset()
                }}
              >
                try again
              </button>
            </Text>
          </Stack>
        ) : (
          <>
            {/* Error alert */}
            {formError && (
              <Alert
                color="red"
                radius="md"
                icon={<AlertCircle size={24} />}
                title="Request failed"
                withCloseButton
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSendResetUrl)}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  radius="md"
                  size="md"
                  leftSection={<Mail size={16} />}
                  {...form.getInputProps("email")}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xs"
                  radius="xl"
                  size="md"
                  loading={isSubmitting}
                  leftSection={<KeyRound size={18} />}
                >
                  Send Reset Link
                </Button>
              </Stack>
            </form>
          </>
        )}

        <Divider my="xs" />

        <Text ta="center" size="md" c="dimmed">
          I know my password{" "}
          <Link
            to="/account"
            search={{ callbackUrl: "/" }}
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Back to Sign In
          </Link>
        </Text>

      </Stack>
    </Paper>
  )
}