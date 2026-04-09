import { createFileRoute } from "@tanstack/react-router"
import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core"
import {
  AlertCircle,
  CheckCircle,
  Contact,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  Send,
  X
} from "lucide-react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useEffect, useState } from "react"
import { ContactMeEmailTemplate } from "@/lib/htmlTemplates"
import { EmailTemplateSchema, type EmailTemplateRequest } from "@/db/validations/contact.types"
import { useServerFn } from "@tanstack/react-start"
import { sendEmailFn } from "@/server/auth.functions"
import { AuthenticatedMiddleware } from "@/server/middleware/auth.middleware"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

export const Route = createFileRoute("/contact")({
  server: {
    middleware: [AuthenticatedMiddleware],
  },
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

const WHY_REACH_OUT = [
  "Response guaranteed within 24 hours",
  "Free initial consultation — no commitment",
  "Clear communication throughout the project",
  "Flexible engagement — freelance, contract, or full-time",
]

function ContactPage() {
  const supabase = getSupabaseBrowserClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data?.session ?? null)
      setIsSessionLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const sendEmailFunction = useServerFn(sendEmailFn)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const isOther = selectedSubject === "Other"

  const form = useForm<EmailTemplateRequest>({
    initialValues: {
      subject: "",
      name: "",
      email: session?.user.email ?? "",
      message: "",
    },
    validate: zod4Resolver(EmailTemplateSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: EmailTemplateRequest) => {
    try {
      setIsSubmitting(true)
      await sendEmailFunction({ data: { ...values, html: ContactMeEmailTemplate(values) } })
      notifications.show({
        title: "Message sent!",
        message: "Thanks for reaching out. I'll get back to you soon. 👋",
        color: "green",
      })
      form.reset()
      setSelectedSubject(null)
    } catch (err: any) {
      setFormError(err?.message ?? "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container size="lg" className="space-y-10 py-10">
      {/* ── PAGE HEADER ── */}
      <Stack gap="xs" className="text-center max-w-2xl mx-auto">

        <div className="heading">
          Get in Touch
        </div>

        <Text size="md" c="dimmed" className="leading-8">
          Have a project, idea, or opportunity you'd like to discuss?
          I'd love to hear from you. Fill in the form or reach out directly —
          I respond to every message.
        </Text>
      </Stack>

      {/* ── MAIN: FORM + SIDEBAR ── */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" className="items-start">
        {/* CONTACT FORM */}
        <Card radius="xl" withBorder p="xl" className="shadow-sm">
          <Stack gap="lg">
            <Group gap="xs">
              <ThemeIcon variant="light" color="indigo" radius="md">
                <MessageSquare size={16} />
              </ThemeIcon>
              <div className="title3">Send a Message</div>
            </Group>
            <Divider color="blue"/>
            {formError && (
              <Alert
                color="red"
                radius="md"
                icon={<AlertCircle size={20} />}
                title="Failed to send message"
                withCloseButton
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1 }} spacing="md">
                  <TextInput
                    label="Your Name"
                    placeholder="John Doe"
                    radius="md"
                    size="sm"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Email Address"
                    placeholder="john@email.com"
                    radius="md"
                    size="sm"
                    {...form.getInputProps("email")}
                  />
                </SimpleGrid>

                <Select
                  label="What's this about?"
                  placeholder="Select a subject"
                  data={SUBJECT_OPTIONS}
                  radius="md"
                  size="sm"
                  value={selectedSubject}
                  onChange={(value) => {
                    setSelectedSubject(value)
                    form.setFieldValue("subject", value === "Other" ? "" : value ?? "")
                  }}
                />

                {isOther && (
                  <TextInput
                    label="Please specify"
                    placeholder="Tell me what this is about..."
                    radius="md"
                    size="sm"
                    {...form.getInputProps("subject")}
                  />
                )}

                <Textarea
                  label="Your Message"
                  placeholder="Describe your project, idea, or question..."
                  rows={6}
                  h={200}
                  styles={{ input: { height: '100%', overflowY: 'auto', resize: 'none' } }}
                  radius="md"
                  size="sm"
                  {...form.getInputProps("message")}
                />

                <Group justify="space-between" mt="xs">
                  <Button
                    type="button"
                    variant="filled"
                    color="red"
                    radius="md"
                    size="sm"
                    leftSection={<X size={16} />}
                    onClick={() => { form.reset(); setSelectedSubject(null) }}
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    radius="md"
                    size="sm"
                    variant="filled"
                    color="yellow"
                    leftSection={<Send size={16} />}
                    loading={isSubmitting}
                  >
                    Send Message
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Card>
        <Card radius="xl" withBorder p="xl" className="shadow-sm bg-indigo-50 dark:bg-indigo-950/30">
          <Stack gap="md">
            <Group gap="sm" align="center">
              <ThemeIcon variant="transparent" radius="md" size="sm">
                <Contact size={20} />
              </ThemeIcon>
              <div className="title3">Contacts</div>

            </Group>
            <Divider color="blue"/>
            <Group gap="sm">
              <ThemeIcon variant="transparent" radius="md" size="sm">
                <Mail size={24} />
              </ThemeIcon>
              <Text size="sm" fw={500}>abdallahshee664@email.com</Text>
            </Group>

            <Group gap="sm">
              <ThemeIcon variant="transparent" radius="md" size="sm">
                <Phone size={24} />
              </ThemeIcon>
              <Text size="sm" fw={500}>+254 796515302</Text>
            </Group>

            <Anchor href="https://github.com/abdallahshee" target="_blank" underline="never">
              <Group gap="sm">
                <ThemeIcon variant="transparent" radius="md" size="sm">
                  <Github size={24} />
                </ThemeIcon>
                <Text size="sm" fw={500}>GitHub</Text>
              </Group>
            </Anchor>

            <Anchor href="https://linkedin.com/in/abdallahshee" target="_blank" underline="never">
              <Group gap="sm">
                <ThemeIcon variant="transparent" radius="md" size="sm">
                  <Linkedin size={24} />
                </ThemeIcon>
                <Text size="sm" fw={500}>LinkedIn</Text>
              </Group>
            </Anchor>
          </Stack>

          <Stack gap="md" className="mt-6">
            <Group gap="xs">
              <div className="title3">Quick to Respond</div>
            </Group>
            <Text size="md" c="dimmed">
              I check my inbox daily and aim to reply to every message within
              <strong> 24 hours</strong>. If your matter is urgent, feel free
              to call or reach out on LinkedIn directly.
            </Text>
            <List
              spacing="xs"
              size="md"
              icon={
                <ThemeIcon color="green" size={18} radius="md" variant="light">
                  <CheckCircle size={16} />
                </ThemeIcon>
              }
            >
              {WHY_REACH_OUT.map((item) => (
                <List.Item key={item}>
                  <Text size="md" c="dimmed">{item}</Text>
                </List.Item>
              ))}
            </List>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  )
}