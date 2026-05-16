
import { getTestimonialQueryOptions } from '@/db/queries/testimonial.queries'
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
  Divider,
  Skeleton,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import '@mantine/carousel/styles.css'
import { Suspense, useRef } from 'react'
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
  Quote,
  FolderKanban,
  Plug,
  Workflow,
} from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { Testimonial } from '@/db/validations/testimonial.types'
import { useMediaQuery } from '@mantine/hooks'


const test_samples: Testimonial[] = [
  {
    id: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    quote: 'Abdallah built our rental platform from scratch. He understood local context — M-Pesa integration, tenant flows — and delivered a system our team actually loves using every day.',
    authorFirstname: 'James',
    authorLastname: 'Mwangi',
    authorTitle: 'Founder',
    company: 'LetsRent Kenya',
  },
  {
    id: '2',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    quote: 'The school system he built changed how we handle fees, attendance, and parent communication. What took days now takes minutes. Professional, clear communicator, and always on time.',
    authorFirstname: 'Amina',
    authorLastname: 'Hassan',
    authorTitle: 'Director',
    company: 'Greenfield',
  },
  {
    id: '3',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    quote: 'We needed a custom inventory and sales system. Abdallah scoped it clearly, kept us informed throughout, and the final product exceeded our expectations. Would absolutely work with him again.',
    authorFirstname: 'Brian',
    authorLastname: 'Otieno',
    authorTitle: 'CEO',
    company: 'TradeTrack SME',
  },

  {
    id: '5',
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-05-18'),
    quote: 'Our booking system went live fast. Calendar sync, automated reminders, and online payments all work flawlessly. Our front desk team adapted instantly — the system just makes sense.',
    authorFirstname: 'David',
    authorLastname: 'Njoroge',
    authorTitle: 'MD',
    company: 'SwiftBook Hotels',
  },

]

export const Route = createFileRoute('/services')({
  // loader: async ({ context }) => {
  //   await context.queryClient.prefetchQuery(getTestimonialQueryOptions())
  // },
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


// ── TESTIMONIALS SKELETON ──
function TestimonialsSkeleton() {
  return (
    <div
      style={{ paddingLeft: '24px', paddingRight: '24px' }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} radius="lg" withBorder p="xl" className="shadow-sm" style={{ height: '280px' }}>
          <Stack gap="md" h="100%" style={{ overflow: 'hidden' }}>
            {/* Quote icon */}
            <Skeleton height={34} width={34} radius="md" />

            {/* Quote lines — 5 lines to match WebkitLineClamp */}
            <Stack gap="sm" className="flex-1">
              <Skeleton height={12} radius="md" />
              <Skeleton height={12} width="95%" radius="md" />
              <Skeleton height={12} width="90%" radius="md" />
              <Skeleton height={12} width="85%" radius="md" />
              <Skeleton height={12} width="60%" radius="md" />
            </Stack>

            {/* Author */}
            <Group gap="sm" wrap="nowrap" className="shrink-0">
              <Skeleton height={42} width={42} radius="md" />
              <Stack gap={6}>
                <Skeleton height={12} width={100} radius="md" />
                <Skeleton height={10} width={70} radius="md" />
              </Stack>
            </Group>
          </Stack>
        </Card>
      ))}
    </div>
  )
}
interface CarouselProps {
  testimonials: Testimonial[]
}
// ── TESTIMONIALS CAROUSEL ──
function TestimonialsCarousel({ testimonials }: CarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 4000 }))
  const isSm = useMediaQuery('(min-width: 640px)')
  const itemsPerSlide = isSm ? 2 : 1

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">

        <div className="title2 text-slate-700 dark:text-slate-200">
          No testimonials yet
        </div>
        <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
          Client feedback will appear here once projects have been completed and reviewed.
        </p>
      </div>
    )
  }

  if (testimonials.length === 1) {
    const t = testimonials[0]
    return (
      <Card
        key={t.id}
        radius="lg"
        withBorder
        p="xl"
        className="shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        style={{ height: '280px' }}
      >
        <Stack gap="md" h="100%" style={{ overflow: 'hidden' }}>
          <ThemeIcon variant="light" color="pink" radius="md" size={34} className="opacity-70">
            <Quote size={12} />
          </ThemeIcon>

          <p className="flex-1 text-sm leading-7 italic text-slate-600 sm:text-base dark:text-slate-400"
            style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>

          <Group mt="auto" gap="sm" wrap="nowrap" className="min-w-0 items-center shrink-0">
            <Avatar color="blue" radius="md" size={42} className="shrink-0">
              {`${t.authorFirstname?.[0] ?? ''}${t.authorLastname?.[0] ?? ''}`}
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate dark:text-slate-50">
                {t.authorFirstname} {t.authorLastname}
              </div>
              <div className="text-xs text-slate-500 truncate dark:text-slate-400">
                {t.authorTitle}
                {t.company && ` • ${t.company}`}
              </div>
            </div>
          </Group>
        </Stack>
      </Card>
    )
  }

  return (
    <Carousel
      // withIndicators
      slideSize="100%"
      slideGap="md"
      emblaOptions={{ loop: true, align: 'start' }}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      previousControlProps={{ style: { marginLeft: '-8px' } }}
      nextControlProps={{ style: { marginRight: '-8px' } }}
      styles={{
        root: { paddingLeft: '24px', paddingRight: '24px' },
        indicator: { background: 'var(--mantine-color-indigo-4)' },
        control: {
          border: '1px solid var(--mantine-color-gray-3)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      }}
    >
      {Array.from({ length: Math.ceil(testimonials.length / itemsPerSlide) }).map((_, slideIndex) => (
        <Carousel.Slide key={slideIndex}>
          <div className={`grid gap-4 ${isSm ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {testimonials
              .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
              .map((t) => (
                <Card
                  key={t.id}
                  radius="lg"
                  withBorder
                  p="xl"
                  className="h-full shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Stack gap="md" h="100%">
                    <ThemeIcon variant="light" color="pink" radius="md" size={34} className="opacity-70">
                      <Quote size={12} />
                    </ThemeIcon>

                    <p className="flex-1 text-sm leading-7 italic text-slate-600 sm:text-base dark:text-slate-400">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <Group mt="auto" gap="sm" wrap="nowrap" className="min-w-0 items-center">
                      <Avatar color="blue" radius="md" size={42} className="shrink-0">
                        {`${t.authorFirstname?.[0] ?? ''}${t.authorLastname?.[0] ?? ''}`}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate dark:text-slate-50">
                          {t.authorFirstname} {t.authorLastname}
                        </div>
                        <div className="text-xs text-slate-500 truncate dark:text-slate-400">
                          {t.authorTitle}
                          {t.company && ` • ${t.company}`}
                        </div>
                      </div>
                    </Group>
                  </Stack>
                </Card>
              ))}
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

function ServicesPage() {
  const router = useRouter()

  const { data: testimonials } = useSuspenseQuery(getTestimonialQueryOptions())

  return (
    <div className="max-w-full space-y-10 px-0 py-6 sm:space-y-12 sm:py-8 md:space-y-16 md:py-10">
      {/* ── HERO ── */}
      <section className="grid items-start gap-10 sm:gap-12">
        <div className=" lg:gap-14">

          {/* LEFT */}
          <Stack gap="lg" className="w-full lg:border-b-0 lg:pb-0">

            <div className="heading">
              Services Built For Your Needs
            </div>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I help businesses and startups turn ideas into reliable, production-ready systems — from
              management platforms and SaaS products to tailored web applications built for performance,
              scalability, and long-term growth. Every solution I build is designed with your specific
              goals in mind, ensuring it not only works today but continues to deliver value as your
              business evolves. From the first line of code to final deployment, I take full ownership
              of the process — delivering software that is robust, efficient, and built to last.
            </p>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I design and build software solutions tailored precisely to your requirements, with a
              strong focus on clean architecture, maintainability, and seamless user experience across
              all devices. Whether you need a system built from scratch or an existing product improved
              and scaled, I bring the technical depth and practical thinking to get it done right.
              My goal is simple — to turn your vision into a product that your users love and your
              team can confidently build upon.
            </p>

            {/* FEATURE CARDS */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" className="pt-4">
              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Scalable Systems
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Designed to grow smoothly with your users, workflows, and business
                    operations.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Business Focused
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Solutions tailored to solve real business challenges and improve
                    efficiency.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Responsive Design
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Optimized experiences across desktop, tablet, and mobile devices.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Secure Solutions
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Built using modern security practices and reliable data protection
                    standards.
                  </p>
                </div>
              </Paper>
            </SimpleGrid>

          </Stack>

        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="space-y-3">
        <div>
          <div className="title2">Service Areas</div>
          <p className="w-full text-base mb-6 leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            I offer a range of software development services designed to help businesses solve
            real problems, streamline operations, and grow with confidence. Whether you need a
            customer-facing web application, an internal management system, a scalable SaaS
            platform, or a reliable API powering your product — I build solutions that are
            practical, purposeful, and tailored to the specific challenges your business faces.
            Every service is focused on delivering real value: saving time, reducing complexity,
            improving efficiency, and giving your users an experience they can depend on.
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


      {/* ── TESTIMONIALS ── */}
      <section className="space-y-6">
        <div>
          <div className="title2">What Clients Say</div>
          <p className="w-full text-base mb-6 leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            Every project I work on is built around reliability, performance, and a smooth client experience.
            From business websites and booking systems to dashboards and custom web applications, I focus on
            delivering solutions that solve real problems and create long-term value. The feedback below reflects
            the trust, collaboration, and results I strive to bring to every project through clear communication,
            attention to detail, timely delivery, and clean scalable development.
          </p>
        </div>

        <Suspense fallback={<TestimonialsSkeleton />}>
          {/* <TestimonialsCarousel testimonials={testimonials} /> */}
          <TestimonialsCarousel testimonials={test_samples} />
        </Suspense>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="mx-auto w-full scroll-mt-20">
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
                className="min-w-[200px] justify-center"
                variant="filled"
                color="blue"
                size="sm"
                radius="md"
                leftSection={<Mail size={18} />}
                onClick={() => router.navigate({ to: '/contacts' })}
              >
                Let's Get Started
              </Button>

              <Link to="/projects">
                <Button
                  className="min-w-[200px] justify-center"
                  variant="outline"
                  color="blue"
                  size="sm"
                  radius="md"
                  leftSection={<FolderKanban size={18} />}
                >
                  Explore My Projects
                </Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </section>

    </div>
  )
}