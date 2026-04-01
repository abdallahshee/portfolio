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
  ArrowRight,
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
  { name: 'Tailwind CSS v4', category: 'Styling', color: 'teal' },
  { name: 'PostgreSQL', category: 'Database', color: 'blue' },
  { name: 'Drizzle ORM', category: 'ORM', color: 'green' },
  { name: 'Supabase', category: 'Backend-as-a-Service', color: 'green' },
  { name: 'Zod', category: 'Validation', color: 'violet' },
  { name: 'Vercel / Railway', category: 'Deployment', color: 'gray' },
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
      <section className="space-y-5 max-w-3xl">
      
        <Title className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
          Software I Design{' '}
          <span className="bg-gradient-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            & Deliver
          </span>
        </Title>
        <Text size="lg" c="dimmed" className="leading-8 max-w-2xl">
          I build custom web software for businesses, startups, and institutions across Kenya and beyond.
          Whether it's a management system, a customer-facing product, or a full SaaS platform — I
          take it from idea to production.
        </Text>
        <Group className='mt-3'>
          <Link to="/contact">
            <Button color="teal" radius="xl" size="md" rightSection={<ArrowRight size={16} />}>
              Discuss Your Project
            </Button>
          </Link>
          <Button
            variant="outline"
            color="indigo"
            radius="xl"
            size="md"
            onClick={() => router.navigate({ to: '/' })}
          >
            Back to Home
          </Button>
        </Group>
      </section>

      <Divider />

      {/* ── SERVICES GRID ── */}
      <section className="space-y-6">
        <div>
         
          <Title order={2} className="text-3xl font-bold">Service Areas</Title>
          <Text c="dimmed" mt={4} className="max-w-2xl">
            Each project is custom-built to fit your specific requirements — no templates, no shortcuts.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md:2 }} spacing="md">
          {SERVICES.map((service) => (
            <Card
              key={service.title}
              radius="xl"
              withBorder
              p="lg"
              className="group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <Stack gap="md" h="100%">
                <Group className='flex '>
                <ThemeIcon
                  variant="light"
                  color={service.color}
                  radius="lg"
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

      <Divider />

      {/* ── HOW I WORK ── */}
<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
  <section className="space-y-8">
    <div>

      <Title order={2} className="text-3xl font-bold">
        How I Work
      </Title>
      <Text c="dimmed" mt={4} className="max-w-2xl">
        A clear, collaborative process from first conversation to final handover — so you always
        know what's happening and what comes next.
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
            <Text fw={700} size="md" mb={4}>
              {i + 1}. {step.title}
            </Text>
          }
        >
          <Text size="sm" c="dimmed" className="mb-6 max-w-xl leading-6">
            {step.desc}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  </section>

  <section className="space-y-6 border-l-4 pl-4 border-blue-500">
    <div>

      <Title order={2} className="text-3xl font-bold">
        Tools & Tech Stack
      </Title>
      <Text c="dimmed" mt={4} className="max-w-2xl">
        I use a modern, production-proven stack chosen for reliability, developer experience,
        and long-term maintainability.
      </Text>
    </div>

    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="sm">
      {TECH_STACK.map((tech) => (
        <Paper
          key={tech.name}
          radius="lg"
          withBorder
          p="md"
          className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <Stack gap={4}>
            <Text fw={700} size="sm">
              {tech.name}
            </Text>
        
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  </section>
</div>
  

      {/* ── TECH STACK ── */}
    


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
            <Card key={t.name} radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <ThemeIcon variant="light" color="pink" radius="xl" size={36} className="opacity-60">
                  <Quote size={18} />
                </ThemeIcon>

                <Text size="md" c="dimmed" className="leading-7 italic">
                  "{t.quote}"
                </Text>

                <Group gap="sm">
                  <Avatar color={t.color} radius="xl" size={42}>{t.avatar}</Avatar>
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
      <section className="max-w-4xl mx-auto">
        <Paper
          radius="2xl"
          withBorder
          shadow="sm"
          className="p-8 lg:p-12 text-center bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800"
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
                color="teal"
                size="md"
                radius="xl"
                leftSection={<Mail size={18} />}
                onClick={() => router.navigate({ to: '/contact' })}
              >
                Start a Conversation
              </Button>
              <Link to="/projects">
                <Button variant="outline" color="indigo" size="md" radius="xl" rightSection={<ArrowRight size={16} />}>
                  View My Projects
                </Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </section>

    </Container>
  )
}