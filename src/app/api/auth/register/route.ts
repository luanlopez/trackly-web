import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import type { AuthResponse, ApiError } from '@/types'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const apiRes = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    body: JSON.stringify(body),
  })

  const data: AuthResponse | ApiError = await apiRes.json()

  if (!apiRes.ok) {
    return Response.json(data, { status: apiRes.status })
  }

  const { accessToken, user } = data as AuthResponse

  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, COOKIE_OPTIONS)

  return Response.json({ user }, { status: 201 })
}
