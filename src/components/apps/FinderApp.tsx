'use client'
import { useState, useCallback } from 'react'
import { search } from '@/data/searchIndex'
import type { SearchRecord } from '@/data/searchIndex'
import { useWindowStore } from '@/store/windowStore'
import { useSearchStore } from '@/store/searchStore'

const APP_ICONS: Record<string, string> = {
  safari:      '🌐',
  mail:        '✉️',
  addressbook: '📖',
  ichat:       '💬',
  iphoto:      '🖼️',
}

export default function FinderApp() {
  const [query, setQuery] = useState('')
  const results = search(query)
  const openWindow = useWindowStore((s) => s.openWindow)
  const setHighlight = useSearchStore((s) => s.setHighlight)

  const handleResultClick = useCallback(
    (record: SearchRecord) => {
      openWindow(record.appId)
      setHighlight({ appId: record.appId, sectionId: record.sectionId })
      setQuery('')
    },
    [openWindow, setHighlight]
  )

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] text-[12px]">
      {/* Search bar */}
      <div className="p-3 border-b border-black/10 bg-gradient-to-b from-[#d5d5d5] to-[#c5c5c5]">
        <div className="flex items-center gap-2 bg-white border border-black/20 rounded-md px-2 py-1 shadow-inner">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/40 shrink-0">
            <circle cx="5" cy="5" r="4"/>
            <path d="M8 8l3 3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolio…"
            className="flex-1 text-[13px] outline-none bg-transparent text-black/80 placeholder-black/30"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-black/30 hover:text-black/60 text-[10px]">✕</button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {query === '' ? (
          <div className="flex flex-col items-center justify-center h-full text-black/30 text-[11px] gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <circle cx="14" cy="14" r="11"/>
              <path d="M23 23l7 7" strokeLinecap="round"/>
            </svg>
            <p>Type to search your portfolio</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-black/30 text-[11px]">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div>
            {results.map((record, i) => (
              <button
                key={i}
                onClick={() => handleResultClick(record)}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-[#3478f6] hover:text-white group border-b border-black/5 last:border-0 transition-colors"
              >
                <span className="text-xl w-7 text-center shrink-0">{APP_ICONS[record.appId] ?? '📄'}</span>
                <div className="min-w-0">
                  <p className="font-medium text-[12px] truncate">{record.label}</p>
                  <p className="text-[11px] text-black/45 group-hover:text-white/70 truncate">{record.preview}</p>
                </div>
                <span className="ml-auto text-[10px] text-black/30 group-hover:text-white/50 shrink-0 capitalize">
                  {record.appId === 'addressbook' ? 'Address Book' : record.appId}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
