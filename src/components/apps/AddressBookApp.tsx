'use client'
import { useState, useEffect, useRef } from 'react'
import { content } from '@/data/content'
import { useSearchStore } from '@/store/searchStore'

export default function AddressBookApp() {
  const [selected, setSelected] = useState(0)
  const highlight = useSearchStore((s) => s.highlight)
  const clearHighlight = useSearchStore((s) => s.clearHighlight)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlight || highlight.appId !== 'addressbook') return
    const idx = parseInt(highlight.sectionId.replace('education-', ''), 10)
    if (!isNaN(idx)) setSelected(idx)
    setTimeout(() => {
      cardRef.current?.classList.add('search-highlight')
      setTimeout(() => {
        cardRef.current?.classList.remove('search-highlight')
        clearHighlight()
      }, 1600)
    }, 200)
  }, [highlight, clearHighlight])

  const edu = content.education[selected]

  return (
    <div className="flex h-full text-[12px]">
      {/* Sidebar — letter groups */}
      <div className="w-32 shrink-0 bg-gradient-to-b from-[#d0d5dc] to-[#c0c5cc] border-r border-black/15 overflow-y-auto">
        <div className="px-2 py-1 bg-[#b8bdc4] border-b border-black/15">
          <p className="text-[10px] uppercase tracking-widest text-black/50 font-semibold">Schools</p>
        </div>
        {content.education.map((edu, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-3 py-2 border-b border-black/5 transition-colors ${
              selected === i ? 'bg-[#3478f6] text-white' : 'text-black/75 hover:bg-white/40'
            }`}
          >
            <p className="font-medium truncate text-[11px]">{edu.school}</p>
          </button>
        ))}
      </div>

      {/* Card view */}
      <div className="flex-1 bg-white overflow-y-auto">
        {/* Tab strip */}
        <div className="flex border-b border-black/10 bg-[#f0f0f0]">
          {['Summary', 'Work', 'Other'].map((tab) => (
            <div key={tab} className={`px-4 py-1.5 text-[11px] border-r border-black/10 ${tab === 'Summary' ? 'bg-white font-medium' : 'text-black/50 cursor-default'}`}>
              {tab}
            </div>
          ))}
        </div>

        <div ref={cardRef} className="p-5 transition-all duration-300">
          {/* School name */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8e9aaf] to-[#5c6476] flex items-center justify-center text-white text-lg font-bold mt-1">
              {edu.school.charAt(0)}
            </div>
            <div>
              <p className="text-[16px] font-semibold text-black/85">{edu.school}</p>
              <p className="text-[12px] text-black/50">{edu.degree}</p>
            </div>
          </div>

          <div className="border-t border-black/10 pt-3 space-y-3">
            <Field label="Field" value={edu.field} />
            <Field label="Dates" value={edu.dates} />
            {edu.certifications.length > 0 && (
              <div className="flex gap-2 text-[11px]">
                <span className="text-black/40 w-20 shrink-0 pt-0.5">Certifications</span>
                <ul className="space-y-0.5">
                  {edu.certifications.map((c) => (
                    <li key={c} className="text-black/75 before:content-['•'] before:mr-1 before:text-black/30">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="text-black/40 w-20 shrink-0">{label}</span>
      <span className="text-black/75">{value}</span>
    </div>
  )
}
