'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Step = 'request' | 'sent'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('request')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // TODO: wire up to API when endpoint is available
      await new Promise((r) => setTimeout(r, 600))
      setStep('sent')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'sent') {
    return (
      <div className="card-glow w-full max-w-md rounded-2xl bg-[#0c1638]/90 backdrop-blur-sm border border-[#2a4d8f]/30 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2a4d8f] to-[#172c6a] flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold tracking-tight">T</span>
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">Trackly</span>
        </div>

        <div className="mb-7">
          <div className="w-12 h-12 rounded-2xl bg-[#2a4d8f]/20 border border-[#2a4d8f]/30 flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-[#aec5e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-[1.75rem] font-bold text-white leading-tight tracking-tight">
            Check your inbox
          </h1>
          <p className="text-[#5e82a0] text-sm mt-1.5">
            We sent a reset link to{' '}
            <span className="text-[#aec5e0] font-medium">{email}</span>
          </p>
        </div>

        <p className="text-sm text-[#5e82a0] mb-6">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <button
            type="button"
            onClick={() => setStep('request')}
            className="text-[#aec5e0] hover:text-white transition-colors font-semibold"
          >
            try another email
          </button>
          .
        </p>

        <Link href="/login">
          <Button
            variant="ghost"
            className="w-full h-11 text-[#5e82a0] hover:text-white hover:bg-[#172c6a]/50 rounded-xl gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    )
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
          Forgot your password?
        </h1>
        <p className="text-[#5e82a0] text-sm mt-1.5 font-normal">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

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

        <div className="pt-1 space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary-glow w-full h-11 bg-gradient-to-r from-[#2a4d8f] to-[#1e3d7a] hover:from-[#3560aa] hover:to-[#2a4d8f] text-white font-semibold rounded-xl transition-all duration-200 border-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Link href="/login" className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 text-[#5e82a0] hover:text-white hover:bg-[#172c6a]/50 rounded-xl gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
