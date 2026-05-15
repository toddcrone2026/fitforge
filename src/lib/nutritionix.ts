import type { FoodItem } from '@/types'

const BASE_URL = 'https://trackapi.nutritionix.com/v2'

function headers() {
  return {
    'x-app-id': process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!,
    'x-app-key': process.env.NUTRITIONIX_API_KEY!,
    'Content-Type': 'application/json',
  }
}

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const res = await fetch(`${BASE_URL}/search/instant?query=${encodeURIComponent(query)}&detailed=true&self=false`, {
    headers: headers(),
  })
  if (!res.ok) throw new Error('Nutritionix search failed')
  const data = await res.json()
  return [...(data.branded || []), ...(data.common || [])]
}

export async function getFoodNutrients(query: string): Promise<FoodItem[]> {
  const res = await fetch(`${BASE_URL}/natural/nutrients`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error('Nutritionix nutrients fetch failed')
  const data = await res.json()
  return data.foods || []
}

export async function getBrandedFoodItem(nix_item_id: string): Promise<FoodItem> {
  const res = await fetch(`${BASE_URL}/search/item?nix_item_id=${nix_item_id}`, {
    headers: headers(),
  })
  if (!res.ok) throw new Error('Nutritionix item fetch failed')
  const data = await res.json()
  return data.foods[0]
}
