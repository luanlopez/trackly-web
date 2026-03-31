const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return Response.json({ status: 'unavailable' }, { status: 503 })
    }

    return Response.json({ status: 'ok' }, { status: 200 })
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503 })
  }
}
