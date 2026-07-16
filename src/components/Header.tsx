import { Anchor, Card, Divider, List, ThemeIcon } from "@mantine/core"
import { CheckCircle, Github, Linkedin, Mail, Phone } from "lucide-react"



const WHY_REACH_OUT = [
  "I reply to every message within 24 hours",
  "Open to full-time software developer roles",
  "Available for interviews at short notice",
  "Based in Nairobi, open to relocating within Kenya",
]

const CONTACT_LINKS = [
  { icon: <Mail size={20} />, label: "abdallahshee664@email.com", href: "mailto:abdallahshee664@email.com", color: "indigo" },
  { icon: <Phone size={20} />, label: "+254 796 515 302", href: "tel:+254796515302", color: "teal" },
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
  { icon: <Github size={20} />, label: "github.com/abdallahshee", href: "https://github.com/abdallahshee", color: "dark" },
  { icon: <Linkedin size={20} />, label: "linkedin.com/in/abdallahshee", href: "https://linkedin.com/in/abdallahshee", color: "blue" },
]

export default function ContactPage() {
  return (
    <div className="flex justify-center px-4">
      <div className="max-w-3xl space-y-8 px-0 py-6 sm:py-8 md:py-10">
        <div className="flex flex-col gap-3">
          <h1 className="heading">Let's Connect</h1>
          <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
            I'm actively pursuing a full-stack software developer role, eager to bring real
            energy, care, and craft to a team that's building something worth building. If
            you're hiring, or just want to talk shop, reach out directly — I read and
            respond to every message.
          </p>
        </div>

        <Card radius="md" withBorder className="p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="title3">Contact Details</h2>
              <Divider color="blue" />
              <div className="flex flex-col gap-2">
                {CONTACT_LINKS.map(({ icon, label, href, color }) => (
                  <Anchor key={href} href={href} target="_blank" underline="never">
                    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                      <ThemeIcon variant="light" color={color} radius="md" size={36}>
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

            <Divider />

            <div className="flex flex-col gap-4">
              <h2 className="title3">Quick to Respond</h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                I check my inbox daily and aim to reply to every message within{" "}
                <strong>24 hours</strong>. If your matter is urgent, feel free to
                call or reach out on LinkedIn directly.
              </p>
              <List
                spacing="xs"
                size="md"
                icon={
                  <ThemeIcon color="green" size={18} radius="md" variant="light">
                    <CheckCircle size={16} />
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
        </Card>
      </div>
    </div>
  )
}

