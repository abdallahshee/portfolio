import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useState } from 'react'
import { AlertCircle, Lock } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { SignInSchema } from '@/db/validations/profile.types'

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

type SignInFormValues = z.infer<typeof SignInSchema>

function RouteComponent() {
  const supabase = getSupabaseBrowserClient()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignInFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zod4Resolver(SignInSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

      if (signInError) {
        setError(signInError.message)
        return
      }

      navigate({ to: '/' })
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Stack gap="lg" className="w-full">

        <div>
          <div className="flex items-center gap-2">
            <Lock size={20} />
            <div className="title3">Admin Sign In</div>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            This area is restricted to authorised users only.
          </p>
        </div>

        <Divider color="blue" />

        {error && (
          <Alert
            color="red"
            icon={<AlertCircle size={18} />}
            title="Sign in failed"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="w-full"
        >
          <Stack gap="md" className="w-full">

            <TextInput
              label="Email Address"
              placeholder="your@email.com"
              radius="md"
              size="sm"
              className="w-full"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              size="sm"
              className="w-full"
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              leftSection={<Lock size={16} />}
            >
              Sign In
            </Button>

          </Stack>
        </form>
      </Stack>
    </div>
  )
}