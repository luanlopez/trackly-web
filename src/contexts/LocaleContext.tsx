'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type ptMessages from '../../messages/pt.json'

type Messages = typeof ptMessages
type FlatKey = string

interface LocaleContextValue {
  locale: 'pt' | 'en'
  t: (key: FlatKey) => string
  setLocale: (locale: 'pt' | 'en') => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj) as string ?? path
}

interface LocaleProviderProps {
  children: ReactNode
  initialLocale?: 'pt' | 'en'
  messages: { pt: Record<string, unknown>; en: Record<string, unknown> }
}

export function LocaleProvider({ children, initialLocale = 'pt', messages }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<'pt' | 'en'>(initialLocale)

  const setLocale = useCallback((next: 'pt' | 'en') => {
    setLocaleState(next)
    document.cookie = `locale=${next};path=/;max-age=${60 * 60 * 24 * 365}`
  }, [])

  const t = useCallback((key: string): string => {
    return getNestedValue(messages[locale] as Record<string, unknown>, key)
  }, [locale, messages])

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
