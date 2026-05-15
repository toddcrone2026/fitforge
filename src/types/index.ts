export type DietaryPreference = 'plant_based' | 'pescatarian' | 'vegetarian' | 'omnivore'

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active'

export type FitnessGoal =
  | 'lose_weight'
  | 'gain_muscle'
  | 'build_strength'
  | 'burn_fat'
  | 'maintain'
  | 'improve_endurance'

export type Gender = 'male' | 'female' | 'other'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type EquipmentType =
  | 'barbell'
  | 'dumbbells'
  | 'kettlebell'
  | 'resistance_bands'
  | 'pull_up_bar'
  | 'bench'
  | 'squat_rack'
  | 'cables'
  | 'machines'
  | 'trx'
  | 'yoga_mat'
  | 'jump_rope'
  | 'bodyweight_only'

export interface UserProfile {
  id: string
  user_id: string
  name: string
  age: number
  gender: Gender
  height_cm: number
  weight_kg: number
  activity_level: ActivityLevel
  fitness_goal: FitnessGoal
  dietary_preference: DietaryPreference
  equipment: EquipmentType[]
  tdee: number
  created_at: string
  updated_at: string
}

export interface MacroTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  sugar_g: number
}

export interface FoodItem {
  food_name: string
  nix_item_id?: string
  brand_name?: string
  serving_qty: number
  serving_unit: string
  serving_weight_grams: number
  nf_calories: number
  nf_protein: number
  nf_total_carbohydrate: number
  nf_dietary_fiber: number
  nf_sugars: number
  nf_total_fat: number
  photo?: { thumb: string }
}

export interface FoodLog {
  id: string
  user_id: string
  date: string
  meal_type: MealType
  food_name: string
  brand_name?: string
  serving_qty: number
  serving_unit: string
  serving_weight_grams: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  sugar_g: number
  photo_url?: string
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  category: string
  muscle_groups: string[]
  equipment_required: EquipmentType[]
  instructions: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_compound: boolean
}

export interface WorkoutPlan {
  id: string
  user_id: string
  name: string
  goal: FitnessGoal
  weeks: number
  days_per_week: number
  created_at: string
  sessions: WorkoutPlanSession[]
}

export interface WorkoutPlanSession {
  id: string
  plan_id: string
  day_of_week: number
  name: string
  exercises: WorkoutPlanExercise[]
}

export interface WorkoutPlanExercise {
  id: string
  session_id: string
  exercise_id: string
  exercise: Exercise
  sets: number
  reps_min: number
  reps_max: number
  rest_seconds: number
  notes?: string
  order_index: number
}

export interface WorkoutLog {
  id: string
  user_id: string
  plan_session_id?: string
  date: string
  name: string
  duration_minutes?: number
  notes?: string
  completed: boolean
  exercises: WorkoutLogExercise[]
  created_at: string
}

export interface WorkoutLogExercise {
  id: string
  workout_log_id: string
  exercise_id: string
  exercise_name: string
  order_index: number
  sets: WorkoutSet[]
}

export interface WorkoutSet {
  id: string
  workout_log_exercise_id: string
  set_number: number
  weight_kg?: number
  reps?: number
  duration_seconds?: number
  distance_m?: number
  completed: boolean
  rpe?: number
}

export interface BodyMeasurement {
  id: string
  user_id: string
  date: string
  weight_kg?: number
  body_fat_percent?: number
  chest_cm?: number
  waist_cm?: number
  hips_cm?: number
  thigh_cm?: number
  bicep_cm?: number
  notes?: string
}

export interface WaterLog {
  id: string
  user_id: string
  date: string
  amount_ml: number
  logged_at: string
}

export interface DailyNutritionSummary {
  date: string
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  total_fiber_g: number
  total_sugar_g: number
  meals: { [key in MealType]: FoodLog[] }
}
