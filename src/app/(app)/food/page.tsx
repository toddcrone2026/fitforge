'use client'
import { useState, useEffect, useCallback } from 'react'
import { FoodSearch } from '@/components/food/food-search'
import { MealSection } from '@/components/food/meal-section'
import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { MealRecommendations } from '@/components/dashboard/meal-recommendations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { toDateString } from '@/lib/utils'
import { calculateMacros } from '@/lib/macros'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FoodItem, FoodLog, MacroTargets, MealType, DailyNutritionSummary, DietaryPreference } from '@/types'
import type { MealRecommendation } from '@/lib/meal-recommendations'

export default function FoodPage() {
  const [date, setDate] = useState(toDateString())
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [targets, setTargets] = useState<MacroTargets | null>(null)
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  const [loading, setLoading] = useState(true)
  const [diet, setDiet] = useState<DietaryPreference>('pescatarian')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [profileRes, logsRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('food_logs').select('*').eq('user_id', user.id).eq('date', date).order('created_at'),
    ])

    if (profileRes.data) {
      setTargets(calculateMacros(profileRes.data.tdee, profileRes.data.fitness_goal, profileRes.data.weight_kg))
      setDiet(profileRes.data.dietary_preference || 'omnivore')
    }
    setFoodLogs(logsRes.data || [])
    setLoading(false)
  }, [date])

  useEffect(() => { load() }, [load])

  async function handleAddFood(food: FoodItem, qty: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('food_logs').insert({
      user_id: user.id,
      date,
      meal_type: activeMeal,
      food_name: food.food_name,
      brand_name: food.brand_name,
      serving_qty: food.serving_qty * qty,
      serving_unit: food.serving_unit,
      serving_weight_grams: food.serving_weight_grams * qty,
      calories: food.nf_calories * qty,
      protein_g: food.nf_protein * qty,
      carbs_g: food.nf_total_carbohydrate * qty,
      fat_g: food.nf_total_fat * qty,
      fiber_g: (food.nf_dietary_fiber || 0) * qty,
      sugar_g: (food.nf_sugars || 0) * qty,
      photo_url: food.photo?.thumb,
    })
    load()
  }

  async function handleLogRecommendation(meal: MealRecommendation) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('food_logs').insert({
      user_id: user.id,
      date,
      meal_type: meal.meal_type,
      food_name: meal.name,
      serving_qty: 1,
      serving_unit: 'serving',
      serving_weight_grams: 0,
      calories: meal.calories,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
      fiber_g: meal.fiber_g,
      sugar_g: 0,
    })
    setActiveMeal(meal.meal_type)
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('food_logs').delete().eq('id', id)
    setFoodLogs(prev => prev.filter(f => f.id !== id))
  }

  function shiftDate(days: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(toDateString(d))
  }

  const summary: DailyNutritionSummary = {
    date,
    total_calories: foodLogs.reduce((s, f) => s + f.calories, 0),
    total_protein_g: foodLogs.reduce((s, f) => s + f.protein_g, 0),
    total_carbs_g: foodLogs.reduce((s, f) => s + f.carbs_g, 0),
    total_fat_g: foodLogs.reduce((s, f) => s + f.fat_g, 0),
    total_fiber_g: foodLogs.reduce((s, f) => s + f.fiber_g, 0),
    total_sugar_g: foodLogs.reduce((s, f) => s + f.sugar_g, 0),
    meals: {
      breakfast: foodLogs.filter(f => f.meal_type === 'breakfast'),
      lunch: foodLogs.filter(f => f.meal_type === 'lunch'),
      dinner: foodLogs.filter(f => f.meal_type === 'dinner'),
      snack: foodLogs.filter(f => f.meal_type === 'snack'),
    },
  }

  const isToday = date === toDateString()

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
      {/* Date picker */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Food Log</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[100px] text-center">
            {isToday ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => shiftDate(1)}
            disabled={isToday}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {targets && (
        <Card>
          <CardHeader><CardTitle>Daily Summary</CardTitle></CardHeader>
          <CardContent>
            <CalorieSummary targets={targets} summary={summary} />
          </CardContent>
        </Card>
      )}

      {/* Add food */}
      <Card>
        <CardHeader>
          <CardTitle>Log Food</CardTitle>
          <Tabs value={activeMeal} onValueChange={v => setActiveMeal(v as MealType)}>
            <TabsList>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
              <TabsTrigger value="snack">Snack</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <FoodSearch mealType={activeMeal} onAdd={handleAddFood} />
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-3">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(meal => (
          <MealSection
            key={meal}
            mealType={meal}
            items={summary.meals[meal]}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Meal recommendations */}
      <MealRecommendations diet={diet} onLogMeal={handleLogRecommendation} />
    </div>
  )
}
