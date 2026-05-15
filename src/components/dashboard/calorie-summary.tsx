'use client'
import { MacroRing } from './macro-ring'
import { Progress } from '@/components/ui/progress'
import type { MacroTargets, DailyNutritionSummary } from '@/types'

interface CalorieSummaryProps {
  targets: MacroTargets
  summary: DailyNutritionSummary | null
}

export function CalorieSummary({ targets, summary }: CalorieSummaryProps) {
  const cal = summary?.total_calories ?? 0
  const protein = summary?.total_protein_g ?? 0
  const carbs = summary?.total_carbs_g ?? 0
  const fat = summary?.total_fat_g ?? 0
  const fiber = summary?.total_fiber_g ?? 0
  const remaining = Math.max(targets.calories - cal, 0)
  const pct = Math.min((cal / targets.calories) * 100, 100)

  return (
    <div className="space-y-4">
      {/* Calorie bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <span className="text-3xl font-bold text-slate-900">{Math.round(cal)}</span>
            <span className="text-sm text-slate-400 ml-1">/ {targets.calories} kcal</span>
          </div>
          <span className="text-sm font-medium text-emerald-600">{remaining} remaining</span>
        </div>
        <Progress value={pct} className="h-3" indicatorClassName={cal > targets.calories ? 'bg-red-500' : 'bg-emerald-500'} />
      </div>

      {/* Macro rings */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        <MacroRing label="Protein" current={protein} target={targets.protein_g} unit="g" color="#10b981" />
        <MacroRing label="Carbs" current={carbs} target={targets.carbs_g} unit="g" color="#3b82f6" />
        <MacroRing label="Fat" current={fat} target={targets.fat_g} unit="g" color="#f59e0b" />
        <MacroRing label="Fiber" current={fiber} target={targets.fiber_g} unit="g" color="#8b5cf6" />
      </div>
    </div>
  )
}
