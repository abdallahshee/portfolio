import ServiceComponent from '@/components/ServiceComponent'
import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Avatar,
  Timeline,
} from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Mail,
  ShoppingCart,
  GraduationCap,
  BarChart3,
  CalendarClock,
  Globe,
  Cpu,
  Wallet,
  MessageSquare,
  Search,
  Pencil,
  Code2,
  Rocket,
  HeartHandshake,
  Quote,
  FolderKanban,
  Lightbulb,
  Plug,
  Workflow,
  Home,
} from 'lucide-react'
export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

const SERVICES = [
  {
    icon: <ShoppingCart size={24} />,
    title: 'E-Commerce Platforms',
    desc: 'Full-featured online stores with product management, cart, checkout, payments (M-Pesa, Stripe), order tracking, inventory control, and admin dashboards — built to convert visitors into customers.',
    color: 'orange',

  },
  {
    icon: <GraduationCap size={24} />,
    title: 'School Management Systems',
    desc: 'Comprehensive platforms for schools and colleges — student enrollment, fee management, timetabling, attendance tracking, exam results, teacher portals, and parent communication dashboards.',
    color: 'violet',

  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Business & Inventory Systems',
    desc: 'Custom ERP-lite solutions for SMEs — stock management, purchase orders, supplier tracking, sales reporting, and real-time business insights that help you make faster, smarter decisions.',
    color: 'blue',

  },
  {
    icon: <CalendarClock size={24} />,
    title: 'Booking & Scheduling Apps',
    desc: 'Smart appointment and reservation systems for clinics, salons, hotels, and service businesses — with calendar sync, automated reminders, staff scheduling, and online payments.',
    color: 'cyan',

  },
  {
    icon: <Wallet size={24} />,
    title: 'Finance & Savings Platforms',
    desc: 'SACCO, chama, and microfinance platforms with member management, contribution tracking, loan applications, repayment schedules, guarantor management, and financial reporting.',
    color: 'green',

  },
  {
    icon: <Globe size={24} />,
    title: 'Portals & SaaS Products',
    desc: 'Multi-tenant SaaS products and web portals with role-based access control, subscription billing, onboarding flows, usage analytics, and scalable multi-organization architecture.',
    color: 'indigo',

  },
  {
    icon: <MessageSquare size={24} />,
    title: 'HR & Payroll Systems',
    desc: 'Employee management platforms covering onboarding, leave requests, payroll processing, payslip generation, performance reviews, and department reporting for growing teams.',
    color: 'pink',

  },
  {
    icon: <Cpu size={24} />,
    title: 'Custom Software Solutions',
    desc: 'Bespoke web applications built around your unique workflows. If you have a complex process to automate, a niche product idea, or an internal tool that needs building — I can design and deliver it.',
    color: 'grape',

  },
  {
    icon: <Plug size={24} />,
    title: 'API & System Integrations',
    desc: 'Reliable integration with third-party services like payment gateways (M-Pesa, Stripe), SMS/email providers, CRMs, accounting tools, and APIs — ensuring seamless data flow and communication between your systems.',
    color: 'blue',
  },
  {
    icon: <Workflow size={24} />,
    title: 'Workflow Automation Systems',
    desc: 'Automation of repetitive business processes using custom workflows, triggers, and background jobs — reducing manual work, minimizing errors, and improving operational efficiency across your organization.',
    color: 'teal',
  },

]

const PROCESS = [
  {
    icon: <Search size={18} />,
    title: 'Discovery & Scoping',
    desc: 'We start with a detailed conversation about your goals, users, and requirements. I map out the system, define scope, and propose a clear technical approach before any code is written.',
    color: 'indigo',
  },
  {
    icon: <Pencil size={18} />,
    title: 'Design & Architecture',
    desc: 'I design the database schema, system architecture, and UI wireframes. This stage ensures we agree on structure and flow before building — saving time and rework down the line.',
    color: 'blue',
  },
  {
    icon: <Code2 size={18} />,
    title: 'Development & Iteration',
    desc: 'I build in focused sprints with regular check-ins and previews. You get visibility throughout — not just at the end. Feedback is incorporated continuously.',
    color: 'teal',
  },
  {
    icon: <Rocket size={18} />,
    title: 'Testing & Deployment',
    desc: 'The product is thoroughly tested, optimized for performance, and deployed to production with proper CI/CD pipelines, environment config, and monitoring.',
    color: 'orange',
  },
  {
    icon: <HeartHandshake size={18} />,
    title: 'Handover & Support',
    desc: 'You receive full documentation, source code access, and a handover session. Post-launch support is available to ensure everything runs smoothly.',
    color: 'green',
  },
]

const TECH_STACK = [
  { name: 'TypeScript', category: 'Language', color: 'blue' },
  { name: 'React 19', category: 'Frontend', color: 'cyan' },
  { name: 'TanStack Start', category: 'Framework', color: 'orange' },
  { name: 'TanStack Query', category: 'Data Fetching', color: 'red' },
  { name: 'TanStack Router', category: 'Routing', color: 'orange' },
  { name: 'Tailwind CSS', category: 'Styling', color: 'teal' },
  { name: 'Mantine UI', category: 'Component Library', color: 'blue' },
  { name: 'PostgreSQL', category: 'Database', color: 'blue' },
  { name: 'Drizzle ORM', category: 'ORM', color: 'green' },
  { name: 'Supabase', category: 'Backend-as-a-Service', color: 'green' },
  { name: 'Python', category: 'Language', color: 'yellow' },
  { name: 'Zod', category: 'Validation', color: 'violet' },
  { name: 'Vercel', category: 'Deployment', color: 'gray' },
  { name: 'Git', category: 'Version Control', color: 'orange' },

]

const TESTIMONIALS = [
  {
    name: 'James Mwangi',
    role: 'Founder, LetsRent Kenya',
    avatar: 'JM',
    color: 'teal',
    quote:
      'Abdallah built our entire rental management platform from scratch. He understood the local context — M-Pesa integration, tenant communication flows — and delivered a system our team actually loves using.',
  },
  {
    name: 'Amina Hassan',
    role: 'Director, Greenfield Academy',
    avatar: 'AH',
    color: 'violet',
    quote:
      'The school system he built transformed how we handle fees, attendance, and parent communication. What used to take days now takes minutes. Highly professional, communicates clearly, and delivers on time.',
  },
  {
    name: 'Brian Otieno',
    role: 'CEO, TradeTrack SME',
    avatar: 'BO',
    color: 'blue',
    quote:
      'We needed a custom inventory and sales system. Abdallah scoped the project clearly, kept us in the loop throughout, and the final product exceeded our expectations. Would absolutely work with him again.',
  },
]

function ServicesPage() {
  const router = useRouter()

  return (
    <Container size="xl" className="max-w-full space-y-10 px-0 py-6 sm:space-y-12 sm:py-8 md:space-y-16 md:py-10">

      {/* ── HERO ── */}
      <section className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr] lg:gap-14">
        <Stack gap="md" className="min-w-0">
          <Stack gap="md" className="min-w-0">
            <div className="heading">
              Software solutions for real business needs
            </div>

            <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I help businesses and startups turn ideas into reliable, production-ready
              systems — from management platforms and SaaS products to tailored web
              applications built for performance, scalability, and long-term growth.
            </p>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            <Paper withBorder radius="md" p="md" className="min-w-0 shadow-sm">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Scalable Systems</div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Designed to grow with your users and workflows.
              </p>
            </Paper>

            <Paper withBorder radius="md" p="md" className="min-w-0 shadow-sm">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Clean Architecture</div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Maintainable codebases built for long-term success.
              </p>
            </Paper>

            <Paper withBorder radius="md" p="md" className="min-w-0 shadow-sm">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Business Focused</div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Solutions aligned with real operational needs.
              </p>
            </Paper>
          </SimpleGrid>

          <Group gap="sm" wrap="wrap">
            <Link to="/contact">
              <Button
                // color="green"
                radius="md"
                variant="filled"
                size="sm"
                leftSection={<Lightbulb size={16} />}
              >
                Let's Discuss Your Idea
              </Button>
            </Link>

            <Button
              variant="outline"
              color="indigo"
              radius="md"
              size="sm"
              leftSection={<Home size={16}/>}
              onClick={() => router.navigate({ to: "/" })}
            >
              Back to Home
            </Button>
          </Group>
        </Stack>

        <div className="flex items-stretch justify-center lg:justify-end">
          <div className="mx-auto w-full max-w-full sm:max-w-[26rem] lg:mx-0" style={{ isolation: 'isolate' }}>
            <ServiceComponent />
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="space-y-3">
        <div>
          <div className="title2">Service Areas</div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            I design and build software solutions tailored precisely to your requirements — with a focus on performance, scalability, and long-term reliability.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {SERVICES.map((service) => (
            <Card
              key={service.title}
              radius="md"
              withBorder
              p="lg"
              className="group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <Stack gap="md" h="100%">
                <Group className="min-w-0 items-start gap-3" wrap="nowrap">
                  <ThemeIcon
                    variant="light"
                    color={service.color}
                    radius="md"
                    size={42}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                  >
                    {service.icon}
                  </ThemeIcon>
                  <div className="min-w-0 font-bold text-slate-900 dark:text-slate-50">{service.title}</div>
                </Group>
                <Stack gap={4} className="min-w-0 flex-1">

                  <p className="text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">{service.desc}</p>
                </Stack>

              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* ── HOW I WORK ── */}
      <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* LEFT */}
        <section className="space-y-6 border-b-4 border-blue-500 pb-6 sm:space-y-8 lg:border-b-0 lg:border-r-4 lg:pb-0 lg:pr-6">
          <div className="min-w-0">
            <div className="title2">
              How I Work
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
              A clear, collaborative process from first conversation to final handover — so you always
              know what&apos;s happening and what comes next.
            </p>
          </div>

          <Timeline active={4} bulletSize={40} lineWidth={2} color="indigo">
            {PROCESS.map((step, i) => (
              <Timeline.Item
                key={step.title}
                bullet={
                  <ThemeIcon size={40} radius="xl" variant="filled" color={step.color}>
                    {step.icon}
                  </ThemeIcon>
                }
                title={
                  <div className="mb-2 text-base font-bold text-slate-900 dark:text-slate-50">
                    {i + 1}. {step.title}
                  </div>
                }
              >
                <p className="mb-6 text-sm leading-7 text-slate-600 sm:mb-8 dark:text-slate-400">
                  {step.desc}
                </p>
              </Timeline.Item>
            ))}
          </Timeline>
        </section>

        {/* RIGHT */}
        <section className="space-y-6 ">
          <div>
            <div className="title2">
              Tools & Tech Stack
            </div>
            <p className="mt-2 max-w-md text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
              I use a modern, production-proven stack chosen for reliability, developer experience,
              and long-term maintainability.
            </p>
          </div>

          <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} spacing="sm">
            {TECH_STACK.map((tech) => (
              <Paper
                key={tech.name}
                radius="md"
                withBorder
                p="xs"
                className="group h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-1">
                  <div className="flex items-center justify-center w-4 h-4 text-blue-500 text-2xl font-bold">
                    •
                  </div>
                  <span className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-50">
                    {tech.name}
                  </span>
                </div>
              </Paper>
            ))}
          </SimpleGrid>
        </section>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="space-y-6">
        <div>
          <div className="title2">What Clients Say</div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            Relationships built on clear communication, reliable delivery, and software that actually works.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} radius="lg" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <ThemeIcon variant="light" color="pink" radius="md" size={36} className="opacity-60">
                  <Quote size={18} />
                </ThemeIcon>

                <p className="text-sm leading-7 text-slate-600 italic sm:text-base dark:text-slate-400">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <Group gap="sm" wrap="nowrap" className="min-w-0">
                  <Avatar color={t.color} radius="md" size={42} className="shrink-0">{t.avatar}</Avatar>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-50">{t.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t.role}</div>
                  </div>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </section>
      {/* ── CTA ── */}
      <section id="contact" className="mx-auto max-w-3xl scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          
          className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="md">
            <div className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Ready to Build Your Product?
            </div>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              Tell me about your project — what you need, your timeline, and your budget.
              I&apos;ll get back to you within 24 hours with my thoughts and next steps.
            </p>
            <Group justify="center" mt="md" wrap="wrap" gap="sm">
              <Button
                variant="filled"
                color="blue"
                size="sm"
                radius="md"
                leftSection={<Mail size={18} />}
                onClick={() => router.navigate({ to: '/contact' })}
              >
                Let's Get Started
              </Button>
              <Link to="/projects">
                <Button variant="outline" color="blue" size="sm" radius="md" leftSection={<FolderKanban size={18} />}>
                  Explore My Projects
                </Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </section>

    </Container>
  )
}