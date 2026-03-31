'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Sun, Moon } from 'lucide-react'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()

  async function handleLogout() {
    await logout()
    toast.success(t('toast.logoutSuccess'))
    router.push('/login')
  }

  const name = user?.name ?? ''
  const email = user?.email ?? ''
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="text-base font-semibold tracking-tight">Trackly</span>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* User info */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5 text-sm">
                <span className="font-medium text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground font-normal">{email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Theme switch */}
            <div className="flex items-center justify-between px-1.5 py-1.5">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </span>
              <Switch
                size="sm"
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            {/* Language segmented */}
            <div className="flex items-center justify-between px-1.5 py-1.5">
              <span className="text-sm text-muted-foreground">
                {locale === 'pt' ? 'Idioma' : 'Language'}
              </span>
              <div className="flex rounded-md border border-input overflow-hidden text-xs font-medium">
                <button
                  onClick={() => setLocale('pt')}
                  className={`px-2.5 py-1 transition-colors ${locale === 'pt' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`px-2.5 py-1 transition-colors border-l border-input ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              {t('header.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
