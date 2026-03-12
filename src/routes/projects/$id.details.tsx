import {
  Badge,
  Button,
  Container,
  Text,
  Title,
  Group,
  Image,
  Stack,
  Divider
} from "@mantine/core";
import { ArrowRight, Github, Globe } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getProjectByIdQueryOptions } from "@/queries/project.queries";

export const Route = createFileRoute("/projects/$id/details")({
  loader: async ({ context, params }) => {

    const data = await context.queryClient.fetchQuery(
      getProjectByIdQueryOptions(params.id)
    );
    return data;
  },
  component: ProjectDetails,
});

function ProjectDetails() {
  const project = Route.useLoaderData();

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <Title order={2}>Project not found</Title>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl">
      <Stack gap="lg">
        {/* Project Title */}
        <Title order={2}>{project.title}</Title>

        {/* Main Image */}
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            radius="md"
            fit="cover"
            style={{ maxHeight: 400, width: '100%' }}
          />
        )}

        {/* Description */}
        <Text size="md" mt="sm">
          {project.description}
        </Text>

        <Divider my="md" />

        {/* Technologies Used */}
        <Stack gap="xs">
          <Text size='{500'>Main Technologies Used</Text>
          <Group gap="xs" wrap="wrap">
            {project.technologies.map((tech:string) => (
              <Badge key={tech} size="sm" variant="outline">
                {tech}
              </Badge>
            ))}
          </Group>
        </Stack>

        {/* Project Info */}
        <Stack gap="xs" mt="md">
          <Text>
            <strong>Public:</strong> {project.isPublic ? 'Yes' : 'No'}
          </Text>
          <Text>
            <strong>GitHub:</strong>{' '}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              {project.githubUrl}
            </a>
          </Text>
          <Text>
            <strong>Website:</strong>{' '}
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
              {project.websiteUrl}
            </a>
          </Text>
          <Text size="sm" color="dimmed">
            Created at: {new Date(project.createdAt).toLocaleDateString()} | Updated at:{' '}
            {new Date(project.updatedAt).toLocaleDateString()}
          </Text>
        </Stack>

        <Divider my="md" />

        {/* Action Buttons */}
        <Group justify="apart" grow={false} mt="md">
          {project.websiteUrl && (
            <Button
              component="a"
              href={project.websiteUrl}
              target="_blank"
              leftSection={<Globe size={16} />}
              variant="light"
            >
              Live Demo
            </Button>
          )}

          <Link to="/projects" params={{ id: project.id }}>
            <Button rightSection={<ArrowRight size={16} />}>More Projects</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}

export default ProjectDetails;