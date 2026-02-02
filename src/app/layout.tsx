import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import { LayoutClient } from './layout-client'
import { WebVitals } from './web-vitals'

export const metadata: Metadata = {
  title: 'Windows Things3 Dashboard',
  description: 'A minimal dashboard for managing Things3 tasks on Windows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
