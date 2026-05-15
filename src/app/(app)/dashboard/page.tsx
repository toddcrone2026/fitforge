import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateMacros } from '@/lib/macros'
import { toDateString, formatGoal } from '@/lib/utils'
import Link from 'next/link'
import { Dumbbell, Utensils, TrendingUp, Droplets, Plus } from 'lucide-react'
import type { DailyNutritionSummary, MealType } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = toDateString()

  const [profileResult, foodLogsResult, workoutLogsResult, waterResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('food_logs').select('*').eq('user_id', user.id).eq('date', today),
    supabase.from('workout_logs').select('*').eq('user_id', user.id).eq('date', today),
    supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).eq('date', today),
  ])

  const profile = profileResult.data
  if (!profile) redirect('/onboarding')

  const targets = calculateMacros(profile.tdee, profile.fitness_goal, profile.weight_kg)
  const foodLogs = foodLogsResult.data || []

  const summary: DailyNutritionSummary = {
    date: today,
    total_calories: foodLogs.reduce((s: number, f: any) => s + f.calories, 0),
    total_protein_g: foodLogs.reduce((s: number, f: any) => s + f.protein_g, 0),
    total_carbs_g: foodLogs.reduce((s: number, f: any) => s + f.carbs_g, 0),
    total_fat_g: foodLogs.reduce((s: number, f: any) => s + f.fat_g, 0),
    total_fiber_g: foodLogs.reduce((s: number, f: any) => s + f.fiber_g, 0),
    total_sugar_g: foodLogs.reduce((s: number, f: any) => s + f.sugar_g, 0),
    meals: {
      breakfast: foodLogs.filter((f: any) => f.meal_type === 'breakfast'),
      lunch: foodLogs.filter((f: any) => f.meal_type === 'lunch'),
      dinner: foodLogs.filter((f: any) => f.meal_type === 'dinner'),
      snack: foodLogs.filter((f: any) => f.meal_type === 'snack'),
    },
  }

  const totalWater = (waterResult.data || []).reduce((s: number, w: any) => s + w.amount_ml, 0)
  const waterGoalMl = 2500
  const waterPct = Math.min((totalWater / waterGoalMl) * 100, 100)

  const todayWorkout = workoutLogsResult.data?.[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting}, {profile.name || 'there'} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          <span className="mx-2">·</span>
          <Badge variant="default">{formatGoal(profile.fitness_goal)}</Badge>
        </p>
      </div>

      {/* Macro summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Nutrition</CardTitle>
            <Link href="/food" className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Log food
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <CalorieSummary targets={targets} summary={summary} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Water */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Water</p>
                <p className="text-2xl font-bold text-slate-900">{(totalWater / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">L</span></p>
                <p className="text-xs text-slate-400">Goal: {waterGoalMl / 1000}L</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${waterPct}%` }} />
            </div>
            <WaterLogButton userId={user.id} today={today} />
          </CardContent>
        </Card>

        {/* Today's workout */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Workout</p>
                {todayWorkout ? (
                  <>
                    <p className="text-lg font-bold text-slate-900">{todayWorkout.name}</p>
                    <Badge variant={todayWorkout.completed ? 'default' : 'secondary'}>
                      {todayWorkout.completed ? '✓ Completed' : 'In Progress'}
                    </Badge>
                  </>
                ) : (
                  <p className="text-slate-400 text-sm mt-1">No workout logged yet</p>
                )}
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Dumbbell className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <Link
              href="/workout"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              {todayWorkout ? 'View workout' : 'Start a workout'}
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Protein sources reminder for plant-based */}
      {(profile.dietary_preference === 'plant_based' || profile.dietary_preference === 'pescatarian') && (
        <Card className="border-emerald-100 bg-emerald-50/50">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-semibold text-emerald-800 mb-1">
              {profile.dietary_preference === 'plant_based' ? '🌱 Plant-Based Protein Sources' : '🐟 Pescatarian Protein Sources'}
            </p>
            <p className="text-xs text-emerald-700">
              {profile.dietary_preference === 'plant_based'
                ? 'Today\'s targets: Focus on tofu, tempeh, edamame, lentils, chickpeas, quinoa, and hemp seeds to hit your protein goal.'
                : 'Great choices: salmon, sardines, tuna, shrimp, tofu, lentils, Greek yogurt, and eggs for complete amino acid profiles.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function WaterLogButton({ userId, today }: { userId: string; today: string }) {
  return (
    <form action={async () => {
      'use server'
      const supabase = await createClient()
      await supabase.from('water_logs').insert({ user_id: userId, date: today, amount_ml: 250 })
    }} className="mt-3">
      <button type="submit" className="text-xs text-blue-600 font-medium hover:underline">
        + 250ml glass
      </button>
    </form>
  )
}
