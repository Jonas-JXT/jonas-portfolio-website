'use client'
import { useState, useEffect, useRef } from 'react'
import { content } from '@/data/content'
import { useSearchStore } from '@/store/searchStore'

export default function iChatApp() {
  const [selected, setSelected] = useState(0)
  const highlight = useSearchStore((s) => s.highlight)
  const clearHighlight = useSearchStore((s) => s.clearHighlight)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlight || highlight.appId !== 'ichat') return
    const idx = parseInt(highlight.sectionId.replace('job-', ''), 10)
    if (!isNaN(idx)) setSelected(idx)
    setTimeout(() => {
      chatRef.current?.classList.add('search-highlight')
      setTimeout(() => {
        chatRef.current?.classList.remove('search-highlight')
        clearHighlight()
      }, 1600)
    }, 200)
  }, [highlight, clearHighlight])

  const job = content.employment[selected]

  return (
    <div className="flex h-full bg-[#3a3a3a] text-[12px]">
      {/* Buddy list sidebar */}
      <div className="w-36 shrink-0 bg-gradient-to-b from-[#4a4a4a] to-[#3a3a3a] border-r border-white/10 overflow-y-auto">
        <div className="px-3 py-2 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Employers</p>
        </div>
        {content.employment.map((job, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-3 py-2 border-b border-white/5 transition-colors ${
              selected === i ? 'bg-[#3478f6]/80 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <p className="font-medium truncate text-[11px]">{job.company}</p>
            </div>
            <p className="text-[10px] text-white/40 truncate pl-4">{job.role}</p>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-[#2e2e2e]">
        {/* Chat header */}
        <div className="px-4 py-2 bg-[#3a3a3a] border-b border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p className="text-[12px] font-semibold text-white/80">{job.company}</p>
          <span className="text-[10px] text-white/40 ml-auto">{job.dates}</span>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 transition-all duration-300">
          {/* Recruiter question */}
          <ChatBubble
            from="Recruiter"
            text={job.question}
            isMe={false}
          />

          {/* My response */}
          <ChatBubble
            from="You"
            isMe
            text={
              <div className="space-y-2">
                <p className="font-semibold text-[13px]">{job.role}</p>
                <p className="text-white/60 text-[11px]">{job.dates}</p>
                <ul className="space-y-1 mt-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="text-[11px] leading-5 flex gap-2">
                      <span className="text-blue-400 shrink-0 mt-0.5">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

function ChatBubble({
  from,
  text,
  isMe,
}: {
  from: string
  text: React.ReactNode
  isMe: boolean
}) {
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold ${isMe ? 'bg-[#3478f6]' : 'bg-[#5a5a5a]'} text-white`}>
        {from.charAt(0)}
      </div>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-[12px] leading-5 ${
          isMe
            ? 'bg-[#3478f6] text-white rounded-tr-sm'
            : 'bg-[#4a4a4a] text-white/85 rounded-tl-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
