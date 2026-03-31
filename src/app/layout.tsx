import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { HealthProvider } from '@/components/providers/HealthProvider'
import type { User } from '@/types'
import ptMessages from '../../messages/pt.json'
import enMessages from '../../messages/en.json'
import './globals.css'

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Trackly',
  description: 'Track your job applications',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const raw = cookieStore.get('user_info')?.value
  let initialUser: User | null = null
  if (raw) {
    try {
      initialUser = JSON.parse(raw) as User
    } catch {
      // ignore malformed cookie
    }
  }
  const locale = ((cookieStore.get('locale')?.value) ?? 'pt') as 'pt' | 'en'
  const messages = { pt: ptMessages, en: enMessages }

  return (
    <html lang={locale} className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HealthProvider>
            <AuthProvider initialUser={initialUser}>
              <LocaleProvider initialLocale={locale} messages={messages}>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster position="top-right" richColors />
              </LocaleProvider>
            </AuthProvider>
          </HealthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
