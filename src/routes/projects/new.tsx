import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Container, TextInput, Textarea, Checkbox, Button, Title, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { ProjectRequest } from '@/db/project-schema';


export const Route = createFileRoute('/projects/new')({
  component: RouteComponent,
})


function RouteComponent() {
  const form = useForm<ProjectRequest>({
    initialValues: {
      title: '',
      websiteUrl: '',
      githubUrl: '',
      description: '',
      imageUrl: '',
      isPublic: true,
    },
  });

  const [submitting, setSubmitting] = useState(false);

 return(
      <Container size="md" className="py-20">
      <Title order={2} className="text-3xl font-bold mb-8 text-center">
        Create New Project
      </Title>

      <form onSubmit={form.onSubmit(()=>console.log('first'))} >
        <Stack>
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

        {/* Submit Button */}
        <Group  mt="md">
          <Button
            type="submit"
            loading={submitting}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Create Project
          </Button>
        </Group>
        </Stack>
      </form>
    </Container>
 )
}