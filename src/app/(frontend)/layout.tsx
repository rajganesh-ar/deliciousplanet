import React from 'react'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata = {
  description: 'Delicious Planet — Bite into the Wild. Coming Soon.',
  title: 'Delicious Planet — Coming Soon',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-black text-white antialiased" style={{ fontFamily: 'var(--font-body)' }}>
        <main>{children}</main>
      </body>
    </html>
  )
}
