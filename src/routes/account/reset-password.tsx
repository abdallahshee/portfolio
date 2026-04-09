import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  Alert,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/account/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [passwordReset, setPasswordReset] = useState(false)
  const [isRecoverySession, setIsRecoverySession] = useState(false)
  const [passwordVisible, { toggle: togglePassword }] = useDisclosure(false)
  const [confirmVisible, { toggle: toggleConfirm }] = useDisclosure(false)

  // ✅ listen for PASSWORD_RECOVERY event — required for updateUser to work
useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      setIsRecoverySession(true)
    }
  })

  return () => listener.subscription.unsubscribe()
}, [supabase])

  const form = useForm<{ password: string; confirmPassword: string }>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validateInputOnBlur: true,
  })

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    setFormError(null)
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) {
        setFormError(error.message)
        return
      }

      setPasswordReset(true)

      // ✅ redirect to sign in after 3 seconds
      setTimeout(() => {
        router.navigate({ to: '/account', search: { callbackUrl: '/' } })
      }, 3000)

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
        Set New Password
        </Text>
        <Text c="dimmed" size="sm" mt={4}>
             Choose a strong password for your account.
        </Text>
      </div>
   

        {/* <Divider my="xs" /> */}

        {/* ✅ invalid recovery session warning */}
        {!isRecoverySession && !passwordReset && (
          <Alert
            color="yellow"
            radius="md"
            icon={<AlertCircle size={20} />}
            title="Invalid or expired link"
          >
            This password reset link is invalid or has expired. Please{" "}
            <Link
              to="/account/forgot-password"
              className="font-semibold underline text-yellow-700 dark:text-yellow-400"
            >
              request a new one
            </Link>.
          </Alert>
        )}

        {/* ✅ success state */}
        {passwordReset ? (
          <Stack gap="md" align="center" py="md">
            <ThemeIcon variant="light" color="green" radius="md" size={64}>
              <CheckCircle size={32} />
            </ThemeIcon>
            <Title order={3} ta="center">Password Updated!</Title>
            <Text c="dimmed" size="sm" ta="center" maw={340}>
              Your password has been reset successfully.
              You'll be redirected to sign in shortly.
            </Text>
            <Button
              variant="light"
              color="indigo"
              radius="md"
              size="sm"
              onClick={() => router.navigate({ to: '/account', search: { callbackUrl: '/' } })}
            >
              Go to Sign In
            </Button>
          </Stack>
        ) : (
          <>
            {/* Error alert */}
            {formError && (
              <Alert
                color="red"
                radius="md"
                icon={<AlertCircle size={24} />}
                title="Reset failed"
                withCloseButton
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}

            {/* Form — only active when recovery session is valid */}
            <form onSubmit={form.onSubmit(handleResetPassword)}>
              <Stack gap="md">
                <PasswordInput
                  label="New Password"
                  placeholder="At least 8 characters"
                  radius="md"
                size="sm"
                  visible={passwordVisible}
                  onVisibilityChange={togglePassword}
                  visibilityToggleButtonProps={{
                    'aria-label': 'Toggle password visibility',
                    tabIndex: 0,
                  }}
                  {...form.getInputProps("password")}
                  disabled={!isRecoverySession}
                />

                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Repeat your new password"
                  radius="md"
                size="sm"
                  visible={confirmVisible}
                  onVisibilityChange={toggleConfirm}
                  visibilityToggleButtonProps={{
                    'aria-label': 'Toggle confirm password visibility',
                    tabIndex: 0,
                  }}
                  {...form.getInputProps("confirmPassword")}
                  disabled={!isRecoverySession}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xs"
                  radius="md"
                size="sm"
                  loading={isSubmitting}
                  disabled={!isRecoverySession}
                  leftSection={<KeyRound size={18} />}
                >
                  Reset Password
                </Button>
              </Stack>
            </form>
          </>
        )}

        <Divider my="xs" />

        <Text ta="center" size="md" c="dimmed">
          Remember your password?{" "}
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