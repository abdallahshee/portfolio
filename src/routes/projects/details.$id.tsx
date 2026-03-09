import {
  Badge,
  Button,
  Container,
  Text,
  Title,
  Card,
  Grid,
  Group,
  Image,
  Stack
} from "@mantine/core";
import { ArrowRight, Github, Globe } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { getProjectByIdQueryOptions } from "@/queries/project-querie";

export const Route = createFileRoute("/projects/details/$id")({
  loader: async ({ context, params }) => {
    console.log('PARAMS IS HERE '+ params.id)
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
    <Container size="lg" className="py-16 space-y-16">

      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Title order={1} className="text-4xl font-bold">
          {project.title}
        </Title>

        <Text size="lg" c="dimmed">
          {project.description}
        </Text>

        <Group justify="center" mt="md">
          <Button
            component="a"
            href={project.websiteUrl}
            target="_blank"
            leftSection={<Globe size={18} />}
            rightSection={<ArrowRight size={18} />}
            size="md"
          >
            Live Website
          </Button>

          <Button
            component="a"
            href={project.githubUrl}
            target="_blank"
            variant="light"
            leftSection={<Github size={18} />}
          >
            Source Code
          </Button>
        </Group>
      </div>

      {/* PROJECT IMAGE */}
      {project.imageUrl && (
        <div className="max-w-5xl mx-auto">
          <Card radius="lg" shadow="md" className="overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              className="w-full object-cover"
            />
          </Card>
        </div>
      )}

      {/* PROJECT INFO */}
      <Grid gutter="xl">

        {/* LEFT CONTENT */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>

            <div>
              <Title order={3} className="mb-2">
                About the Project
              </Title>

              <Text c="dimmed">
                {project.description}
              </Text>
            </div>

            <div>
              <Title order={3} className="mb-2">
                Visibility
              </Title>

              <Badge
                color={project.isPublic ? "green" : "gray"}
                size="lg"
              >
                {project.isPublic ? "Public Project" : "Private Project"}
              </Badge>
            </div>

          </Stack>
        </Grid.Col>

        {/* SIDEBAR */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" withBorder>

            <Stack>

              <Title order={4}>Project Info</Title>

              <div>
                <Text fw={500}>Created</Text>
                <Text c="dimmed">
                  {new Date(project.createdAt).toLocaleDateString()}
                </Text>
              </div>

              <div>
                <Text fw={500}>Last Updated</Text>
                <Text c="dimmed">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </Text>
              </div>

              <Button
                component="a"
                href={project.websiteUrl}
                target="_blank"
                fullWidth
                leftSection={<Globe size={16} />}
              >
                Visit Website
              </Button>

              <Button
                component="a"
                href={project.githubUrl}
                target="_blank"
                variant="light"
                fullWidth
                leftSection={<Github size={16} />}
              >
                View Repository
              </Button>

            </Stack>

          </Card>
        </Grid.Col>

      </Grid>
    </Container>
  );
}

export default ProjectDetails;