import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Card,
  Anchor,
  Group,
  SimpleGrid,
  Avatar,
  Badge
} from "@mantine/core";

import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Send
} from "lucide-react";

import { useForm } from "@mantine/form";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <Container size="lg" py={80}>

      {/* Header Section */}
      <Card
        withBorder
        shadow="md"
        radius="md"
        mb={50}
        p="xl"
        style={{
          background: "linear-gradient(135deg,#f8fafc,#eef2ff)"
        }}
      >
        <Group align="center" wrap="wrap">

          <Avatar
            src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
            size={100}
            radius="xl"
          />

          <Stack gap={4} style={{ flex: 1 }}>

            <Title order={2}>Abdallah Shee</Title>

            <Badge color="blue" variant="light" w="fit-content">
              Full-Stack Software Developer
            </Badge>

            <Text c="dimmed">
              I build scalable web applications using modern technologies
              like React, TypeScript, Node.js and PostgreSQL.
              Feel free to reach out for collaborations or project opportunities.
            </Text>

            <Group mt={6}>

              <Group gap={6}>
                <Phone size={16} />
                <Text size="sm">+254 712 345 678</Text>
              </Group>

              <Group gap={6}>
                <Mail size={16} />
                <Text size="sm">developer@email.com</Text>
              </Group>

            </Group>

          </Stack>

        </Group>
      </Card>

      {/* Contact Section */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">

        {/* Contact Form */}
        <Card shadow="md" padding="lg" radius="md" withBorder>

          <Title order={3} mb="md">
            Send a Message
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>

              <TextInput
                label="Your Name"
                placeholder="John Doe"
                required
                {...form.getInputProps("name")}
              />

              <TextInput
                label="Email Address"
                placeholder="john@email.com"
                required
                {...form.getInputProps("email")}
              />

              <Textarea
                label="Message"
                placeholder="Write your message here..."
                minRows={5}
                required
                {...form.getInputProps("message")}
              />

              <Button
                type="submit"
                leftSection={<Send size={18} />}
                fullWidth
              >
                Send Message
              </Button>

            </Stack>
          </form>

        </Card>

        {/* Contact Information */}
        <Stack>

          {/* Contact Details */}
          <Card shadow="md" padding="lg" radius="md" withBorder>

            <Title order={4} mb="sm">
              Contact Information
            </Title>

            <Stack gap="sm">

              <Group>
                <Phone size={18} />
                <Text>+254 712 345 678</Text>
              </Group>

              <Group>
                <Mail size={18} />
                <Text>developer@email.com</Text>
              </Group>

            </Stack>

          </Card>

          {/* Social Links */}
          <Card shadow="md" padding="lg" radius="md" withBorder>

            <Title order={4} mb="sm">
              Connect with Me
            </Title>

            <Stack>

              <Group>
                <Github size={18} />
                <Anchor
                  href="https://github.com/yourusername"
                  target="_blank"
                >
                  GitHub Profile
                </Anchor>
              </Group>

              <Group>
                <Linkedin size={18} />
                <Anchor
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                >
                  LinkedIn Profile
                </Anchor>
              </Group>

            </Stack>

          </Card>

        </Stack>

      </SimpleGrid>

    </Container>
  );
}