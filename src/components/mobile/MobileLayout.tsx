'use client'
import { content } from '@/data/content'

function parseGithub(url: string): string {
  const m = url.match(/github\.com\/([^/?#]+)/)
  return m ? `github.com/${m[1]}` : url
}

function parseInstagram(url: string): string {
  const m = url.match(/instagram\.com\/([^/?#]+)/)
  return m ? `@${m[1]}` : url
}

interface AppCard {
  id: string
  title: string
  icon: string
  content: React.ReactNode
}

const APPS: AppCard[] = [
  {
    id: 'safari',
    title: 'About Me',
    icon: '🌐',
    content: (
      <div className="space-y-3 text-[13px] leading-relaxed">
        <h2 className="text-lg font-bold">{content.bio.name}</h2>
        <p className="text-[#3478f6]">{content.bio.title}</p>
        <p className="text-black/70">{content.bio.summary}</p>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-black/40 font-semibold mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {content.bio.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-[#e8f0fe] text-[#3478f6]">{s}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'ichat',
    title: 'Work Experience',
    icon: '💬',
    content: (
      <div className="space-y-4 text-[13px]">
        {content.employment.map((job, i) => (
          <div key={i} className="border-l-2 border-[#3478f6] pl-3">
            <p className="font-semibold">{job.role}</p>
            <p className="text-[#3478f6] text-[12px]">{job.company}</p>
            <p className="text-black/40 text-[11px] mb-1">{job.dates}</p>
            <ul className="space-y-0.5">
              {job.responsibilities.map((r, j) => (
                <li key={j} className="text-[12px] text-black/70 flex gap-1.5">
                  <span className="text-[#3478f6] shrink-0">▸</span>{r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'addressbook',
    title: 'Education',
    icon: '📖',
    content: (
      <div className="space-y-4 text-[13px]">
        {content.education.map((edu, i) => (
          <div key={i} className="border-l-2 border-[#5c6476] pl-3">
            <p className="font-semibold">{edu.school}</p>
            <p className="text-black/60 text-[12px]">{edu.degree} in {edu.field}</p>
            <p className="text-black/40 text-[11px] mb-1">{edu.dates}</p>
            {edu.certifications.map((c) => (
              <p key={c} className="text-[11px] text-black/50">• {c}</p>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'mail',
    title: 'Contact',
    icon: '✉️',
    content: (
      <div className="space-y-3 text-[13px]">
        <ContactRow icon="✉️" label="Email" value={content.contact.email} href={`mailto:${content.contact.email}`} />
        <ContactRow
                      icon="🐙"
                      label="GitHub"
                      value={parseGithub(content.contact.github)}
                      href={content.contact.github}
                    />
                    <ContactRow
                      icon="📷"
                      label="Instagram"
                      value={parseInstagram(content.contact.instagram)}
                      href={content.contact.instagram}
                    />
      </div>
    ),
  },
]

function ContactRow({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5">
      <span className="text-xl w-8 text-center">{icon}</span>
      <div>
        <p className="text-[11px] text-black/40">{label}</p>
        <p className="text-[#3478f6] text-[12px]">{value}</p>
      </div>
    </a>
  )
}

export default function MobileLayout() {
  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url('/wallpaper/snow-leopard.jpg')" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 menubar-glass flex items-center justify-center px-4 py-2">
        <p className="text-[13px] font-semibold text-black/80" style={{ fontFamily: 'var(--font-sl)' }}>
          {content.bio.name}
        </p>
      </div>

      {/* App cards */}
      <div className="p-3 space-y-3 pb-24">
        {APPS.map((app) => (
          <div
            key={app.id}
            id={`mobile-${app.id}`}
            className="rounded-xl overflow-hidden shadow-lg border border-black/15"
          >
            {/* Card title bar */}
            <div className="window-titlebar flex items-center gap-2 px-3 py-2">
              <span className="text-base">{app.icon}</span>
              <span className="text-[13px] font-medium text-black/70">{app.title}</span>
            </div>
            {/* Card content */}
            <div className="bg-white p-4">{app.content}</div>
          </div>
        ))}
      </div>

      {/* Bottom dock */}
      <div className="fixed bottom-0 left-0 right-0 dock-shelf flex justify-around px-4 py-2">
        {APPS.map((app) => (
          <a
            key={app.id}
            href={`#mobile-${app.id}`}
            className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white"
          >
            <span className="text-2xl">{app.icon}</span>
            <span className="text-[9px]">{app.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
