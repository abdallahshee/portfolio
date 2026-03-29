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
  Badge,
} from "@mantine/core"

import {
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"

import { Link } from "@tanstack/react-router"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container size="xl" className="py-14">

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">

          {/* Identity */}
          <Stack gap="md">
            <Group align="center" wrap="nowrap">
              <Avatar
                src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
                size={54}
                radius="xl"
              />
              <div>
                <Title order={4} className="tracking-tight">
                  Abdallah Shee
                </Title>
                <Text size="sm" c="dimmed">
                  Software Architect • Full-Stack Developer 🇰🇪
                </Text>
              </div>
            </Group>


          </Stack>

          {/* Navigation */}
          <Stack gap="sm">
            <Title order={5}>Navigation</Title>

            <Anchor component={Link} to="/" className="hover:text-indigo-500 transition-colors">
              Home
            </Anchor>
            <Anchor component={Link} to="/projects" className="hover:text-indigo-500 transition-colors">
              Projects
            </Anchor>
            <Anchor component={Link} to="/articles"  className="hover:text-indigo-500 transition-colors">
              Articles
            </Anchor>
            <Anchor component={Link} to="/contact" className="hover:text-indigo-500 transition-colors">
              Contact
            </Anchor>
          </Stack>

          {/* Contact */}
          <Stack gap="sm">
            <Title order={5}>Contact</Title>

            <Group gap="xs">
              <Phone size={16} className="text-slate-500" />
              <Text size="sm">+254 712 345 678</Text>
            </Group>

            <Group gap="xs">
              <Mail size={16} className="text-slate-500" />
              <Text size="sm">developer@email.com</Text>
            </Group>
          </Stack>

          {/* Social */}
          <Stack gap="sm">
            <Title order={5}>Connect</Title>

            <Group gap="sm">
              <ActionIcon
                component="a"
                href="https://github.com/yourusername"
                target="_blank"
                variant="subtle"
                radius="xl"
                size="lg"
              >
                <Github size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                variant="subtle"
                radius="xl"
                size="lg"
              >
                <Linkedin size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="mailto:developer@email.com"
                variant="subtle"
                radius="xl"
                size="lg"
              >
                <Mail size={18} />
              </ActionIcon>
            </Group>
          </Stack>

        </SimpleGrid>

        <Divider my="lg" />

        <Group justify="space-between" wrap="wrap">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} Abdallah Shee
          </Text>

          <Text size="sm" c="dimmed">
            Nairobi, Kenya • Available for projects
          </Text>
        </Group>

      </Container>
    </footer>
  )
}