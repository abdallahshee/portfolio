import { createFileRoute } from "@tanstack/react-router"
import {
  Anchor, Avatar, Button, Card, Container,
  Group, Paper, Select, SimpleGrid, Stack, Text, TextInput,
  Textarea, ThemeIcon, Title,
} from "@mantine/core"
import {
  Github, Linkedin, Mail, MessageSquare, Phone, Send, X,
} from "lucide-react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { authClient } from "@/lib/auth-client"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useState } from "react"
import { ContactMeEmailTemplate } from "@/lib/htmlTemplates"
import { EmailTemplateSchema, type EmailTemplateRequest } from "@/db/validations/contact.types"
import { useServerFn } from "@tanstack/react-start"
import { sendEmailFn } from "@/server/auth.functions"

export const Route = createFileRoute("/contact")({
  component: ContactPage,
})

const SUBJECT_OPTIONS = [
  { value: "Freelance", label: "💼 Freelance Project" },
  { value: "Fulltime", label: "🏢 Full-Time Job Opportunity" },
  { value: "Collaboration", label: "🤝 Collaboration Opportunity" },
  { value: "Consulting", label: "🧠 Technical Consulting" },
  { value: "Feedback", label: "💬 Feedback on Work" },
  { value: "Other", label: "📩 Other" },
]

function ContactPage() {
  const session = authClient.useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sendEmailFunction = useServerFn(sendEmailFn)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const isOther = selectedSubject === "Other"
  const form = useForm<EmailTemplateRequest>({
    initialValues: {
      subject: "",
      name: session?.data?.user.name ?? "",
      email: session?.data?.user.email ?? "",
      message: "",
    },
    validate: zod4Resolver(EmailTemplateSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: EmailTemplateRequest) => {
    try {
      setIsSubmitting(true)
      await sendEmailFunction({ data: { ...values, html: ContactMeEmailTemplate(values) } })
      console.log(JSON.stringify(values))
      notifications.show({
        title: "Message sent!",
        message: "Thanks for reaching out. I'll get back to you soon. 👋",
        color: "green",
      })
      form.reset()
    } catch (err: any) {
      notifications.show({
        title: "Failed to send",
        message: err?.message ?? "Something went wrong. Please try again.",
        color: "red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container size="xl" className="space-y-8 py-10">
      <Stack gap="xl">
        <Paper
          radius="2xl"
          p="xl"
          withBorder
          className="bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
        >
          <Group align="center" className="gap-6">
            <Avatar
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              size={100}
              radius="xl"
              className="border border-slate-200 shadow-sm"
            />
            <Stack gap={6} className="flex-1">
              <Group gap="xs">
                <Text c="blue" fw={700} size="xl">
                  Full-Stack Software Developer
                </Text>
              </Group>
              <Title order={1} className="text-3xl md:text-4xl">
                Abdallah Shee{" "}
                <span role="img" aria-label="Kenyan flag">🇰🇪</span>
              </Title>
              <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                I build scalable web applications using modern technologies like
                React, TypeScript, Node.js, and PostgreSQL. Feel free to reach out
                for collaborations, freelance work, or project opportunities.
              </Text>
              <Group gap="lg" mt={8} className="flex-wrap">
                <Group gap={8}>
                  <ThemeIcon variant="light" color="indigo" radius="xl">
                    <Phone size={16} />
                  </ThemeIcon>
                  <Text size="sm">+254 712 345 678</Text>
                </Group>
                <Group gap={8}>
                  <ThemeIcon variant="light" color="indigo" radius="xl">
                    <Mail size={16} />
                  </ThemeIcon>
                  <Text size="sm">developer@email.com</Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card radius="2xl" withBorder p="xl" className="shadow-sm">
            <Stack gap="lg">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue" radius="xl">
                  <MessageSquare size={16} />
                </ThemeIcon>
                <Title order={3}>Contact Me via Email</Title>
              </Group>

              <Text c="dimmed" size="sm">
                Have a project in mind or want to collaborate? Send me a message.
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Your Name"
                    placeholder="John Doe"
                    radius="md"
                    size="md"
                    required
                    {...form.getInputProps("name")}
                  />

                  <TextInput
                    label="Email Address"
                    placeholder="john@email.com"
                    radius="md"
                    size="md"
                    required
                    {...form.getInputProps("email")}
                  />

                  {/* ← Select instead of TextInput */}
    

                  <Select
  label="Subject"
  placeholder="Select a subject"
  data={SUBJECT_OPTIONS}
  radius="md"
  size="md"
  required
  value={selectedSubject}
  onChange={(value) => {
    setSelectedSubject(value)
    // clear subject field when switching options
    form.setFieldValue("subject", value === "Other" ? "" : value ?? "")
  }}
/>

{/* ← only shown when Other is selected */}
{isOther && (
  <TextInput
    label="Please specify"
    placeholder="Tell me what this is about..."
    radius="md"
    size="md"
    required
    {...form.getInputProps("subject")}
  />
)}

                  <Textarea
                    label="Message"
                    placeholder="Write your message here..."
                    rows={6}
                    h={200}
                    styles={{ input: { height: '100%', overflowY: 'auto', resize: 'none' } }}
                    radius="md"
                    size="md"
                    required
                    {...form.getInputProps("message")}
                  />

                  <Group justify="space-between" mt="xs">
                    <Button
                      type="button"
                      variant="default"
                      radius="xl"
                      size="md"
                      leftSection={<X size={18} />}
                      onClick={() => form.reset()}
                      disabled={isSubmitting}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      radius="xl"
                      size="md"
                      leftSection={<Send size={18} />}
                      loading={isSubmitting}
                    >
                      Send Message
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Card>

          <Stack gap="lg">
            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Title order={4}>Contact Information</Title>
                <Group gap="sm" align="flex-start">
                  <ThemeIcon variant="light" color="indigo" radius="xl">
                    <Phone size={16} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Phone</Text>
                    <Text c="dimmed">+254 712 345 678</Text>
                  </div>
                </Group>
                <Group gap="sm" align="flex-start">
                  <ThemeIcon variant="light" color="indigo" radius="xl">
                    <Mail size={16} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Email</Text>
                    <Text c="dimmed">developer@email.com</Text>
                  </div>
                </Group>
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Title order={4}>Connect with Me</Title>
                <Group gap="sm" align="center">
                  <ThemeIcon variant="light" color="dark" radius="xl">
                    <Github size={16} />
                  </ThemeIcon>
                  <Anchor href="https://github.com/yourusername" target="_blank" className="font-medium">
                    GitHub Profile
                  </Anchor>
                </Group>
                <Group gap="sm" align="center">
                  <ThemeIcon variant="light" color="blue" radius="xl">
                    <Linkedin size={16} />
                  </ThemeIcon>
                  <Anchor href="https://linkedin.com/in/yourusername" target="_blank" className="font-medium">
                    LinkedIn Profile
                  </Anchor>
                </Group>
              </Stack>
            </Card>

            <Paper
              radius="2xl"
              p="lg"
              withBorder
              className="bg-slate-50 shadow-sm dark:bg-slate-900/60"
            >
              <Stack gap="xs">
                <Text fw={700}>Let's build something great</Text>
                <Text size="sm" c="dimmed">
                  I'm open to freelance work, collaborations, and full-time opportunities.
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}