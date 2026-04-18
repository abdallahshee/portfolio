import { getCaseStudyByIdQueryOptions, getCaseStudyByProjectIdQueryOptions, useCaseUpdateMutation } from '@/db/queries/case.queries'
import { createFileRoute } from '@tanstack/react-router'
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Paper,
  Divider,
  Alert,
  Group,
  Badge,
  ThemeIcon,
  TagsInput,
} from '@mantine/core'
import {DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AlertCircle, BookOpen, Calendar, CheckCircle, Layers, Save, X } from 'lucide-react'
import { notifications } from '@mantine/notifications'
import { CaseSchema, type CaseRequest } from '@/db/validations/case.types'
import { zod4Resolver } from 'mantine-form-zod-resolver'

export const Route = createFileRoute('/cases/edit/$caseId')({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      getCaseStudyByIdQueryOptions(params.caseId)
    )
  },
  component: RouteComponent,
})



function RouteComponent() {
  const { caseId } = Route.useParams()
  const { data: caseStudy } = useSuspenseQuery(
    getCaseStudyByIdQueryOptions(caseId)
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CaseRequest>({
    initialValues: {
      title:caseStudy?.title??'',
      projectId: caseStudy?.projectId ??'',
      startDate: caseStudy?.startDate ?? '',
      endDate: caseStudy?.endDate ?? '',
      technologies: caseStudy?.technologies ?? [],
      problem: caseStudy?.problem ?? '',
      solution: caseStudy?.solution ?? '',
      implementation: caseStudy?.implementation ?? '',
      outcomes: caseStudy?.outcomes ?? '',
    },
    validate: zod4Resolver(CaseSchema),
    validateInputOnBlur: true,
  })
const mutateCase=useCaseUpdateMutation()
  const handleSubmit = async (values: CaseRequest) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await mutateCase.mutateAsync({...values })
      notifications.show({
        title: 'Case study updated!',
        message: 'The case study has been saved successfully.',
        color: 'green',
      })
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Paper radius="xl" withBorder className="p-6 shadow-sm sm:p-8">
      <Stack gap="lg">
        {/* ── HEADER ── */}
        <div>
          <Group gap="xs" mb={4}>
            <ThemeIcon variant="light" color="indigo" radius="md" size="sm">
              <BookOpen size={14} />
            </ThemeIcon>
            <div className="title3">Edit Case Study</div>
          </Group>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Document the problem, solution, implementation, and outcomes for this project.
          </p>
        </div>

        <Divider color="blue" />

        {/* ── ERROR ── */}
        {error && (
          <Alert
            color="red"
            radius="md"
            icon={<AlertCircle size={18} />}
            title="Failed to save"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">

            {/* ── TIMELINE ── */}
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="orange" radius="md" size="sm">
                  <Calendar size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Project Timeline
                </span>
              </Group>
              <Group grow>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Pick start date"
                  radius="md"
                  size="sm"
                  valueFormat="YYYY-MM-DD"
                  value={form.values.startDate!}
                  onChange={(date) =>
                    form.setFieldValue('startDate', date! )
                  }
                  error={form.errors.startDate}
                />
                <DatePickerInput
                  label="End Date"
                  placeholder="Pick end date"
                  radius="md"
                  size="sm"
                  valueFormat="YYYY-MM-DD"
                  value={form.values.endDate}
                  onChange={(date) =>
                    form.setFieldValue('endDate', date!)
                  }
                  error={form.errors.endDate}
                />
              </Group>
            </Stack>

            {/* ── TECHNOLOGIES ── */}
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="teal" radius="md" size="sm">
                  <CheckCircle size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Technologies Used
                </span>
              </Group>
              <TagsInput
                label="Technologies"
                placeholder="Type a technology and press Enter"
                radius="md"
                size="sm"
                maxTags={5}
                {...form.getInputProps('technologies')}
              />
              {form.values.technologies.length > 0 && (
                <Group gap="xs" wrap="wrap">
                  {form.values.technologies.map((tech) => (
                    <Badge key={tech} variant="light" color="indigo" radius="md" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </Group>
              )}
            </Stack>

            <Divider />

            {/* ── PROBLEM ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="red" radius="md" size="sm">
                  <Layers size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  The Problem
                </span>
              </Group>
              <Textarea
                placeholder="Describe the problem this project solved (100–1000 characters)..."
                radius="md"
                size="sm"
                minRows={5}
                autosize
                {...form.getInputProps('problem')}
              />
              <p className="text-right text-xs text-slate-400">
                {form.values.problem.length} / 1000
              </p>
            </Stack>

            {/* ── SOLUTION ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="teal" radius="md" size="sm">
                  <CheckCircle size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  The Solution
                </span>
              </Group>
              <Textarea
                placeholder="Describe the solution you designed (100–1000 characters)..."
                radius="md"
                size="sm"
                minRows={5}
                autosize
                {...form.getInputProps('solution')}
              />
              <p className="text-right text-xs text-slate-400">
                {form.values.solution.length} / 1000
              </p>
            </Stack>

            {/* ── IMPLEMENTATION ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="md" size="sm">
                  <BookOpen size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Implementation
                </span>
              </Group>
              <Textarea
                placeholder="Explain how you implemented the solution (100–1000 characters)..."
                radius="md"
                size="sm"
                minRows={5}
                autosize
                {...form.getInputProps('implementation')}
              />
              <p className="text-right text-xs text-slate-400">
                {form.values.implementation.length} / 1000
              </p>
            </Stack>

            {/* ── OUTCOMES ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="green" radius="md" size="sm">
                  <CheckCircle size={14} />
                </ThemeIcon>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Outcomes
                </span>
              </Group>
              <Textarea
                placeholder="What were the results and outcomes? (100–1000 characters)..."
                radius="md"
                size="sm"
                minRows={5}
                autosize
                {...form.getInputProps('outcomes')}
              />
              <p className="text-right text-xs text-slate-400">
                {form.values.outcomes.length} / 1000
              </p>
            </Stack>

            {/* ── ACTIONS ── */}
            <Group justify="space-between" mt="xs">
              <Button
                type="button"
                variant="light"
                color="red"
                radius="md"
                size="sm"
                leftSection={<X size={16} />}
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                radius="md"
                size="sm"
                color="indigo"
                leftSection={<Save size={16} />}
                loading={isSubmitting}
              >
                Save Case Study
              </Button>
            </Group>

          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}