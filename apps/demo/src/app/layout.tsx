import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '✨ Srndpty Demo',
  description: 'Universal interactive diagram framework with JSON-first schemas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
