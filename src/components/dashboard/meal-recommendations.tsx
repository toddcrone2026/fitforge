'use client'
import { useState } from 'react'
import { Clock, Flame, Dumbbell, Plus, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getDailyRecommendations, DIET_LABELS, PROTEIN_TIPS } from '@/lib/meal-recommendations'
import type { DietaryPreference, MealType } from '@/types'
import type { MealRecommendation } from '@/lib/meal-recommendations'

interface MealRecommendationsProps {
  diet: DietaryPreference
  onLogMeal?: (meal: MealRecommendation) => void
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
}

const TAG_COLORS: Record<string, string> = {
  'High Protein': 'bg-emerald-100 text-emerald-700',
  'High Fiber': 'bg-purple-100 text-purple-700',
  'Omega-3 Rich': 'bg-blue-100 text-blue-700',
  'Complete Protein': 'bg-teal-100 text-teal-700',
  'Low Carb': 'bg-orange-100 text-orange-700',
  'Low Fat': 'bg-yellow-100 text-yellow-700',
  'Quick': 'bg-slate-100 text-slate-700',
  'Meal Prep': 'bg-indigo-100 text-indigo-700',
  'Energy Boost': 'bg-amber-100 text-amber-700',
  'Mediterranean': 'bg-cyan-100 text-cyan-700',
  'Antioxidant Rich': 'bg-rose-100 text-rose-700',
  'Comfort Food': 'bg-pink-100 text-pink-700',
}

function MealCard({ meal, onLog }: { meal: MealRecommendation; onLog?: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-sm text-slate-900">{meal.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[meal.tag] || 'bg-slate-100 text-slate-600'}`}>
                {meal.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{meal.description}</p>
          </div>
          {onLog && (
            <Button size="sm" className="h-8 flex-shrink-0" onClick={onLog}>
              <Plus className="w-3 h-3 mr-1" /> Log
            </Button>
          )}
        </div>

        {/* Macro strip */}
        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="font-semibold">{meal.calories}</span>
            <span className="text-slate-400">kcal</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-emerald-600">{meal.protein_g}g</span>
            <span className="text-slate-400"> protein</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-blue-600">{meal.carbs_g}g</span>
            <span className="text-slate-400"> carbs</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-amber-600">{meal.fat_g}g</span>
            <span className="text-slate-400"> fat</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Clock className="w-3 h-3" />
            {meal.prep_time_min === 0 ? 'No prep' : `${meal.prep_time_min}m`}
          </div>
        </div>

        {/* Ingredients toggle */}
        <button
          className="flex items-center gap-1 mt-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'Show'} ingredients
        </button>

        {expanded && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meal.ingredients.map(ing => (
              <span key={ing} className="text-xs bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-slate-600">
                {ing}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function MealRecommendations({ diet, onLogMeal }: MealRecommendationsProps) {
  const recommendations = getDailyRecommendations(diet)
  const tips = PROTEIN_TIPS[diet]
  const [tipIndex] = useState(() => Math.floor(Math.random() * tips.length))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Meal Ideas</CardTitle>
            <CardDescription>{DIET_LABELS[diet]} recommendations for today</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily tip */}
        <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tips[tipIndex]}</p>
        </div>

        <Tabs defaultValue="breakfast">
          <TabsList className="w-full grid grid-cols-4">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(meal => (
              <TabsTrigger key={meal} value={meal} className="text-xs">
                {MEAL_LABELS[meal]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(mealType => (
            <TabsContent key={mealType} value={mealType} className="space-y-3">
              {recommendations[mealType].map((meal, i) => (
                <MealCard
                  key={i}
                  meal={meal}
                  onLog={onLogMeal ? () => onLogMeal(meal) : undefined}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
