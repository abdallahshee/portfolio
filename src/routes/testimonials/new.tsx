import { createFileRoute, useRouter,redirect } from '@tanstack/react-router'
import { useForm} from '@mantine/form'
import { TextInput, Textarea, Button, Stack, Paper, Title } from '@mantine/core'
import { TestimonialSchema, type TestimonialRequest } from '@/db/validations/testimonial.types'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useCreateTestimonialMutation } from '@/db/queries/testimonial.queries'


export const Route = createFileRoute('/testimonials/new')({
  beforeLoad(ctx) {
    const isAdmin=ctx.context.isAdmin
      if (!isAdmin) {
        throw redirect({
          to: "/unauthorized",
        })
      }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const testimonialCreateMut=useCreateTestimonialMutation()
  const form = useForm<TestimonialRequest>({
    initialValues: {
      quote: '',
      authorFirstname: '',
      authorLastname: '',
      authorTitle: '',
      company: '',
    },
    validate: zod4Resolver(TestimonialSchema),
  })

  const handleSubmit = async(values: TestimonialRequest) => {
    console.log('Submitting:', values)

    // 👉 TODO: API call here
    await testimonialCreateMut.mutateAsync({...values})
    await router.navigate({ to: '/testimonials' })
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Paper withBorder radius="lg" p="lg">
        <Stack gap="md">
          
          <Title order={3}>Create Testimonial</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">

              {/* QUOTE */}
              <Textarea
                label="Quote"
                placeholder="Enter testimonial quote..."
                autosize
                minRows={3}
                {...form.getInputProps('quote')}
              />

              {/* AUTHOR NAME */}
              <TextInput
                label="Author Firstname"
                placeholder="John Doe"
                {...form.getInputProps('authorFirstname')}
              />
                   {/* AUTHOR NAME */}
              <TextInput
                label="Author Lastname"
                placeholder="John Doe"
                {...form.getInputProps('authorLastname')}
              />


              {/* AUTHOR TITLE */}
              <TextInput
                label="Author Title"
                placeholder="CEO, Founder..."
                {...form.getInputProps('authorTitle')}
              />

              {/* COMPANY */}
              <TextInput
                label="Company"
                placeholder="Company name"
                {...form.getInputProps('company')}
              />

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" radius="md">
                  Save Testimonial
                </Button>

                <Button
                  variant="default"
                  onClick={() => router.navigate({ to: '/testimonials' })}
                >
                  Cancel
                </Button>
              </div>

            </Stack>
          </form>
        </Stack>
      </Paper>
    </div>
  )
}