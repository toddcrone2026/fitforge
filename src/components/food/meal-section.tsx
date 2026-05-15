'use client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FoodLog, MealType } from '@/types'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
}

const MEAL_COLORS: Record<MealType, string> = {
  breakfast: 'text-amber-600 bg-amber-50',
  lunch: 'text-blue-600 bg-blue-50',
  dinner: 'text-purple-600 bg-purple-50',
  snack: 'text-emerald-600 bg-emerald-50',
}

interface MealSectionProps {
  mealType: MealType
  items: FoodLog[]
  onDelete: (id: string) => Promise<void>
}

export function MealSection({ mealType, items, onDelete }: MealSectionProps) {
  const totalCal = items.reduce((s, f) => s + f.calories, 0)
  const totalProtein = items.reduce((s, f) => s + f.protein_g, 0)

  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 ${MEAL_COLORS[mealType]}`}>
        <div>
          <span className="font-semibold text-sm">{MEAL_LABELS[mealType]}</span>
          {items.length > 0 && (
            <span className="ml-2 text-xs opacity-70">{Math.round(totalCal)} kcal · {Math.round(totalProtein)}g protein</span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-3 text-sm text-slate-400 italic">Nothing logged yet</p>
      ) : (
        <div className="divide-y divide-slate-50">
          {items.map(food => (
            <div key={food.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{food.food_name}</p>
                <p className="text-xs text-slate-400">
                  {food.serving_qty} {food.serving_unit} · {Math.round(food.calories)} kcal
                  {' · '}P: {Math.round(food.protein_g)}g C: {Math.round(food.carbs_g)}g F: {Math.round(food.fat_g)}g
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-300 hover:text-red-500 flex-shrink-0"
                onClick={() => onDelete(food.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
