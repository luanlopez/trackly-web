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

const FAKE_USER = {
  id: 'fake-admin-id',
  email: 'admin@admin',
  name: 'Admin',
  role: 'admin' as const,
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // TODO: remove before production — fake credentials for UI validation only
  if (body.email === 'admin@admin' && body.password === 'admin') {
    const cookieStore = await cookies()
    cookieStore.set('access_token', 'fake-token', COOKIE_OPTIONS)
    cookieStore.set('user_info', JSON.stringify(FAKE_USER), {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    })
    return Response.json({ user: FAKE_USER }, { status: 200 })
  }

  const apiRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(body),
  })

  const data: AuthResponse | ApiError = await apiRes.json()

  if (!apiRes.ok) {
    return Response.json(data, { status: apiRes.status })
  }

  const { accessToken, user } = data as AuthResponse

  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, COOKIE_OPTIONS)
  cookieStore.set('user_info', JSON.stringify(user), {
    ...COOKIE_OPTIONS,
    httpOnly: false,
  })

  return Response.json({ user }, { status: 200 })
}
