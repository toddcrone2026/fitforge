import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=${process.env.USDA_API_KEY}`
    )
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()

    const foods = (data.foods || []).map((f: any) => {
      const get = (name: string) =>
        f.foodNutrients?.find((n: any) => n.nutrientName === name)?.value ?? 0

      return {
        food_name: f.description,
        brand_name: f.brandOwner || null,
        serving_qty: f.servingSize || 100,
        serving_unit: f.servingSizeUnit || 'g',
        serving_weight_grams: f.servingSize || 100,
        nf_calories: get('Energy'),
        nf_protein: get('Protein'),
        nf_total_carbohydrate: get('Carbohydrate, by difference'),
        nf_dietary_fiber: get('Fiber, total dietary'),
        nf_sugars: get('Total Sugars'),
        nf_total_fat: get('Total lipid (fat)'),
      }
    })

    return NextResponse.json(foods)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
