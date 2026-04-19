import { createFileRoute } from "@tanstack/react-router"
import {
  Anchor,
  Card,
  Container,
  Divider,
  Group,
  List,
  Stack,
  ThemeIcon,
} from "@mantine/core"
import {
  CheckCircle,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"

export const Route = createFileRoute("/contact")({
  component: ContactPage,
})

const WHY_REACH_OUT = [
  "Response guaranteed within 24 hours",
  "Free initial consultation — no commitment",
  "Clear communication throughout the project",
  "Flexible engagement — freelance, contract, or full-time",
]

const CONTACT_LINKS = [
  {
    icon: <Mail size={20} />,
    label: "abdallahshee664@email.com",
    href: "mailto:abdallahshee664@email.com",
    color: "indigo",
  },
  {
    icon: <Phone size={20} />,
    label: "+254 796 515 302",
    href: "tel:+254796515302",
    color: "teal",
  },
  {
    icon: <Github size={20} />,
    label: "github.com/abdallahshee",
    href: "https://github.com/abdallahshee",
    color: "dark",
  },
  {
    icon: <Linkedin size={20} />,
    label: "linkedin.com/in/abdallahshee",
    href: "https://linkedin.com/in/abdallahshee",
    color: "blue",
  },
]

function ContactPage() {
  return (
    <Container size="sm" className="max-w-full space-y-8 px-0 py-6 sm:py-8 md:py-10">
      {/* ── PAGE HEADER ── */}
      <Stack gap="sm">
        <div className="heading">Let's Build Something Together</div>
        <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
          Have a project, idea, or opportunity you'd like to discuss?
          Reach out directly — I respond to every message.
        </p>
      </Stack>

      {/* ── CONTACT CARD ── */}
      <Card radius="md" withBorder className="p-6 shadow-sm sm:p-8">
        <Stack gap="xl">
          {/* Contact links */}
          <Stack gap="md">
            <div className="title3">Contact Details</div>
            <Divider color="blue" />
            <Stack gap="sm">
              {CONTACT_LINKS.map(({ icon, label, href, color }) => (
                <Anchor key={href} href={href} target="_blank" underline="never">
                  <Group
                    gap="sm"
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ThemeIcon variant="light" color={color} radius="md" size={36}>
                      {icon}
                    </ThemeIcon>
                    <span className="break-all text-sm font-medium text-slate-700 dark:text-slate-200">
                      {label}
                    </span>
                  </Group>
                </Anchor>
              ))}
            </Stack>
          </Stack>

          <Divider />

          {/* Availability section */}
          <Stack gap="md">
            <div className="title3">Quick to Respond</div>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
              I check my inbox daily and aim to reply to every message within{" "}
              <strong>24 hours</strong>. If your matter is urgent, feel free to
              call or reach out on LinkedIn directly.
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
                  <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                    {item}
                  </span>
                </List.Item>
              ))}
            </List>
          </Stack>
        </Stack>
      </Card>
    </Container>
  )
}