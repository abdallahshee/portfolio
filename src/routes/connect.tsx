import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Anchor, Avatar, Button, Card, Divider, List, ThemeIcon, useMantineColorScheme } from "@mantine/core"
import { BookMarked, CheckCircle, Github, Linkedin, Mail, Phone, Users } from "lucide-react"

export const Route = createFileRoute("/connect")({
  component: ContactPage,
})

const WHY_REACH_OUT = [
  "I reply to every message within 24 hours",
  "Open to full-time software developer roles",
  "Available for interviews at short notice",
  "Based in Nairobi, open to relocating within Kenya",
]

const CONTACT_LINKS = [
  {
    icon: <Mail size={20} />,
    label: "abdallahshee664@email.com",
    href: "mailto:abdallahshee664@email.com",
    color: "indigo",
  },
  {
    icon: <Phone size={20} />,
    label: "+254 796 515 302",
    href: "tel:+254796515302",
    color: "teal",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: "+254 796 515 302",
    href: "https://wa.me/254796515302",
    color: "green",
  },
]

/**
 * Renders LinkedIn's official "Profile Badge" widget.
 * The badge script must be injected client-side (it can't sit as a
 * static <script> tag in JSX), and LinkedIn only scans the DOM for
 * `.LI-profile-badge` elements once, on script load — so if this
 * component ever mounts after the script has already loaded once
 * elsewhere on the site, we manually trigger IN.parse() to re-scan.
 */
function LinkedInBadge({ vanity = "abdallahshee" }: { vanity?: string }) {
  useEffect(() => {
    const existing = document.getElementById("linkedin-badge-script")

    if (existing) {
      const w = window as typeof window & { IN?: { parse?: () => void } }
      w.IN?.parse?.()
      return
    }
    const script = document.createElement("script")
    script.id = "linkedin-badge-script"
    script.src = "https://platform.linkedin.com/badges/js/profile.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])


  return (
    <div
      className="LI-profile-badge"
      data-version="v1"
      data-size="large"
      data-locale="en_US"
      data-type="HORIZONTAL"
      data-theme="light"
      data-vanity={vanity}
    />
  )
}

type GitHubProfile = {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
}

/**
 * GitHub has no official embeddable badge widget (unlike LinkedIn), so this
 * fetches the public profile via GitHub's REST API and renders it as a
 * native card matching the rest of the site's design system — including
 * proper dark mode, which an embedded iframe/image badge can't offer.
 */
function GitHubCard({ username = "abdallahshee" }: { username?: string }) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    fetch(`https://api.github.com/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API request failed")
        return res.json()
      })
      .then((data: GitHubProfile) => {
        if (!cancelled) {
          setProfile(data)
          setStatus("ready")
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [username])

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    )
  }

  if (status === "error" || !profile) {
    return (
      <Anchor href={`https://github.com/${username}`} target="_blank" underline="never">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 dark:border-slate-700">
          <ThemeIcon variant="light" color="dark" radius="md" size={44}>
            <Github size={22} />
          </ThemeIcon>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            github.com/{username}
          </span>
        </div>
      </Anchor>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <Avatar
        src={profile.avatar_url}
        alt={profile.login}
        size={56}
        radius="xl"
      />

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {profile.name ?? profile.login}
        </span>

        {profile.bio && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {profile.bio}
          </span>
        )}

        <div className="mt-1 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <BookMarked size={13} />
            {profile.public_repos} repos
          </span>

          <span className="flex items-center gap-1">
            <Users size={13} />
            {profile.followers} followers
          </span>
        </div>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="w-full py-6 sm:py-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl">
          <h1 className="heading">Let's Connect</h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
            I'm actively pursuing Full-Stack Software Developer opportunities and
            enjoy collaborating on meaningful digital products. Whether you're
            hiring, exploring a project idea, or simply want to discuss software
            development, I'd be happy to connect and learn more about your goals.
          </p>
        </div>

        {/* Contact Information + Availability */}
        <Card
          radius="xl"
          withBorder
          className="overflow-hidden p-5 shadow-sm sm:p-6 lg:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            {/* Contact Details */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="title3">Contact Details</h2>
                <Divider color="blue" mt="sm" />
              </div>

              <div className="grid gap-2 sm:grid-cols-1">
                {CONTACT_LINKS.map(({ icon, label, href, color }) => (
                  <Anchor
                    key={href}
                    href={href}
                    target="_blank"
                    underline="never"
                  >
                    <div className="flex h-full items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all duration-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:hover:bg-slate-800">
                      <ThemeIcon
                        variant="light"
                        color={color}
                        radius="md"
                        size={40}
                        className="shrink-0"
                      >
                        {icon}
                      </ThemeIcon>

                      <span className="break-all text-sm font-medium text-slate-700 dark:text-slate-200">
                        {label}
                      </span>
                    </div>
                  </Anchor>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
              <div className="flex flex-col gap-4">
                <h2 className="title3">Quick to Respond</h2>

                <p className="text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                  I check my inbox daily and aim to respond within{" "}
                  <strong>24 hours</strong>. For urgent matters, feel free to
                  call or reach out via WhatsApp or LinkedIn.
                </p>

                <List
                  spacing="sm"
                  size="md"
                  icon={
                    <ThemeIcon
                      color="green"
                      size={18}
                      radius="md"
                      variant="light"
                    >
                      <CheckCircle size={14} />
                    </ThemeIcon>
                  }
                >
                  {WHY_REACH_OUT.map((item) => (
                    <List.Item key={item}>
                      <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                        {item}
                      </span>
                    </List.Item>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </Card>

        {/* LinkedIn + GitHub */}
        <Card
          radius="xl"
          withBorder
          className="overflow-hidden p-5 shadow-sm sm:p-6 lg:p-8"
        >
          <div>
            <h2 className="title3">Find Me Online</h2>
            <Divider color="blue" mt="sm" mb="lg" />
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            {/* LinkedIn */}
            {/* LinkedIn */}
            <div className="flex h-full flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-700">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  LinkedIn
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Follow my professional journey, connect with me, and stay updated on my
                  latest projects and career milestones.
                </p>

                <div className="mt-8 flex justify-center">
                  <LinkedInBadge vanity="abdallahshee" />
                </div>
              </div>

              <Anchor
                href="https://www.linkedin.com/in/abdallahshee"
                target="_blank"
                underline="never"
                className="mt-6"
              >
                <Button
                  fullWidth
                  leftSection={<Linkedin size={18} />}
                  color="blue"
                  radius="md"
                >
                  View LinkedIn Profile
                </Button>
              </Anchor>
            </div>

            {/* GitHub */}
            <div className="flex h-full flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-700">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  GitHub
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Browse my repositories, explore open-source contributions, and see the
                  technologies I enjoy working with.
                </p>

                <div className="mt-6">
                  <GitHubCard username="abdallahshee" />
                </div>
              </div>

              <Anchor
                href="https://github.com/abdallahshee"
                target="_blank"
                underline="never"
                className="mt-6"
              >
                <Button
                  fullWidth
                  leftSection={<Github size={18} />}
                  color="dark"
                  radius="md"
                >
                  View GitHub Profile
                </Button>
              </Anchor>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card
          radius="lg"
          withBorder
          className="overflow-hidden border-indigo-200 bg-linear-to-r from-indigo-50 via-blue-50 to-cyan-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900/40 dark:via-slate-800/40 dark:to-slate-900/40 sm:p-8 lg:p-10"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-center text-transparent">
              Ready to Build Something Great Together?
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
              Whether you're hiring a Full-Stack Software Developer, looking for a
              project collaborator, or need help building a modern web application,
              I'd love to learn more about your goals and discuss how I can help bring
              your ideas to life.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Anchor
                href="mailto:abdallahshee664@email.com"
                underline="never"
                className="w-full sm:w-[220px]"
              >
                <Button
                  color="orange"
                  radius="md"
                  size="md"
                  fullWidth
                  leftSection={<Mail size={18} />}
                >
                  Send an Email
                </Button>
              </Anchor>

              <div className="w-full sm:w-[220px]">
                <Anchor
                  href="https://wa.me/254796515302"
                  target="_blank"
                  underline="never"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    color="green"
                    radius="md"
                    size="md"
                    fullWidth
                    leftSection={
                      <svg
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    }
                  >
                    Chat on WhatsApp
                  </Button>
                </Anchor>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ContactPage