import { Alert, Anchor, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, UserPlus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/account/settings')({
  component: RouteComponent,
})

function RouteComponent() {
    const [formError, setFormError] = useState<string | null>(null)
    const handleSubmit=()=>{
      console.log('first')
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
              <Title order={2} className="text-3xl">Create Account</Title>
              <Text c="dimmed" size="sm" mt={6}>
                Join and start exploring projects and blogs.
              </Text>
            </div>
    
          
    
            <Divider label="Or create account with email" labelPosition="center" my="xs" />
    
            {formError && (
              <Alert
                color="red"
                radius="md"
                icon={<AlertCircle size={24} />}
                title="Sign up failed"
                withCloseButton
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}
    
            <form >
               {/* <form onSubmit={form.onSubmit(handleSubmit)}> */}
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  radius="md"
                  size="md"
                  // {...form.getInputProps("name")}
                />
    
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  radius="md"
                  size="md"
                  // {...form.getInputProps("email")}
                />
    
                <PasswordInput
                  label="Password"
                  placeholder="Create a password"
                  radius="md"
                  size="md"
                  // {...form.getInputProps("password")}
                />
    
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Repeat password"
                  radius="md"
                  size="md"
                  // {...form.getInputProps("confirmPassword")}
                />
    
                <Button
                  type="submit"
                  fullWidth
                  mt="sm"
                  radius="xl"
                  size="md"
                  // loading={isSubmitting}
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
