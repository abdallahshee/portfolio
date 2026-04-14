import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Alert, Button, Divider, Stack, Text, TextInput, ThemeIcon } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, CheckCircle, KeyRound, Mail } from 'lucide-react'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/account/forgot-password')({
  component: RouteComponent,
})
const EmailSchema=z.object({
    email: z.string().regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address"
    ),
})

type EmailRequest=z.infer<typeof EmailSchema>

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false) // ✅ track success state
  const supabase = getSupabaseBrowserClient()

  const form = useForm<EmailRequest>({
    initialValues: { email: "" },
    validate:zod4Resolver( EmailSchema),
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

    <Stack gap="lg">
      <div className="text-center">
        <Text fw={500} size="lg" className="text-slate-800 dark:text-slate-100">
          Reset Password
        </Text>
        <Text c="dimmed" size="sm" mt={4}>
          Enter your registered email and we'll send you a reset link.
        </Text>
      </div>


      {/* <Divider my="xs" /> */}

      {/* ✅ success state — shown after email is sent */}
      {emailSent ? (
        <Stack gap="md" align="center" py="md">
          <ThemeIcon variant="light" color="green" radius="md" size={64}>
            <CheckCircle size={32} />
          </ThemeIcon>
          <div className='title3 text-center'>Check your inbox</div>
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
                size="sm"
                leftSection={<Mail size={16} />}
                {...form.getInputProps("email")}
              />

              <Button
                type="submit"
                fullWidth
                mt="xs"
                radius="md"
                size="sm"
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

  )
}