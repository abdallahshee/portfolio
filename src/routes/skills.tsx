import { Button, Card, Paper, ThemeIcon, SimpleGrid } from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Mail, ShoppingCart, GraduationCap, CalendarClock, Globe, Cpu, Plug, FolderKanban,
  CheckCircle, MonitorSmartphone, Server, Database, GitBranch,
  Code2,
} from 'lucide-react'

export const Route = createFileRoute('/skills')({
  component: ServicesPage,
})

const CORE_SKILLS = {
  Frontend: {
    color: "#3B82F6",
    icon: MonitorSmartphone,
    skills: ["React 19", "Next.js 16", "Mantine UI", "Tailwind CSS"],
  },

  Languages: {
    color: "#EAB308",
    icon: Code2,
    skills: ["TypeScript", "Python", "Java", "JavaScript"],
  },

  Backend: {
    color: "#22C55E",
    icon: Server,
    skills: ["Next.js 16", "Express.js", "Spring Boot", "TanStack Start"],
  },

  Database: {
    color: "#A855F7",
    icon: Database,
    skills: ["PostgreSQL", "Drizzle ORM", "MongoDB", "Mongoose"],
  },

  DevOps: {
    color: "#F97316",
    icon: GitBranch,
    skills: [
      "Git",
      "CI/CD Pipelines",
      "Docker & Containerization",
      "Infrastructure as Code (AWS CDK)",
    ],
  },
};

const EXPERIENCE_AREAS = [
  { icon: <ShoppingCart size={24} />, title: 'E-Commerce Platforms', desc: 'Built full-featured online stores with product management, cart, checkout, payments (M-Pesa, Stripe), order tracking, inventory control, and admin dashboards.', color: 'orange' },
  { icon: <GraduationCap size={24} />, title: 'School Management Systems', desc: 'Built comprehensive platforms for schools and colleges — student enrollment, fee management, timetabling, attendance tracking, exam results, teacher portals, and parent communication dashboards.', color: 'violet' },
  { icon: <CalendarClock size={24} />, title: 'Booking & Scheduling Apps', desc: 'Built smart appointment and reservation systems for clinics, salons, hotels, and service businesses — with calendar sync, automated reminders, staff scheduling, and online payments.', color: 'cyan' },
  { icon: <Globe size={24} />, title: 'Portals & SaaS Products', desc: 'Built multi-tenant SaaS products and web portals with role-based access control, subscription billing, onboarding flows, usage analytics, and scalable multi-organization architecture.', color: 'indigo' },
  { icon: <Cpu size={24} />, title: 'Custom Software Solutions', desc: 'Designed and built bespoke web applications around complex, non-standard workflows — from process automation to internal tooling.', color: 'grape' },
  { icon: <Plug size={24} />, title: 'API & System Integrations', desc: 'Integrated third-party services like payment gateways (M-Pesa, Stripe), SMS/email providers, CRMs, and accounting tools — ensuring reliable data flow between systems.', color: 'blue' },
]

function ServicesPage() {
  const router = useRouter()

  return (
    <div className="max-w-full space-y-10 px-0 py-6 sm:space-y-12 sm:py-8 md:space-y-16 md:py-10">
      {/* HERO */}
      <section className="grid items-start gap-10 sm:gap-12">
        <div className="lg:gap-14">
          <div className="flex w-full flex-col gap-5 lg:border-b-0 lg:pb-0">
            <h1 className="heading">What I Bring to a Team</h1>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I'm a full-stack software developer who designs, builds, and ships production systems
              across e-commerce, education, SaaS, and business automation — always starting from a
              clear understanding of the problem, writing clean, maintainable code, and following
              through to a solid handover, whether I'm working solo or as part of a team. Here's a
              closer look at the domains I've built in, and the engineering principles behind each one.
            </p>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" className="pt-4">
              {[
                { title: "Scalable Systems", desc: "I design systems to grow smoothly with increasing users, data, and complexity." },
                { title: "Impact-Driven", desc: "I build with the underlying business problem in mind, not just the ticket in front of me." },
                { title: "Responsive Design", desc: "I build interfaces that work well across desktop, tablet, and mobile from day one." },
                { title: "Secure by Default", desc: "I follow modern security practices and reliable data protection standards as a baseline, not an afterthought." },
              ].map((card) => (
                <Paper
                  key={card.title}
                  withBorder
                  radius="md"
                  p="lg"
                  className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.desc}</p>
                  </div>
                </Paper>
              ))}
            </SimpleGrid>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="space-y-6">
        <div>
          <h2 className="title2">Tech Stack & Technologies</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            These are some of the core technologies I use to design, build, and deploy modern software.
            While they don't represent my complete skill set, they reflect the tools I rely on most to
            deliver scalable, secure, and maintainable applications. I continuously expand my expertise
            by learning new technologies and frameworks, always selecting the right tool for the problem
            rather than following trends, with a strong focus on clean architecture, performance, and
            long-term maintainability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(CORE_SKILLS).map(([category, skills]) => (
            <Paper
              key={category}
              withBorder
              radius="lg"
              p="lg"
              className="border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ThemeIcon
                    size={42}
                    radius="md"
                    variant="light"
                    style={{
                      color: skills.color,
                      backgroundColor: `${skills.color}20`,
                    }}
                  >
                    <skills.icon size={20} />
                  </ThemeIcon>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {category}
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {skills.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <CheckCircle
                        size={14}
                        className="shrink-0"
                        style={{ color: skills.color }}
                      />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </section>

      {/* EXPERIENCE AREAS */}
      <section className="space-y-3">
        <div>
          <h2 className="title2">Hands-On Experience</h2>
          <p className="mb-6 w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            Real systems I've built and shipped — spanning customer-facing applications,
            internal management platforms, and API-driven services. Each one reflects the
            kind of hands-on experience that comes from navigating real architecture,
            trade-offs, and edge cases in production.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {EXPERIENCE_AREAS.map((area) => (
            <Card key={area.title} radius="md" withBorder p="lg" className="group shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-full flex-col gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <ThemeIcon
                    variant="light"
                    color={area.color}
                    radius="md"
                    size={42}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                  >
                    {area.icon}
                  </ThemeIcon>
                  <p className="min-w-0 font-bold text-slate-900 dark:text-slate-50">{area.title}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">{area.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto w-full scroll-mt-20">
        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 via-blue-50 to-cyan-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900/40 dark:via-slate-800/40 dark:to-slate-900/40 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-center text-transparent">
              Looking for a Developer Like Me?
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
              I'm actively seeking full-stack software developer opportunities where I
              can contribute to building scalable, user-focused applications. If
              you're hiring, growing a team, or working on an exciting project, I'd
              love to discuss how my skills and experience can add value.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <div className="w-full sm:w-[220px]">
                <Button
                  size="md"
                  radius="md"
                  color="orange"
                  fullWidth
                  leftSection={<Mail size={18} />}
                  onClick={() => router.navigate({ to: '/connect' })}
                >
                  Let's Connect
                </Button>
              </div>

              <Link
                to="/projects"
                className="w-full sm:w-[220px]"
              >
                <Button
                  variant="outline"
                  color="blue"
                  radius="md"
                  size="md"
                  fullWidth
                  leftSection={<FolderKanban size={18} />}
                >
                  Explore My Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}