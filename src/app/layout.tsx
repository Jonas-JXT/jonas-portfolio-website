import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jonas Portfolio',
  description: 'Jonas portfolio modeled off Mac OS X Snow Leopard.',
  openGraph: {
    title: 'Jonas Portfolio',
    description: 'Jonas portfolio modeled off Mac OS X Snow Leopard.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonas Portfolio',
    description: 'Jonas portfolio modeled off Mac OS X Snow Leopard.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
