import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query) return NextResponse.json([])

  try {
    const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'x-app-id': process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!,
        'x-app-key': process.env.NUTRITIONIX_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    return NextResponse.json(data.foods || [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
