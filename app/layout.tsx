import type { Metadata } from 'next'
import './globals.css'
import { Archivo } from 'next/font/google'

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SideRX',
  description: 'SideRX',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={archivo.className}>{children}</body>
    </html>
  )
}
