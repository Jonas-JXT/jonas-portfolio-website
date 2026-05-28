'use client'
import { useEffect, useRef } from 'react'
import { content } from '@/data/content'
import { useSearchStore } from '@/store/searchStore'

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-6 h-6 flex items-center justify-center rounded text-black/40 hover:text-black/60 cursor-default">
      {children}
    </button>
  )
}

export default function SafariApp() {
  const highlight = useSearchStore((s) => s.highlight)
  const clearHighlight = useSearchStore((s) => s.clearHighlight)

  const summaryRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const interestsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlight || highlight.appId !== 'safari') return
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'bio-summary': summaryRef,
      'bio-skills': skillsRef,
      'bio-interests': interestsRef,
    }
    const ref = refMap[highlight.sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ref.current.classList.add('search-highlight')
      setTimeout(() => {
        ref.current?.classList.remove('search-highlight')
        clearHighlight()
      }, 1600)
    }
  }, [highlight, clearHighlight])

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0]">
      {/* Safari toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-b from-[#d5d5d5] to-[#bebebe] border-b border-black/15">
        <ToolbarButton>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor"><path d="M7 1L1 6l6 5"/></svg>
        </ToolbarButton>
        <ToolbarButton>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor"><path d="M1 1l6 5-6 5"/></svg>
        </ToolbarButton>
        <ToolbarButton>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1v5l4 2M6 1a5 5 0 100 10A5 5 0 006 1z" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
        </ToolbarButton>

        {/* URL bar */}
        <div className="flex-1 mx-1 h-[18px] px-2 bg-white border border-black/20 rounded-full text-[10px] text-black/50 flex items-center shadow-inner">
          {content.bio.url}
        </div>

        <ToolbarButton>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="4"/><path d="M8 8l3 3" strokeLinecap="round"/></svg>
        </ToolbarButton>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto bg-white p-6 text-[13px] leading-relaxed text-black/80">
        <h1 className="text-2xl font-bold text-black mb-1">{content.bio.name}</h1>
        <p className="text-[#3478f6] text-sm mb-4">{content.bio.title}</p>

        <div ref={summaryRef} className="mb-5 transition-all duration-300">
          <p className="text-[13px] leading-6">{content.bio.summary}</p>
        </div>

        <div ref={skillsRef} className="mb-5 transition-all duration-300">
          <h2 className="text-[11px] uppercase tracking-widest text-black/40 font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {content.bio.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-full text-[11px] bg-[#e8f0fe] text-[#3478f6] border border-[#3478f6]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div ref={interestsRef} className="transition-all duration-300">
          <h2 className="text-[11px] uppercase tracking-widest text-black/40 font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {content.bio.interests.map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 rounded-full text-[11px] bg-[#f0f0f0] text-black/60 border border-black/10"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
