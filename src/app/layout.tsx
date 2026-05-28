import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your Name — Portfolio',
  description: 'Software engineer portfolio — interactive Mac OS X Snow Leopard experience',
  openGraph: {
    title: 'Your Name — Portfolio',
    description: 'An interactive portfolio website styled as a Mac OS X Snow Leopard desktop.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name — Portfolio',
    description: 'An interactive portfolio styled as Mac OS X Snow Leopard.',
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
