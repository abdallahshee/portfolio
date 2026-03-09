import { Badge, Button, Container, Text, Title, Card, Grid, Group } from '@mantine/core';
import { ArrowRight } from 'lucide-react';
import {  createFileRoute } from '@tanstack/react-router';



// Example project data - in real app, fetch from DB or API


export const Route = createFileRoute('/projects/$projectId')({ 
  loader:()=>{

  },
  component: ProjectDetails 
});

export default function ProjectDetails() {
  // const { projectId } = Route.useParams();
  



  return (
    <Container size="lg" className="py-20 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center">
        <Title order={1} className="text-4xl font-bold mb-4">title</Title>
        <Text size="md" color="gray-600" className="max-w-2xl mx-auto">
          overview
        </Text>

        {/* Live Demo Button */}
        <Button
          component="a"
          href='#'
          // href={project.liveUrl}
          target="_blank"
          size="md"
          className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2 mx-auto"
        >
          View Live Demo
          <ArrowRight size={18} />
        </Button>
      </div>

      {/* Problem Section */}
      <div>
        <Title order={3} className="text-2xl font-semibold mb-2">Problem</Title>
        <Text size="md" color="gray-600">problem</Text>
      </div>

      {/* Features Section */}
      <div>
        <Title order={3} className="text-2xl font-semibold mb-4">Features</Title>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {/* {project.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))} */}
        </ul>
      </div>

      {/* Tech Stack Section */}
      <div>
        <Title order={3} className="text-2xl font-semibold mb-4">Tech Stack</Title>
        <Group  className="flex flex-wrap gap-2">
          {/* {project.techStack.map((tech) => (
            <Badge key={tech} color="indigo" variant="filled" className="uppercase tracking-wide">
              {tech}
            </Badge>
          ))} */}
        </Group>
      </div>

      {/* Screenshots Section */}
      <div>
        <Title order={3} className="text-2xl font-semibold mb-4">Screenshots</Title>
        <Grid gutter="md">
          {/* {project.screenshots.map((src, idx) => (
            <Grid.Col key={idx} span={12} md={4}>
              <Card shadow="sm" radius="md" className="overflow-hidden">
                <img src={src} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-48 object-cover"/>
              </Card>
            </Grid.Col>
          ))} */}
        </Grid>
      </div>
    </Container>
  );
}