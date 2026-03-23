import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@mantine/form'
import { TextInput, PasswordInput, Button, Stack, Paper, Title } from '@mantine/core'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    }
  })

  const handleSubmit =async (values: typeof form.values) => {
    console.log('Form values:', values)
  }

  return (
    <Paper p="xl" radius="md" withBorder w={400} mx="auto" mt={100}>
      <Title order={3} mb="md">Test Form</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
       <TextInput
  label="Email"
  placeholder="you@example.com"
  radius="md"
  size="md"
  value={form.values.email}
  onChange={(e) => {
    console.log("typing:", e.currentTarget.value)  // 👈 add
    form.setFieldValue('email', e.currentTarget.value)
  }}
  error={form.errors.email}
/>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            radius="md"
            size="md"
           {...form.getInputProps("password")}
          />
          <Button type="submit" radius="xl" fullWidth>
            Submit
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}