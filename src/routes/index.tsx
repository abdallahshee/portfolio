import { Badge, Button, Container, Text, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <Container size="lg" className="py-20">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10">

        {/* Left Column: Text */}
        <div className="flex-1 space-y-6">
          <Text size="lg" color="gray" className="uppercase tracking-wider">
            Hi, I am Abdallah Shee 👋
          </Text>

          <Title order={1} className="text-4xl lg:text-5xl font-bold">
            Modern Full-Stack Developer
          </Title>

          <Text size="md" className="text-gray-600 max-w-xl">
            I build scalable and high-performance web applications using modern technologies like React, TanStack Start, Drizzle ORM, and Neon PostgreSQL.
            I leverage AI tools to accelerate development while ensuring your product is clean, functional, and user-friendly.
          </Text>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              component="a"
              href="#projects"
              size="md"
              className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
            >
              View Projects
              <ArrowRight size={18} />
            </Button>

            <Button
              component="a"
              href="#contact"
              variant="outline"
              size="md"
              className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
            >
              Contact Me
            </Button>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['React', 'TanStack Start', 'Drizzle ORM', 'Neon PostgreSQL', 'Tailwind CSS', 'AI-assisted Development'].map((tech) => (
              <Badge
                key={tech}
                size="lg"
                color="indigo"
                variant="filled"
                className="uppercase tracking-wide"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="flex-1">
          <img
            src="/images/hero.png" // Replace with your illustration or photo
            alt="Abdallah Shee - Fullstack Developer"
            className="rounded-xl shadow-lg object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Projects Preview Section */}
      <div id="projects" className="mt-32 text-center">
        <Title order={2} className="text-3xl font-bold mb-4">
          My Projects
        </Title>
        <Text size="md" className="text-gray-600 mb-10">
          Here are some of the web applications I’ve built recently.
        </Text>

        {/* Example placeholder for 3 project cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {[1, 2, 3].map((i) => (
    <div
      key={i}
      className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
    >
      <img
        src={`/images/project${i}.png`}
        alt={`Project ${i}`}
        className="w-full h-52 object-cover"
      />
      <div className="p-6 flex flex-col gap-4">
        <Title order={4} className="font-semibold">
          Project {i} Title
        </Title>
        <Text className="text-gray-500 text-sm">
          A short description of this project, what it does, and why it is useful.
        </Text>

        {/* Buttons */}
        <div className="flex flex-col gap-2 md:flex-row">
          {/* Live Website Button */}
          <Button
            component="a"
            href={`https://project${i}-live.com`} // Replace with real URLs
            target="_blank"
            size="sm"
            variant="outline"
            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50 flex-1"
          >
            View Website
          </Button>

          {/* Project Details Button */}
          <Button
            component="a"
            href={`/projects/project-${i}`} // This will be your project details route
            size="sm"
            variant="filled"
            className="bg-indigo-500 hover:bg-indigo-600 text-white flex-1"
          >
            Project Details
          </Button>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>
    </Container>
  )
}
