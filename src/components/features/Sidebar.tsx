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
import { Briefcase, LogOut, Sun, Moon, ChevronDown } from 'lucide-react'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()

  async function handleLogout() {
    await logout()
    toast.success(t('toast.logoutSuccess'))
    router.push('/login')
  }

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'
  const name = user?.name ?? ''
  const email = user?.email ?? ''

  return (
    <aside className="w-[192px] shrink-0 flex flex-col h-screen border-r border-border bg-sidebar sticky top-0">
      {/* Logo */}
      <div className="px-4 h-12 flex items-center border-b border-border">
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Trackly
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <a
          href="/dashboard"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <Briefcase className="w-4 h-4 shrink-0 opacity-70" />
          Jobs
        </a>
      </nav>

      {/* User */}
      <div className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors outline-none group">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="text-[10px] font-medium">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-xs font-medium text-sidebar-foreground truncate w-full leading-tight">{name}</span>
              <span className="text-[10px] text-muted-foreground truncate w-full leading-tight">{email}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground text-sm">{name}</span>
                <span className="text-xs text-muted-foreground font-normal">{email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

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

            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              {t('header.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
