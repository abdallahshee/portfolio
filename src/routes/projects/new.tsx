import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Container, TextInput, Textarea, Checkbox, Button, Title, Group, Stack, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { ProjectRequest } from '@/db/project-schema';
import { useServerFn } from '@tanstack/react-start';
import { createProject } from '@/server/project.functions';
import { Plus, Trash } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/projects/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<ProjectRequest>({
    initialValues: {
      title: '',
      websiteUrl: '',
      githubUrl: '',
      description: '',
      imageUrl: '',
      isPublic: true,
      technologies: ['React'],
    },
  });

  const createProjectFn = useServerFn(createProject);
  const querClient = useQueryClient()
  const router = useRouter()
  const handleSubmit = async (values: ProjectRequest) => {
    await createProjectFn({ data: { ...values } });
    querClient.invalidateQueries({ queryKey: ['projects'] })
  };

  // Add a new empty technology field
  const addTechnology = () => {
    if (form.values.technologies.length < 4) {
      form.setFieldValue('technologies', [...form.values.technologies, '']);
    }
  };

  // Remove technology at index, but keep at least one
  const removeTechnology = (index: number) => {
    if (form.values.technologies.length > 1) {
      const updated = form.values.technologies.filter((_, i) => i !== index);
      form.setFieldValue('technologies', updated);
    }
  };

  return (
    <Container size="md" className="py-20">
      <Title order={2} className="text-3xl font-bold mb-8 text-center">
        Create New Project
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Project Title */}
          <TextInput
            label="Project Title"
            placeholder="My Awesome Project"
            {...form.getInputProps('title')}
          />

          {/* Website URL */}
          <TextInput
            label="Website URL"
            placeholder="https://myproject.com"
            {...form.getInputProps('websiteUrl')}
          />

          {/* GitHub URL */}
          <TextInput
            label="GitHub URL"
            placeholder="https://github.com/username/project"
            {...form.getInputProps('githubUrl')}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe your project"
            minRows={4}
            {...form.getInputProps('description')}
          />

          {/* Image URL */}
          <TextInput
            label="Image URL"
            placeholder="https://myproject.com/screenshot.png"
            {...form.getInputProps('imageUrl')}
          />

          {/* Public Checkbox */}
          <Checkbox
            label="Make Project Public"
            {...form.getInputProps('isPublic', { type: 'checkbox' })}
          />

          {/* Technologies */}
          <Stack gap="xs">
            <Group justify="apart" mb="xs">
              <Title order={5}>Technologies</Title>
              <ActionIcon
                onClick={addTechnology}
                size="lg"
                variant="light"
                disabled={form.values.technologies.length >= 4} // Max 4 items
              >
                <Plus size={18} />
              </ActionIcon>
            </Group>

            {form.values.technologies.map((tech, index) => (
              <Group key={index} gap="sm">
                <TextInput
                  placeholder="Enter technology"
                  {...form.getInputProps(`technologies.${index}`)}
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeTechnology(index)}
                  disabled={form.values.technologies.length === 1} // Always keep at least one
                >
                  <Trash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>

          {/* Submit Button */}
          <Group mt="md">
            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Create Project
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}