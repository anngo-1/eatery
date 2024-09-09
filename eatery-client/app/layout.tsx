import type { Metadata } from 'next'
import { Chivo }  from 'next/font/google'
import './globals.css'

const inter = Chivo({ subsets: ['latin'] , weight: "400"})

export const metadata: Metadata = {
  title: 'eatery',
  description: 'a web app for food',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
