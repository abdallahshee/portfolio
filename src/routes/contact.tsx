import { createFileRoute } from "@tanstack/react-router"
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
} from "@mantine/core"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  Send,
  X,
  Zap,
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

        <Title className="text-4xl font-extrabold">
          Get In{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Touch
          </span>
        </Title>
        <Text size="lg" c="dimmed" className="leading-8">
          Have a project, idea, or opportunity you'd like to discuss?
          I'd love to hear from you. Fill in the form or reach out directly —
          I respond to every message.
        </Text>
      </Stack>

      {/* ── QUICK CONTACT PILLS ── */}
      <Group justify="center" gap="md" className="flex-wrap">
        <Anchor href="mailto:developer@email.com" underline="never">
          <Paper withBorder radius="xl" px="lg" py="sm" className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Group gap="sm">
              <ThemeIcon variant="light" color="indigo" radius="xl" size="md">
                <Mail size={15} />
              </ThemeIcon>
              <Text size="sm" fw={500}>developer@email.com</Text>
            </Group>
          </Paper>
        </Anchor>
        <Anchor href="tel:+254712345678" underline="never">
          <Paper withBorder radius="xl" px="lg" py="sm" className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Group gap="sm">
              <ThemeIcon variant="light" color="indigo" radius="xl" size="md">
                <Phone size={15} />
              </ThemeIcon>
              <Text size="sm" fw={500}>+254 712 345 678</Text>
            </Group>
          </Paper>
        </Anchor>
        <Anchor href="https://github.com/yourusername" target="_blank" underline="never">
          <Paper withBorder radius="xl" px="lg" py="sm" className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Group gap="sm">
              <ThemeIcon variant="light" color="dark" radius="xl" size="md">
                <Github size={15} />
              </ThemeIcon>
              <Text size="sm" fw={500}>GitHub</Text>
            </Group>
          </Paper>
        </Anchor>
        <Anchor href="https://linkedin.com/in/yourusername" target="_blank" underline="never">
          <Paper withBorder radius="xl" px="lg" py="sm" className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Group gap="sm">
              <ThemeIcon variant="light" color="blue" radius="xl" size="md">
                <Linkedin size={15} />
              </ThemeIcon>
              <Text size="sm" fw={500}>LinkedIn</Text>
            </Group>
          </Paper>
        </Anchor>
      </Group>

      <Divider label="or send a message below" labelPosition="center" />

      {/* ── MAIN: FORM + SIDEBAR ── */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className="items-start">

        {/* CONTACT FORM */}
        <Card radius="2xl" withBorder p="xl" className="shadow-sm">
          <Stack gap="lg">
            <Group gap="xs">
              <ThemeIcon variant="light" color="indigo" radius="xl">
                <MessageSquare size={16} />
              </ThemeIcon>
              <Title order={3}>Send a Message</Title>
            </Group>

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
                    size="md"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Email Address"
                    placeholder="john@email.com"
                    radius="md"
                    size="md"
                    {...form.getInputProps("email")}
                  />
                </SimpleGrid>

                <Select
                  label="What's this about?"
                  placeholder="Select a subject"
                  data={SUBJECT_OPTIONS}
                  radius="md"
                  size="md"
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
                    size="md"
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
                  size="md"
                  {...form.getInputProps("message")}
                />

                <Group justify="space-between" mt="xs">
                  <Button
                    type="button"
                    variant="default"
                    radius="xl"
                    size="md"
                    leftSection={<X size={16} />}
                    onClick={() => { form.reset(); setSelectedSubject(null) }}
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    radius="xl"
                    size="md"
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

        {/* SIDEBAR */}
        <Stack gap="lg">

          {/* Response promise */}
          <Card radius="2xl" withBorder p="xl" className="shadow-sm bg-indigo-50 dark:bg-indigo-950/30">
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl">
                  <Clock size={16} />
                </ThemeIcon>
                <Title order={4}>Quick to Respond</Title>
              </Group>
              <Text size="sm" c="dimmed">
                I check my inbox daily and aim to reply to every message within
                <strong> 24 hours</strong>. If your matter is urgent, feel free
                to call or reach out on LinkedIn directly.
              </Text>
              <List
                spacing="xs"
                size="sm"
                icon={
                  <ThemeIcon color="green" size={18} radius="xl" variant="light">
                    <CheckCircle size={12} />
                  </ThemeIcon>
                }
              >
                {WHY_REACH_OUT.map((item) => (
                  <List.Item key={item}>
                    <Text size="sm">{item}</Text>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Card>

          {/* What happens next */}
          <Card radius="2xl" withBorder p="xl" className="shadow-sm">
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="violet" radius="xl">
                  <Zap size={16} />
                </ThemeIcon>
                <Title order={4}>What Happens Next?</Title>
              </Group>
              <Timeline active={-1} bulletSize={26} lineWidth={2} color="indigo">
                <Timeline.Item
                  bullet={<Text size="xs" fw={700}>1</Text>}
                  title="You send a message"
                >
                  <Text size="xs" c="dimmed" mt={2}>
                    Fill out the form with your details and project idea
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<Text size="xs" fw={700}>2</Text>}
                  title="I review and respond"
                >
                  <Text size="xs" c="dimmed" mt={2}>
                    I'll reply within 24 hours with questions or next steps
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<Text size="xs" fw={700}>3</Text>}
                  title="We align on scope"
                >
                  <Text size="xs" c="dimmed" mt={2}>
                    A brief conversation to clarify goals, timeline, and budget
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<Text size="xs" fw={700}>4</Text>}
                  title="We start building"
                >
                  <Text size="xs" c="dimmed" mt={2}>
                    Kick off with a clear plan and regular updates throughout
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Stack>
          </Card>

        </Stack>
      </SimpleGrid>
    </Container>
  )
}