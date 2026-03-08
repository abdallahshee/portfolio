import { createFileRoute } from '@tanstack/react-router'
import { Container, Title, Text, Button, Card } from '@mantine/core';
import { Mail, Linkedin } from 'lucide-react';

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Container size="md" className="py-20" id="contact">
      {/* Header */}
      <div className="text-center mb-16">
        <Title order={2} className="text-3xl font-bold mb-4">
          Get in Touch
        </Title>
        <Text size="md" color="gray-600">
          I’d love to hear from you! You can reach out via email or connect with me on LinkedIn.
        </Text>
      </div>

      {/* Contact Options */}
      <div className="flex flex-col md:flex-row justify-center gap-8">
        
        {/* Email Card */}
        <Card
          shadow="md"
          padding="lg"
          radius="xl"
          className="flex-1 text-center hover:shadow-xl transition cursor-pointer"
          component="a"
          href="mailto:youremail@example.com"
        >
          <Mail size={40} className="mx-auto text-indigo-500 mb-4" />
          <Title order={4} className="mb-2">
            Email Me
          </Title>
          <Text color="gray-600 mb-4">youremail@example.com</Text>
          <Button
            component="a"
            href="mailto:youremail@example.com"
            variant="outline"
            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            Send Email
          </Button>
        </Card>

        {/* LinkedIn Card */}
        <Card
          shadow="md"
          padding="lg"
          radius="xl"
          className="flex-1 text-center hover:shadow-xl transition cursor-pointer"
          component="a"
          href="https://www.linkedin.com/in/yourusername"
          target="_blank"
        >
          <Linkedin size={40} className="mx-auto text-indigo-500 mb-4" />
          <Title order={4} className="mb-2">
            LinkedIn
          </Title>
          <Text color="gray-600 mb-4">Connect with me professionally</Text>
          <Button
            component="a"
            href="https://www.linkedin.com/in/yourusername"
            target="_blank"
            variant="outline"
            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            Visit Profile
          </Button>
        </Card>

      </div>
    </Container>

}
