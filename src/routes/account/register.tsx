import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Divider,
  Alert,
  SimpleGrid,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useState } from 'react'
import { AlertCircle, CheckCircle, UserPlus } from 'lucide-react'
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

      setTimeout(() => {
        navigate({ to: '/account' })
      }, 3000)
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
            <UserPlus size={20} />
            <div className="title3">Create Account</div>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Fill in your details to register.
          </p>
        </div>

        <Divider color="blue" />

        {error && (
          <Alert
            color="red"
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
            icon={<CheckCircle size={18} />}
            title="Account created"
          >
            Please check your email to confirm your account.
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
          <Stack gap="md" className="w-full">

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="First Name"
                {...form.getInputProps('firstname')}
              />
              <TextInput
                label="Last Name"
                {...form.getInputProps('lastname')}
              />
            </SimpleGrid>

            <TextInput
              label="Email Address"
              {...form.getInputProps('email')}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <PasswordInput
                label="Password"
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="Confirm Password"
                {...form.getInputProps('confirmPassword')}
              
              />
            </SimpleGrid>

            <Button type="submit" fullWidth loading={isSubmitting}>
              Create Account
            </Button>

          </Stack>
        </form>
      </Stack>
    </div>
  )
}