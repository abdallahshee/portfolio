import {
  Badge,
  Button,
  Card,
  Container,
  Text,
  Title,
  Group,
  Stack,
  Divider,
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
  Building2,
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
  ShieldCheck,
  FolderKanban,
  Lightbulb,
  Plug,
  Workflow,
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
    icon: <Building2 size={24} />,
    title: 'Rental Management Software',
    desc: 'End-to-end property and rental systems covering tenant onboarding, lease management, rent collection, maintenance request tracking, unit availability, and detailed landlord reporting.',
    color: 'teal',

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
    title: 'API Integrations & System Connectivity',
    desc: 'Seamless integration with third-party services such as payment gateways (M-Pesa, Stripe), SMS/email providers, CRMs, accounting tools, and external APIs — enabling your systems to communicate, automate workflows, and scale efficiently.',
    color: 'blue',
  },
  {
    icon: <Workflow size={24} />,
    title: 'Workflow Automation Systems',
    desc: 'Automation of repetitive business processes using custom workflows, triggers, and background jobs — reducing manual work, minimizing errors, and improving operational efficiency across your organization.',
    color: 'teal',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Authentication & Access Systems',
    desc: 'Secure authentication systems with role-based access control, multi-tenant permissions, session management, and integrations with OAuth providers — designed to protect data while enabling seamless user experiences.',
    color: 'red',
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
  { name: 'Tailwind CSS', category: 'Styling', color: 'teal' },
  { name: 'PostgreSQL', category: 'Database', color: 'blue' },
  { name: 'Drizzle ORM', category: 'ORM', color: 'green' },
  { name: 'Supabase', category: 'Backend-as-a-Service', color: 'green' },
  { name: 'Zod', category: 'Validation', color: 'violet' },
  { name: 'Vercel', category: 'Deployment', color: 'gray' },
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
    <Container size="xl" className="space-y-16 py-10">

      {/* ── HERO ── */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Stack gap="xl" className="max-w-3xl">
          <Stack gap="lg">
            <Title className="heading">
              Software solutions for real business needs

            </Title>

            <Text size="lg" c="dimmed" className="max-w-2xl leading-8">
              I help businesses and startups turn ideas into reliable, production-ready
              systems — from management platforms and SaaS products to tailored web
              applications built for performance, scalability, and long-term growth.
            </Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" className="pt-2">
            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Text fw={700} size="sm">Scalable Systems</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Designed to grow with your users and workflows.
              </Text>
            </Paper>

            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Text fw={700} size="sm">Clean Architecture</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Maintainable codebases built for long-term success.
              </Text>
            </Paper>

            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Text fw={700} size="sm">Business Focused</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Solutions aligned with real operational needs.
              </Text>
            </Paper>
          </SimpleGrid>
          <Group gap="sm" className="pt-2">
            <Link to="/contact">
              <Button
                color="green"
                radius="md"
                variant='filled'
               size="sm"
                leftSection={<Lightbulb size={16} color='yellow' />}
              >
                Discuss Your Idea with Me
              </Button>
            </Link>

            <Button
              variant="outline"
              color="indigo"
              radius="md"
              size="sm"
              onClick={() => router.navigate({ to: "/" })}
            >
              Back to Home
            </Button>
          </Group>


        </Stack>

<div className="flex justify-center lg:justify-end">
  <Paper
    radius={8}
    shadow="none"
    className="relative w-full max-w-[26rem] overflow-hidden bg-white p-0 dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
  >
    <div className="relative h-[240px] overflow-hidden sm:h-[280px] lg:h-[320px]">
      <img
      src="https://images.pexels.com/photos/6424585/pexels-photo-6424585.jpeg"
        alt="Distributed software system with multiple connected services"
        className="block h-full w-full object-cover"
      />

      {/* overlays */}
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-transparent to-teal-500/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.30),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.22),transparent_32%)]" />

      {/* animated connection lines */}
      <div className="absolute inset-0 opacity-50">
        <div className="flow-line absolute left-[18%] top-[22%] h-px w-[30%] rotate-[18deg] bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
        <div className="flow-line flow-delay-1 absolute left-[42%] top-[28%] h-px w-[24%] rotate-[-22deg] bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        <div className="flow-line flow-delay-2 absolute left-[28%] top-[56%] h-px w-[34%] rotate-[10deg] bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
        <div className="flow-line flow-delay-3 absolute left-[54%] top-[64%] h-px w-[18%] rotate-[-28deg] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </div>

      {/* floating system nodes */}
     {/* floating system nodes */}
<div className="node-float absolute left-[16%] top-[20%] h-4 w-4 rounded-full bg-indigo-400 shadow-[0_0_26px_rgba(99,102,241,0.95)]" />

<div className="node-float-slow absolute left-[46%] top-[26%] h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.95)]" />

<div className="node-float-delayed absolute left-[68%] top-[18%] h-4 w-4 rounded-full bg-teal-300 shadow-[0_0_26px_rgba(45,212,191,0.95)]" />

<div className="node-float-slow-delayed absolute left-[30%] top-[58%] h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_26px_rgba(147,197,253,0.95)]" />

<div className="node-float absolute left-[62%] top-[62%] h-3.5 w-3.5 rounded-full bg-indigo-300 shadow-[0_0_24px_rgba(165,180,252,0.95)]" />

{/* existing extra nodes */}
<div className="node-float-extra absolute left-[78%] top-[42%] h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_22px_rgba(125,211,252,0.9)]" />

<div className="node-float-slow absolute left-[22%] top-[72%] h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.9)]" />

{/* NEW NODES (4 added) */}
<div className="node-float-delayed absolute left-[10%] top-[50%] h-3.5 w-3.5 rounded-full bg-indigo-400 shadow-[0_0_22px_rgba(99,102,241,0.9)]" />

<div className="node-float-slow absolute left-[85%] top-[20%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />

<div className="node-float-extra absolute left-[50%] top-[10%] h-3.5 w-3.5 rounded-full bg-teal-300 shadow-[0_0_22px_rgba(45,212,191,0.9)]" />

<div className="node-float-slow-delayed absolute left-[70%] top-[75%] h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.9)]" />
    </div>
  </Paper>
</div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="space-y-4">
        <div>
          <Title order={2} className="text-3xl font-bold">Service Areas</Title>
          <Text c="dimmed" mt={4} className="max-w-2xl">
            I design and build software solutions tailored precisely to your requirements — with a focus on performance, scalability, and long-term reliability.
          </Text>
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
                <Group className='flex '>
                  <ThemeIcon
                    variant="light"
                    color={service.color}
                    radius="md"
                    size={42}
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    {service.icon}
                  </ThemeIcon>
                  <Text fw={700}>{service.title}</Text>
                </Group>
                <Stack gap={4} className="flex-1">

                  <Text size="md" c="dimmed" className="leading-6">{service.desc}</Text>
                </Stack>

              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* ── HOW I WORK ── */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* LEFT */}
        <section className="space-y-8 border-r-4 border-blue-500 pr-4 lg:pr-6">
          <div>
            <Title order={2} className="text-3xl font-bold">
              How I Work
            </Title>
            <Text c="dimmed" mt={4} className="max-w-2xl leading-7">
              A clear, collaborative process from first conversation to final handover — so you always
              know what&apos;s happening and what comes next.
            </Text>
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
                  <Text fw={700} size="md" mb={6}>
                    {i + 1}. {step.title}
                  </Text>
                }
              >
                <Text size="sm" c="dimmed" className="mb-8 leading-7">
                  {step.desc}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </section>

        {/* RIGHT */}
        <section className="space-y-6 ">
          <div>
            <Title order={2} className="text-3xl font-bold">
              Tools & Tech Stack
            </Title>
            <Text c="dimmed" mt={4} className="max-w-md leading-7">
              I use a modern, production-proven stack chosen for reliability, developer experience,
              and long-term maintainability.
            </Text>
          </div>

          <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} spacing="md">
          {TECH_STACK.map((tech) => (
  <Paper
    key={tech.name}
    radius="md"
    withBorder
    p="md"
    className="group h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div className="flex items-center gap-1">
      
      {/* icon / bullet */}
      <div className="flex items-center justify-center w-6 h-6 text-blue-500 text-2xl font-bold">
        •
      </div>

      {/* text */}
      <Text fw={600} size="sm" className="leading-none">
        {tech.name}
      </Text>

    </div>
  </Paper>
))}
          </SimpleGrid>
        </section>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="space-y-6">
        <div>

          <Title order={2} className="text-3xl font-bold">What Clients Say</Title>
          <Text c="dimmed" mt={4} className="max-w-2xl">
            Relationships built on clear communication, reliable delivery, and software that actually works.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} radius="lg" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <ThemeIcon variant="light" color="pink" radius="md" size={36} className="opacity-60">
                  <Quote size={18} />
                </ThemeIcon>

                <Text size="md" c="dimmed" className="leading-7 italic">
                  "{t.quote}"
                </Text>

                <Group gap="sm">
                  <Avatar color={t.color} radius="md" size={42}>{t.avatar}</Avatar>
                  <div>
                    <Text fw={700} size="md">{t.name}</Text>
                    <Text size="sm" c="dimmed">{t.role}</Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </section>



      {/* ── CTA ── */}
      <section id="contact" className="mx-auto max-2xl: scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-gradient-to-br from-white via-indigo-50 to-blue-50 px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="md">
            <Title order={2} className="text-3xl font-bold bg-gradient-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Ready to Build Your Product?
            </Title>
            <Text c="dimmed" size="lg" className="max-w-2xl leading-8">
              Tell me about your project — what you need, your timeline, and your budget.
              I&apos;ll get back to you within 24 hours with my thoughts and next steps.
            </Text>
            <Group justify="center" mt="md">
              <Button
                variant="filled"
                color="yellow"
               size="sm"
                radius="md"
                leftSection={<Mail size={18} />}
                onClick={() => router.navigate({ to: '/contact' })}
              >
                Let's Get Started
              </Button>
              <Link to="/projects">
                <Button variant="gradient" color="blue"  size="sm" radius="md" leftSection={<FolderKanban size={18} />}>
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