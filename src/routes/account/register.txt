import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Paper,
  Divider,
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/account/register')({
  component: RouteComponent,
})
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
const RegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email address'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters and include uppercase, lowercase, and a special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
      name: '',
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
            name: values.name,
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
              label="Full Name"
              placeholder="John Doe"
              radius="md"
              size="sm"
              {...form.getInputProps('name')}
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