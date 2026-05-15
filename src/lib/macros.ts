import type { ActivityLevel, FitnessGoal, Gender, MacroTargets } from '@/types'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
}

/** Mifflin-St Jeor equation */
export function calculateBMR(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age
  return gender === 'female' ? base - 161 : base + 5
}

export function calculateTDEE(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: Gender,
  activity_level: ActivityLevel
): number {
  const bmr = calculateBMR(weight_kg, height_cm, age, gender)
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity_level])
}

export function calculateMacros(
  tdee: number,
  goal: FitnessGoal,
  weight_kg: number
): MacroTargets {
  let calories = tdee

  if (goal === 'lose_weight' || goal === 'burn_fat') calories = tdee - 500
  if (goal === 'gain_muscle') calories = tdee + 300
  if (goal === 'build_strength') calories = tdee + 150

  // Protein: 1.6–2.2g per kg body weight depending on goal
  let proteinMultiplier = 1.8
  if (goal === 'gain_muscle') proteinMultiplier = 2.2
  if (goal === 'build_strength') proteinMultiplier = 2.0
  if (goal === 'lose_weight' || goal === 'burn_fat') proteinMultiplier = 2.0

  const protein_g = Math.round(weight_kg * proteinMultiplier)
  const protein_cals = protein_g * 4

  // Fat: 25-30% of calories
  const fat_percent = goal === 'burn_fat' ? 0.25 : 0.28
  const fat_g = Math.round((calories * fat_percent) / 9)
  const fat_cals = fat_g * 9

  // Carbs: remaining calories
  const carb_cals = calories - protein_cals - fat_cals
  const carbs_g = Math.round(carb_cals / 4)

  // Fiber: 14g per 1000 kcal (DRI recommendation)
  const fiber_g = Math.round((calories / 1000) * 14)

  // Sugar: <10% of calories
  const sugar_g = Math.round((calories * 0.08) / 4)

  return {
    calories: Math.round(calories),
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    sugar_g,
  }
}

export function macroPercents(macros: MacroTargets) {
  const protein_cals = macros.protein_g * 4
  const carbs_cals = macros.carbs_g * 4
  const fat_cals = macros.fat_g * 9
  const total = protein_cals + carbs_cals + fat_cals

  return {
    protein: Math.round((protein_cals / total) * 100),
    carbs: Math.round((carbs_cals / total) * 100),
    fat: Math.round((fat_cals / total) * 100),
  }
}
