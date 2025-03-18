import { ProgressBarLoading } from '@/components/loading-bar'
import { LoadEnv } from '@/components/start'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from '@/contexts/react-query-provider'
import type { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>

        <meta name='theme-color' content='#061216' />
        <title>Dashboard Salles</title>
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <Toaster />
            <LoadEnv />
            <ProgressBarLoading>{children}</ProgressBarLoading>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
