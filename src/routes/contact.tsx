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
import { AuthenticatedMiddleware } from "@/server/middleware"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

export const Route = createFileRoute("/contact")({
  server: {
    middleware: [AuthenticatedMiddleware],
  },
  component: ContactPage,
})

const SUBJECT_OPTIONS = [
  { value: "freelance", label: "💼 freelance project" },
  { value: "fulltime", label: "🏢 full-time job opportunity" },
  { value: "collaboration", label: "🤝 collaboration opportunity" },
  { value: "consulting", label: "🧠 technical consulting" },
  { value: "feedback", label: "💬 feedback on work" },
  { value: "other", label: "📩 other" },
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
    <Container size="lg" className="max-w-full space-y-8 px-0 py-6 sm:space-y-10 sm:py-8 md:py-10">
      {/* ── PAGE HEADER ── */}
      <Stack gap="xs" className="mx-auto max-w-2xl text-center">

        <div className="heading">
          Get in Touch
        </div>

        <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
          Have a project, idea, or opportunity you'd like to discuss?
          I'd love to hear from you. Fill in the form or reach out directly —
          I respond to every message.
        </p>
      </Stack>

      {/* ── MAIN: FORM + SIDEBAR ── */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'md', sm: 'lg' }} className="items-start">
        {/* CONTACT FORM */}
        <Card radius="xl" withBorder className="h-full p-4 shadow-sm sm:p-6 md:p-8">
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

                <Group justify="space-between" mt="xs" wrap="wrap" gap="sm" className="flex-col-reverse sm:flex-row sm:flex-nowrap sm:justify-between">
                  <Button
                    type="button"
                    variant="filled"
                    color="red"
                    radius="md"
                    size="sm"
                    className="w-full sm:w-auto"
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
                    className="w-full sm:w-auto"
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
        <Card radius="xl" withBorder className="h-full bg-indigo-50 p-4 shadow-sm sm:p-6 md:p-8 dark:bg-indigo-950/30">
          <Stack gap="md">
            <Group gap="sm" align="center">
              <ThemeIcon variant="transparent" radius="md" size="sm">
                <Contact size={20} />
              </ThemeIcon>
              <div className="title3">Contacts</div>

            </Group>
            <Divider color="blue"/>
            <Group gap="sm" wrap="nowrap" align="flex-start" className="min-w-0">
              <ThemeIcon variant="transparent" radius="md" size="sm" className="shrink-0">
                <Mail size={24} />
              </ThemeIcon>
              <span className="min-w-0 break-all text-sm font-medium text-slate-800 dark:text-slate-100">
                abdallahshee664@email.com
              </span>
            </Group>

            <Group gap="sm" wrap="nowrap" align="flex-start" className="min-w-0">
              <ThemeIcon variant="transparent" radius="md" size="sm" className="shrink-0">
                <Phone size={24} />
              </ThemeIcon>
              <span className="min-w-0 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
                +254 796515302
              </span>
            </Group>

            <Anchor href="https://github.com/abdallahshee" target="_blank" underline="never">
              <Group gap="sm">
                <ThemeIcon variant="transparent" radius="md" size="sm">
                  <Github size={24} />
                </ThemeIcon>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">GitHub</span>
              </Group>
            </Anchor>

            <Anchor href="https://linkedin.com/in/abdallahshee" target="_blank" underline="never">
              <Group gap="sm">
                <ThemeIcon variant="transparent" radius="md" size="sm">
                  <Linkedin size={24} />
                </ThemeIcon>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">LinkedIn</span>
              </Group>
            </Anchor>
          </Stack>

          <Stack gap="md" className="mt-6">
            <Group gap="xs">
              <div className="title3">Quick to Respond</div>
            </Group>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
              I check my inbox daily and aim to reply to every message within
              <strong> 24 hours</strong>. If your matter is urgent, feel free
              to call or reach out on LinkedIn directly.
            </p>
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
                  <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">{item}</span>
                </List.Item>
              ))}
            </List>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  )
}