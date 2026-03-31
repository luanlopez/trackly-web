import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('user_info')

  return Response.json({ success: true }, { status: 200 })
}
