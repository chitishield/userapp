import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChitiShield — GDPR & DPDPA Platform',
  description: 'Automated compliance certification for GDPR and DPDPA regulations',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0D1B2A',
              color: 'white',
              border: '1px solid #243B55',
              borderLeft: '3px solid #0E7C7B',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
