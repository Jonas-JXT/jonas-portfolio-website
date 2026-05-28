'use client'
import { useState } from 'react'
import Image from 'next/image'
import { content } from '@/data/content'
import type { PhotoType } from '@/data/content'

type Filter = 'all' | PhotoType

export default function iPhotoApp() {
  const [filter, setFilter] = useState<Filter>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const photos = content.photos.filter(
    (p) => filter === 'all' || p.type === filter
  )

  return (
    <div className="flex flex-col h-full bg-[#2a2a2a] text-white text-[12px]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#3a3a3a] border-b border-white/10">
        {(['all', 'project', 'personal'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-0.5 rounded-full text-[11px] transition-colors ${
              filter === f ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {f === 'all' ? 'All Photos' : f === 'project' ? 'Projects' : 'Personal'}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-white/40">{photos.length} photos</span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightbox(content.photos.indexOf(photo))}
              className="relative aspect-square bg-[#1a1a1a] rounded overflow-hidden group border border-white/5 hover:border-white/20 transition-colors"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="100px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
                onError={(e) => {
                  // Show placeholder gradient on error
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              {/* Fallback placeholder */}
              <div className="absolute inset-0 flex items-end p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[9px] text-white/80 leading-tight truncate">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
        {photos.length === 0 && (
          <div className="flex items-center justify-center h-32 text-white/30 text-[11px]">
            No photos in this album
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-4/5 h-3/4 mb-2">
            <Image
              src={content.photos[lightbox].src}
              alt={content.photos[lightbox].caption}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-white/70 text-[12px]">{content.photos[lightbox].caption}</p>
          <button
            className="absolute top-3 right-3 text-white/60 hover:text-white text-xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
