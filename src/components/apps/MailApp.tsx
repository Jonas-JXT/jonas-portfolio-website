'use client'
import { useEffect, useRef } from 'react'
import { content } from '@/data/content'
import { useSearchStore } from '@/store/searchStore'

function parseGithub(url: string): string {
  const m = url.match(/github\.com\/([^/?#]+)/)
  return m ? `github.com/${m[1]}` : url
}

function parseInstagram(url: string): string {
  const m = url.match(/instagram\.com\/([^/?#]+)/)
  return m ? `@${m[1]}` : url
}

export default function MailApp() {
  const highlight = useSearchStore((s) => s.highlight)
  const clearHighlight = useSearchStore((s) => s.clearHighlight)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlight || highlight.appId !== 'mail') return
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      contentRef.current.classList.add('search-highlight')
      setTimeout(() => {
        contentRef.current?.classList.remove('search-highlight')
        clearHighlight()
      }, 1600)
    }
  }, [highlight, clearHighlight])

  return (
    <div className="flex h-full bg-[#dde3ea] text-[12px]">
      {/* Sidebar */}
      <div className="w-36 shrink-0 bg-gradient-to-b from-[#c5cbd5] to-[#b8bec8] border-r border-black/15 p-2">
        <p className="text-[10px] uppercase tracking-widest text-black/40 font-semibold px-1 mb-1">Mailboxes</p>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#3478f6] text-white cursor-default">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor"><path d="M0 0h12v10H0zM0 0l6 6 6-6"/></svg>
          <span>Inbox</span>
          <span className="ml-auto text-[10px] bg-white/30 rounded-full px-1">1</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-black/60 cursor-default mt-0.5">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 0h12v10H0zM0 0l6 6 6-6"/></svg>
          <span>Sent</span>
        </div>
      </div>

      {/* Message list */}
      <div className="w-36 shrink-0 bg-[#eaeef3] border-r border-black/10">
        <div className="px-3 py-2 bg-[#dce2ea] border-b border-black/10">
          <p className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">1 Message</p>
        </div>
        <div className="px-3 py-2 bg-white border-l-2 border-[#3478f6]">
          <p className="text-[11px] font-semibold text-black/80">Contact Card</p>
          <p className="text-[10px] text-black/45 truncate">{content.bio.name}</p>
        </div>
      </div>

      {/* Message pane */}
      <div className="flex-1 bg-white overflow-y-auto min-w-0">
        {/* Mail header */}
        <div className="px-5 py-3 border-b border-black/10 bg-[#f5f5f5]">
          <p className="text-[14px] font-semibold text-black/85">Contact Card</p>
          <div className="mt-1 text-[11px] text-black/50 space-y-0.5">
            <p className="break-all">
              <span className="font-medium">From:</span> {content.bio.name} &lt;{content.contact.email}&gt;
            </p>
            <p><span className="font-medium">Date:</span> Today</p>
          </div>
        </div>

        {/* Contact body */}
        <div ref={contentRef} className="p-6 pr-8 space-y-4 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3478f6] to-[#6b9df9] flex items-center justify-center text-white text-xl font-bold shrink-0">
              {content.bio.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-black/85">{content.bio.name}</p>
              <p className="text-[12px] text-[#3478f6]">{content.bio.title}</p>
            </div>
          </div>

          <div className="border-t border-black/10 pt-4 space-y-3">
            <ContactRow
              icon="✉️"
              label="Email"
              value={content.contact.email}
              href={`mailto:${content.contact.email}`}
            />
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
        </div>
      </div>
    </div>
  )
}

function ContactRow({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href: string
}) {
  return (
    <div className="flex items-start gap-3 text-[12px]">
      <span className="w-5 text-center shrink-0 mt-0.5">{icon}</span>
      <span className="text-black/40 w-16 shrink-0">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#3478f6] hover:underline break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </a>
    </div>
  )
}
