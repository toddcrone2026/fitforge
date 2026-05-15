import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json([])

  try {
    const [instantRes] = await Promise.allSettled([
      fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(q)}&detailed=true`, {
        headers: {
          'x-app-id': process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!,
          'x-app-key': process.env.NUTRITIONIX_API_KEY!,
        },
      }),
    ])

    if (instantRes.status === 'rejected') return NextResponse.json([])

    const instant = instantRes.value
    if (!instant.ok) return NextResponse.json([])

    const data = await instant.json()
    const foods = [
      ...(data.branded || []).slice(0, 10),
      ...(data.common || []).slice(0, 10),
    ]
    return NextResponse.json(foods)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
