'use client'
import { useState } from 'react'
import { Loader2, Utensils, Clock, ChevronDown, ChevronUp, CalendarCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RECOMMENDATIONS, DIET_LABELS } from '@/lib/meal-recommendations'
import { createClient } from '@/lib/supabase/client'
import { toDateString } from '@/lib/utils'
import type { DietaryPreference, MacroTargets, MealType } from '@/types'
import type { MealRecommendation } from '@/lib/meal-recommendations'

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}
const MEAL_LABEL: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

// Pick one meal per slot, rotating daily so it feels fresh
function buildDayPlan(diet: DietaryPreference, seed: number): Record<MealType, MealRecommendation> {
  const all = RECOMMENDATIONS[diet] || RECOMMENDATIONS.omnivore
  const pick = (type: MealType, offset: number) => {
    const pool = all.filter(m => m.meal_type === type)
    return pool[(seed + offset) % pool.length]
  }
  return {
    breakfast: pick('breakfast', 0),
    lunch: pick('lunch', 1),
    dinner: pick('dinner', 2),
    snack: pick('snack', 3),
  }
}

interface SampleDayPlanProps {
  diet: DietaryPreference
  targets: MacroTargets
}

export function SampleDayPlan({ diet, targets }: SampleDayPlanProps) {
  // Rotate plan daily
  const daySeed = Math.floor(Date.now() / 86400000)
  const [plan, setPlan] = useState(() => buildDayPlan(diet, daySeed))
  const [logging, setLogging] = useState(false)
  const [logged, setLogged] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const totals = {
    calories: MEAL_ORDER.reduce((s, m) => s + plan[m].calories, 0),
    protein_g: MEAL_ORDER.reduce((s, m) => s + plan[m].protein_g, 0),
    carbs_g: MEAL_ORDER.reduce((s, m) => s + plan[m].carbs_g, 0),
    fat_g: MEAL_ORDER.reduce((s, m) => s + plan[m].fat_g, 0),
    fiber_g: MEAL_ORDER.reduce((s, m) => s + plan[m].fiber_g, 0),
  }

  const calPct = Math.min((totals.calories / targets.calories) * 100, 100)
  const proteinPct = Math.min((totals.protein_g / targets.protein_g) * 100, 100)

  function shuffle() {
    const newSeed = daySeed + Math.floor(Math.random() * 10) + 1
    setPlan(buildDayPlan(diet, newSeed))
    setLogged(false)
  }

  async function logEntireDay() {
    setLogging(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLogging(false); return }
    const today = toDateString()

    await supabase.from('food_logs').insert(
      MEAL_ORDER.map(mealType => ({
        user_id: user.id,
        date: today,
        meal_type: mealType,
        food_name: plan[mealType].name,
        serving_qty: 1,
        serving_unit: 'serving',
        serving_weight_grams: 0,
        calories: plan[mealType].calories,
        protein_g: plan[mealType].protein_g,
        carbs_g: plan[mealType].carbs_g,
        fat_g: plan[mealType].fat_g,
        fiber_g: plan[mealType].fiber_g,
        sugar_g: 0,
      }))
    )
    setLogging(false)
    setLogged(true)
  }

  return (
    <Card>
      <CardHeader>
        <button className="flex items-start justify-between w-full text-left" onClick={() => setExpanded(e => !e)}>
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-500" />
              Sample Day Plan
            </CardTitle>
            <CardDescription>{DIET_LABELS[diet]} · Tailored to your macro targets</CardDescription>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 mt-1" />}
        </button>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Macro overview bar */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Day Total</span>
              <span className="text-sm font-bold text-slate-900">{totals.calories} <span className="text-slate-400 font-normal">/ {targets.calories} kcal</span></span>
            </div>
            <Progress value={calPct} className="h-2" indicatorClassName={calPct > 100 ? 'bg-red-500' : 'bg-emerald-500'} />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-emerald-600">{totals.protein_g}g <span className="text-slate-400 font-normal">/ {targets.protein_g}g</span></div>
                <div className="text-slate-400">Protein</div>
                <Progress value={proteinPct} className="h-1 mt-1" />
              </div>
              <div>
                <div className="font-bold text-blue-600">{totals.carbs_g}g <span className="text-slate-400 font-normal">/ {targets.carbs_g}g</span></div>
                <div className="text-slate-400">Carbs</div>
                <Progress value={Math.min((totals.carbs_g / targets.carbs_g) * 100, 100)} className="h-1 mt-1" indicatorClassName="bg-blue-500" />
              </div>
              <div>
                <div className="font-bold text-amber-600">{totals.fat_g}g <span className="text-slate-400 font-normal">/ {targets.fat_g}g</span></div>
                <div className="text-slate-400">Fat</div>
                <Progress value={Math.min((totals.fat_g / targets.fat_g) * 100, 100)} className="h-1 mt-1" indicatorClassName="bg-amber-500" />
              </div>
            </div>
          </div>

          {/* Meal cards */}
          <div className="space-y-2">
            {MEAL_ORDER.map(mealType => {
              const meal = plan[mealType]
              return (
                <div key={mealType} className="flex gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="text-2xl flex-shrink-0 w-8 text-center">{MEAL_EMOJI[mealType]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{MEAL_LABEL[mealType]}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {meal.prep_time_min === 0 ? 'No prep' : `${meal.prep_time_min}m`}
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-slate-900 mt-0.5">{meal.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{meal.description}</p>
                    <div className="flex gap-3 mt-1.5 text-xs">
                      <span className="font-semibold text-orange-500">{meal.calories} kcal</span>
                      <span className="text-slate-400">P: <span className="text-emerald-600 font-medium">{meal.protein_g}g</span></span>
                      <span className="text-slate-400">C: <span className="text-blue-600 font-medium">{meal.carbs_g}g</span></span>
                      <span className="text-slate-400">F: <span className="text-amber-600 font-medium">{meal.fat_g}g</span></span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {meal.ingredients.slice(0, 4).map(ing => (
                        <span key={ing} className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500">{ing}</span>
                      ))}
                      {meal.ingredients.length > 4 && (
                        <span className="text-[10px] text-slate-400">+{meal.ingredients.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={shuffle} className="flex-1">
              <Utensils className="w-3.5 h-3.5 mr-1.5" /> Shuffle Plan
            </Button>
            <Button
              size="sm"
              onClick={logEntireDay}
              disabled={logging || logged}
              className="flex-1"
            >
              {logging
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Logging...</>
                : logged
                ? '✓ Logged!'
                : <><CalendarCheck className="w-3.5 h-3.5 mr-1.5" /> Log Entire Day</>
              }
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
