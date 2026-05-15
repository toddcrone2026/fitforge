'use client'
import { useState, useCallback } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { FoodItem, MealType } from '@/types'

interface FoodSearchProps {
  mealType: MealType
  onAdd: (food: FoodItem, qty: number) => Promise<void>
}

export function FoodSearch({ mealType, onAdd }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const search = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleAdd = async (food: FoodItem) => {
    const key = food.nix_item_id || food.food_name
    const qty = quantities[key] || 1
    setAdding(key)
    await onAdd(food, qty)
    setAdding(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a food... (e.g. grilled salmon, lentil soup)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <Button onClick={search} size="icon" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto rounded-xl border border-slate-100">
          {results.map((food, i) => {
            const key = food.nix_item_id || food.food_name + i
            const qty = quantities[key] || 1
            return (
              <div key={key} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                {food.photo?.thumb && (
                  <img src={food.photo.thumb} alt={food.food_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{food.food_name}</p>
                  {food.brand_name && <p className="text-xs text-slate-400">{food.brand_name}</p>}
                  <p className="text-xs text-slate-500">
                    {Math.round(food.nf_calories * qty)} kcal · {Math.round(food.nf_protein * qty)}g protein
                    {' · '}{food.serving_qty} {food.serving_unit}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={qty}
                    onChange={e => setQuantities(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 1 }))}
                    className="w-16 text-center text-sm h-8"
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAdd(food)}
                    disabled={adding === key}
                  >
                    {adding === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
