import {
  Container,
  Text,
  Group,
  Stack,
  Anchor,
  SimpleGrid,
  Divider,
  ActionIcon,
  Title,
  Avatar,
} from "@mantine/core"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="mt-24 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <Container size="xl" className="py-16">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {/* First Column: Identity */}
          <Stack gap="md">
            <Group align="center" wrap="nowrap">
              <Avatar
                src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
                size={60}
                radius="xl"
              />
              <div>
                <Title order={6} className="tracking-tight">
                  Abdallah Shee
                </Title>
                <Text size="sm" c="dimmed">
                  <span className="text-md">Software Developer,</span> <br></br><span className="text-sm">Nairobi, Kenya  🇰🇪.</span>
                </Text>
              </div>
            </Group>
          </Stack>

          {/* Second Column: Explore */}
          <Stack gap="sm">
            {/* <Anchor component={Link} to="/" className="transition-colors hover:text-indigo-500">
              Home
            </Anchor> */}
            <Anchor component={Link} to="/services" className="transition-colors hover:text-indigo-500">
              Services
            </Anchor>
            <Anchor component={Link} to="/projects" className="transition-colors hover:text-indigo-500">
              Projects
            </Anchor>

            <Anchor component={Link} to="/contact" className="transition-colors hover:text-indigo-500">
              Contact
            </Anchor>
            <Anchor component={Link} to="/articles" className="transition-colors hover:text-indigo-500">
              Blog
            </Anchor>
          </Stack>

          {/* Third Column: Contact */}
          <Stack gap="sm">
            <Title order={5}>Contact</Title>

            <Group gap="xs" wrap="nowrap">
              <Phone size={16} className="text-slate-500" />
              <Text size="sm">+254 796 515 302</Text>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <Mail size={16} className="text-slate-500" />
              <Text size="sm">abdallahshee664@email.com</Text>
            </Group>
          </Stack>

          {/* Fourth Column: Connect */}
          <Stack gap="sm">
            <Title order={5}>Connect</Title>

            <Group gap="sm">
              <ActionIcon
                component="a"
                href="https://github.com/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                radius="xl"
                size="lg"
              >
                <Github size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="https://linkedin.com/in/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                radius="xl"
                size="lg"
              >
                <Linkedin size={18} />
              </ActionIcon>

              <ActionIcon
                onClick={() => router.navigate({ to: "/contact" })}
                variant="light"
                radius="xl"
                size="lg"
              >
                <Mail size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </SimpleGrid>

        <Divider my="xl" />

        <Group justify="center" wrap="wrap" gap="sm">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} Abdallah Shee. All rights reserved.
          </Text>

      
        </Group>
      </Container>
    </footer>
  )
}