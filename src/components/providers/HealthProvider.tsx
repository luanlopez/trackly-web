'use client'

import { useEffect, useState } from 'react'

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    async function check() {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        if (res.ok) {
          setReady(true)
          return
        }
      } catch {
        // API still sleeping
      }
      setAttempt((n) => n + 1)
      timeout = setTimeout(check, 5000)
    }

    check()
    return () => clearTimeout(timeout)
  }, [])

  if (ready) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="font-sans text-2xl font-bold tracking-tight text-foreground">
          Trackly
        </span>

        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
        </div>

        <p className="text-sm text-muted-foreground">
          {attempt === 0
            ? 'Conectando ao servidor...'
            : 'O servidor está acordando, aguarde um momento...'}
        </p>
      </div>
    </div>
  )
}
