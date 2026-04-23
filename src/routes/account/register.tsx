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
import { AlertCircle, CheckCircle } from 'lucide-react'
import { RegisterSchema } from '@/db/validations/profile.types'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'


export const Route = createFileRoute('/account/register')({
  component: RouteComponent,
})


type RegisterFormValues = z.infer<typeof RegisterSchema>

function RouteComponent() {
const supabase = getSupabaseBrowserClient()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
 
  const form = useForm<RegisterFormValues>({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: zod4Resolver(RegisterSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            firstname: values.firstname,
            lastname: values.lastname,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => navigate({ to: '/account' }), 3000)
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Stack gap="lg">
        <div>
          <div className="title3">Create an Account</div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill in the details below to get started
          </p>
        </div>

        <Divider color="blue" />

        {error && (
          <Alert
            color="red"
            radius="md"
            icon={<AlertCircle size={18} />}
            title="Registration failed"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            color="green"
            radius="md"
            icon={<CheckCircle size={18} />}
            title="Account created!"
          >
            Please check your email to confirm your account. Redirecting to
            sign in…
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Firstname"
              placeholder="John Doe"
              radius="md"
              size="sm"
              {...form.getInputProps('firstname')}
            />

                <TextInput
              label="Lastname"
              placeholder="John Doe"
              radius="md"
              size="sm"
              {...form.getInputProps('lastname')}
            />

            <TextInput
              label="Email Address"
              placeholder="john@email.com"
              radius="md"
              size="sm"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="At least 8 characters"
              radius="md"
              size="sm"
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat your password"
              radius="md"
              size="sm"
              {...form.getInputProps('confirmPassword')}
            />

            <Button
              type="submit"
              radius="md"
              size="sm"
              fullWidth
              loading={isSubmitting}
              disabled={success}
              mt="xs"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/account"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Sign in
              </Link>
            </p>
          </Stack>
        </form>
      </Stack>
    </div>
  )
}