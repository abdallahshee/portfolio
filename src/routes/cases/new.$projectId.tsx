import { CaseSchema, type CreateCaseFormRequest } from '@/db/validations/case.types'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from "@mantine/form"
import { zod4Resolver } from 'mantine-form-zod-resolver'
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Stack,
  Group,
  Container,
  Text,
  ThemeIcon,
  SimpleGrid,
  Divider,
  Badge,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Wrench,
  Code2,
  Calendar,
  Plus,
  X,
  Save,
} from 'lucide-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useCreateCaseStudyMutations } from '@/db/queries/case.queries'
import type z from 'zod'


export const Route = createFileRoute('/cases/new/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const createCaseMutation = useCreateCaseStudyMutations()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [techInput, setTechInput] = useState('')
const TheSchema=CaseSchema.omit({projectId:true})
type CaseRequest=z.infer<typeof TheSchema>
  const form = useForm<CaseRequest>({
    initialValues: {
      problem: '',
      solution: '',
      implementation: '',
      startDate: '',
      endDate: '',
      outcomes:"",
      technologies: [],
    },
    validate: zod4Resolver(CaseSchema),
    validateInputOnBlur: true,
  })

  const handleAddTech = () => {
    const tech = techInput.trim()
    if (!tech) return

    const exists = form.values.technologies.some(
      (t) => t.toLowerCase() === tech.toLowerCase()
    )
    if (exists) {
      setTechInput('')
      return
    }

    if (form.values.technologies.length >= 5) {
      notifications.show({
        title: 'Limit reached',
        message: 'A maximum of 5 technologies is allowed.',
        color: 'orange',
      })
      return
    }

    form.setFieldValue('technologies', [...form.values.technologies, tech])
    setTechInput('')
  }

  const handleRemoveTech = (tech: string) => {
    form.setFieldValue(
      'technologies',
      form.values.technologies.filter((t) => t !== tech)
    )
  }

  const handleSubmit = async (values:CaseRequest ) => {
    try {
      setLoading(true)
      createCaseMutation.mutateAsync({ ...values, projectId })
      console.log({ ...values, projectId })
      notifications.show({
        title: 'Case study saved',
        message: 'The case study was created successfully.',
        color: 'green',
      })
      router.history.back()
    } catch (err: any) {
      notifications.show({
        title: 'Failed',
        message: err?.message ?? 'Something went wrong.',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="lg">
        <Stack gap="xl">

          {/* Header */}
          <Paper
            radius="xl"
            p="xl"
            withBorder
            className="bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="center">
              <Group gap="md">
                <ThemeIcon variant="light" color="indigo" radius="xl" size={48}>
                  <BookOpen size={22} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="xl" className="leading-tight">
                    Create Case Study
                  </Text>
                  <Text size="sm" c="dimmed">
                    Document the problem, solution, and implementation for this project
                  </Text>
                </div>
              </Group>
              <Button
                variant="light"
                radius="md"
                size="sm"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => router.history.back()}
              >
                Back
              </Button>
            </Group>
          </Paper>

          {/* Form */}
          <Paper radius="xl" p="xl" withBorder className="shadow-sm">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="xl">

                {/* Timeline */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="blue" radius="lg" size={32}>
                      <Calendar size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Project Timeline</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    When did this project start and end?
                  </Text>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">

                    <DatePickerInput
                      label="Pick date"
                      placeholder="Pick date"
                      radius="md"
                      size="sm"
                      valueFormat="YYYY-MM-DD"
                      value={form.values.startDate}
                      onChange={(date) =>
                        form.setFieldValue(
                          'startDate',
                          date!
                        )
                      }
                      error={form.errors.startDate}
                    />
                    <DatePickerInput
                      label="Pick date"
                      radius="md"
                      size="sm"
                      valueFormat="YYYY-MM-DD"
                      placeholder="Pick date"
                      value={form.values.startDate}
                      onChange={(date) =>
                        form.setFieldValue(
                          'endDate',
                          date!
                        )
                      }
                      error={form.errors.startDate}
                    />
                  </SimpleGrid>
                </Stack>

                <Divider />

                {/* Technologies */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="teal" radius="lg" size={32}>
                      <Code2 size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Technologies Used</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Add up to 5 technologies used in this project.
                  </Text>

                  <Group align="flex-end">
                    <TextInput
                      placeholder="e.g. React, PostgreSQL"
                      radius="md"
                      size="sm"
                      className="flex-1"
                      value={techInput}
                      onChange={(e) => setTechInput(e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTech()
                        }
                      }}
                      error={form.errors.technologies}
                    />
                    <Button
                      type="button"
                      variant="light"
                      color="teal"
                      radius="md"
                      size="sm"
                      leftSection={<Plus size={14} />}
                      onClick={handleAddTech}
                      disabled={form.values.technologies.length >= 5}
                    >
                      Add
                    </Button>
                  </Group>

                  {form.values.technologies.length > 0 && (
                    <Group gap="xs">
                      {form.values.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="light"
                          color="teal"
                          radius="xl"
                          size="md"
                          rightSection={
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(tech)}
                              className="flex items-center"
                            >
                              <X size={11} />
                            </button>
                          }
                        >
                          {tech}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Stack>

                <Divider />

                {/* Problem */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="red" radius="lg" size={32}>
                      <Lightbulb size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Problem</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Describe the problem this project was built to solve. (100–1000 characters)
                  </Text>
                  <Textarea
                    placeholder="What problem were you solving?"
                    radius="md"
                    size="sm"
                    minRows={4}
                    autosize
                    maxRows={8}
                    {...form.getInputProps('problem')}
                  />
                  <Text size="xs" c="dimmed" ta="right">
                    {form.values.problem.length} / 1000
                  </Text>
                </Stack>

                <Divider />

                {/* Solution */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="green" radius="lg" size={32}>
                      <Lightbulb size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Solution</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Describe the solution you designed or built. (100–1000 characters)
                  </Text>
                  <Textarea
                    placeholder="How did you solve the problem?"
                    radius="md"
                    size="sm"
                    minRows={4}
                    autosize
                    maxRows={8}
                    {...form.getInputProps('solution')}
                  />
                  <Text size="xs" c="dimmed" ta="right">
                    {form.values.solution.length} / 1000
                  </Text>
                </Stack>

                <Divider />

                {/* Implementation */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="grape" radius="lg" size={32}>
                      <Wrench size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Implementation</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Describe how you implemented the solution technically. (100–1000 characters)
                  </Text>
                  <Textarea
                    placeholder="Walk through the technical implementation..."
                    radius="md"
                    size="sm"
                    minRows={4}
                    autosize
                    maxRows={8}
                    {...form.getInputProps('implementation')}
                  />
                  <Text size="xs" c="dimmed" ta="right">
                    {form.values.implementation.length} / 1000
                  </Text>
                </Stack>

                       {/* Implementation */}
                <Stack gap="md">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="grape" radius="lg" size={32}>
                      <Wrench size={15} />
                    </ThemeIcon>
                    <Text fw={600} size="md">Outcomes</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Describe the resuts of the final outcomes. (100–1000 characters)
                  </Text>
                  <Textarea
                    placeholder="Walk through the final outcomes..."
                    radius="md"
                    size="sm"
                    minRows={4}
                    autosize
                    maxRows={8}
                    {...form.getInputProps('outcomes')}
                  />
                  <Text size="xs" c="dimmed" ta="right">
                    {form.values.outcomes.length} / 1000
                  </Text>
                </Stack>

                {/* Actions */}
                <Group justify="flex-end" mt="sm">
                  <Button
                    variant="default"
                    type="button"
                    radius="md"
                    size="sm"
                    onClick={() => router.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    radius="md"
                    size="sm"
                    loading={loading}
                    leftSection={<Save size={16} />}
                  >
                    Save Case Study
                  </Button>
                </Group>

              </Stack>
            </form>
          </Paper>
        </Stack>
      </Container>
    </div>
  )
}