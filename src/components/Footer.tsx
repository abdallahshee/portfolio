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
  Avatar
} from "@mantine/core";

import {
  Github,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-16 bg-slate-50 dark:bg-slate-700 border-b-2 border-blue-500"
    >
      <Container size="xl" className="py-20">

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">

          {/* Developer Info with Avatar */}
          <Stack>
            <Group align="center">
              <Avatar
                src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
                size={60}
                radius="xl"
              />
              <div>
                <Title order={4}>Abdallah Shee</Title>
                <Text size="sm" c="dimmed">
                  Full-Stack Developer{" "}
                  <span className="text-base">🇰🇪</span>
                </Text>
              </div>
            </Group>

            <Text c="dimmed" size="sm">
              I build modern and scalable web applications using
              React, TypeScript, Node.js and PostgreSQL.
            </Text>

            <Group gap={6}>
              <Phone size={16} className="text-slate-500 dark:text-slate-400" />
              <Text size="sm">+254 712 345 678</Text>
            </Group>

            <Group gap={6}>
              <Mail size={16} className="text-slate-500 dark:text-slate-400" />
              <Text size="sm">developer@email.com</Text>
            </Group>
          </Stack>

          {/* Quick Links */}
          <Stack>
            <Title order={5}>Quick Links</Title>
            <Anchor href="/">Home</Anchor>
            <Anchor href="/projects">Projects</Anchor>
            <Anchor href="/contact">Contact</Anchor>
          </Stack>

          {/* Social Links */}
          <Stack>
            <Title order={5}>Connect</Title>

            <Group>
              <ActionIcon
                component="a"
                href="https://github.com/yourusername"
                target="_blank"
                variant="light"
                size="lg"
              >
                <Github size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                variant="light"
                size="lg"
              >
                <Linkedin size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="mailto:developer@email.com"
                variant="light"
                size="lg"
              >
                <Mail size={18} />
              </ActionIcon>
            </Group>

            <Text size="sm" c="dimmed">
              Open to freelance work, collaborations and
              exciting software projects.
            </Text>
          </Stack>

        </SimpleGrid>

        <Divider my="lg" />

        <Group justify="space-between" wrap="wrap">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} Abdallah Shee. All rights reserved.
          </Text>
        </Group>

      </Container>
    </footer>
  )
}