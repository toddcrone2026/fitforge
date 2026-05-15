import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(q)}&pageSize=20&api_key=${process.env.USDA_API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return NextResponse.json([])

    const data = await res.json()

    const foods = (data.foods || []).map((f: any) => {
      const get = (name: string) =>
        f.foodNutrients?.find((n: any) => n.nutrientName === name)?.value ?? 0

      return {
        food_name: f.description,
        brand_name: f.brandOwner || f.brandName || null,
        serving_qty: f.servingSize || 100,
        serving_unit: f.servingSizeUnit || 'g',
        serving_weight_grams: f.servingSize || 100,
        nf_calories: get('Energy'),
        nf_protein: get('Protein'),
        nf_total_carbohydrate: get('Carbohydrate, by difference'),
        nf_dietary_fiber: get('Fiber, total dietary'),
        nf_sugars: get('Total Sugars'),
        nf_total_fat: get('Total lipid (fat)'),
        photo: null,
        nix_item_id: f.fdcId?.toString(),
      }
    })

    return NextResponse.json(foods)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
