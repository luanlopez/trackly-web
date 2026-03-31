'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      router.push(callbackUrl)
    } catch {
      toast.error('Erro ao tentar realizar login', {
        description: 'Verifique seu e-mail e senha e tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-glow w-full max-w-md rounded-2xl bg-[#0c1638]/90 backdrop-blur-sm border border-[#2a4d8f]/30 p-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2a4d8f] to-[#172c6a] flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold tracking-tight">T</span>
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">Trackly</span>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[1.75rem] font-bold text-white leading-tight tracking-tight">
          Welcome back
        </h1>
        <p className="text-[#5e82a0] text-sm mt-1.5 font-normal">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
          <Label htmlFor="email" className="text-[#aec5e0] text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-[#060b18]/60 border-[#2a4d8f]/40 text-white placeholder:text-[#5e82a0]/60 rounded-xl focus:border-[#2a4d8f] focus:ring-[#2a4d8f]/30 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#aec5e0] text-sm font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#5e82a0] hover:text-[#aec5e0] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-[#060b18]/60 border-[#2a4d8f]/40 text-white placeholder:text-[#5e82a0]/60 rounded-xl focus:border-[#2a4d8f] focus:ring-[#2a4d8f]/30 transition-colors"
          />
        </div>

        <div className="pt-1 space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary-glow w-full h-11 bg-gradient-to-r from-[#2a4d8f] to-[#1e3d7a] hover:from-[#3560aa] hover:to-[#2a4d8f] text-white font-semibold rounded-xl transition-all duration-200 border-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="text-sm text-[#5e82a0] text-center">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#aec5e0] hover:text-white transition-colors font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
