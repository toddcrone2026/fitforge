import type { EquipmentType, FitnessGoal, WorkoutPlanSession } from '@/types'

interface ExerciseTemplate {
  name: string
  equipment: EquipmentType[]
  category: string
  muscle_groups: string[]
  sets: number
  reps_min: number
  reps_max: number
  rest_seconds: number
  is_compound: boolean
}

const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // Push — chest, shoulders, triceps
  { name: 'Push-Up', equipment: ['bodyweight_only', 'yoga_mat'], category: 'push', muscle_groups: ['chest', 'shoulders', 'triceps'], sets: 3, reps_min: 8, reps_max: 15, rest_seconds: 60, is_compound: true },
  { name: 'Barbell Bench Press', equipment: ['barbell', 'bench', 'squat_rack'], category: 'push', muscle_groups: ['chest', 'shoulders', 'triceps'], sets: 4, reps_min: 5, reps_max: 8, rest_seconds: 180, is_compound: true },
  { name: 'Dumbbell Bench Press', equipment: ['dumbbells', 'bench'], category: 'push', muscle_groups: ['chest', 'shoulders', 'triceps'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 90, is_compound: true },
  { name: 'Dumbbell Shoulder Press', equipment: ['dumbbells'], category: 'push', muscle_groups: ['shoulders', 'triceps'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 90, is_compound: false },
  { name: 'Resistance Band Chest Press', equipment: ['resistance_bands'], category: 'push', muscle_groups: ['chest', 'shoulders', 'triceps'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 60, is_compound: false },
  { name: 'Cable Chest Fly', equipment: ['cables'], category: 'push', muscle_groups: ['chest'], sets: 3, reps_min: 12, reps_max: 15, rest_seconds: 60, is_compound: false },
  { name: 'Tricep Dips', equipment: ['bodyweight_only'], category: 'push', muscle_groups: ['triceps', 'chest'], sets: 3, reps_min: 8, reps_max: 15, rest_seconds: 60, is_compound: false },
  { name: 'Overhead Press (Barbell)', equipment: ['barbell', 'squat_rack'], category: 'push', muscle_groups: ['shoulders', 'triceps'], sets: 4, reps_min: 5, reps_max: 8, rest_seconds: 180, is_compound: true },
  { name: 'Kettlebell Press', equipment: ['kettlebell'], category: 'push', muscle_groups: ['shoulders', 'triceps'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 90, is_compound: false },
  { name: 'Pike Push-Up', equipment: ['bodyweight_only'], category: 'push', muscle_groups: ['shoulders', 'triceps'], sets: 3, reps_min: 8, reps_max: 15, rest_seconds: 60, is_compound: false },

  // Pull — back, biceps
  { name: 'Pull-Up', equipment: ['pull_up_bar', 'bodyweight_only'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 5, reps_max: 12, rest_seconds: 90, is_compound: true },
  { name: 'Chin-Up', equipment: ['pull_up_bar'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 5, reps_max: 12, rest_seconds: 90, is_compound: true },
  { name: 'Barbell Row', equipment: ['barbell'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 4, reps_min: 5, reps_max: 8, rest_seconds: 180, is_compound: true },
  { name: 'Dumbbell Row', equipment: ['dumbbells', 'bench'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 90, is_compound: true },
  { name: 'Resistance Band Row', equipment: ['resistance_bands'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 12, reps_max: 15, rest_seconds: 60, is_compound: false },
  { name: 'Cable Lat Pulldown', equipment: ['cables'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 90, is_compound: true },
  { name: 'TRX Row', equipment: ['trx'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 60, is_compound: true },
  { name: 'Inverted Row', equipment: ['bodyweight_only'], category: 'pull', muscle_groups: ['back', 'biceps'], sets: 3, reps_min: 8, reps_max: 15, rest_seconds: 60, is_compound: true },

  // Legs
  { name: 'Bodyweight Squat', equipment: ['bodyweight_only'], category: 'legs', muscle_groups: ['quads', 'glutes', 'hamstrings'], sets: 3, reps_min: 15, reps_max: 20, rest_seconds: 60, is_compound: true },
  { name: 'Barbell Back Squat', equipment: ['barbell', 'squat_rack'], category: 'legs', muscle_groups: ['quads', 'glutes', 'hamstrings'], sets: 4, reps_min: 5, reps_max: 8, rest_seconds: 180, is_compound: true },
  { name: 'Goblet Squat', equipment: ['kettlebell', 'dumbbells'], category: 'legs', muscle_groups: ['quads', 'glutes'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 90, is_compound: true },
  { name: 'Romanian Deadlift', equipment: ['barbell', 'dumbbells'], category: 'legs', muscle_groups: ['hamstrings', 'glutes', 'back'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 120, is_compound: true },
  { name: 'Dumbbell Lunge', equipment: ['dumbbells'], category: 'legs', muscle_groups: ['quads', 'glutes', 'hamstrings'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 90, is_compound: true },
  { name: 'Walking Lunge', equipment: ['bodyweight_only'], category: 'legs', muscle_groups: ['quads', 'glutes', 'hamstrings'], sets: 3, reps_min: 12, reps_max: 20, rest_seconds: 60, is_compound: true },
  { name: 'Resistance Band Glute Bridge', equipment: ['resistance_bands', 'yoga_mat'], category: 'legs', muscle_groups: ['glutes', 'hamstrings'], sets: 3, reps_min: 15, reps_max: 20, rest_seconds: 60, is_compound: false },
  { name: 'Kettlebell Swing', equipment: ['kettlebell'], category: 'legs', muscle_groups: ['glutes', 'hamstrings', 'back'], sets: 4, reps_min: 10, reps_max: 20, rest_seconds: 60, is_compound: true },
  { name: 'Leg Press (Machine)', equipment: ['machines'], category: 'legs', muscle_groups: ['quads', 'glutes'], sets: 4, reps_min: 10, reps_max: 15, rest_seconds: 90, is_compound: true },
  { name: 'Calf Raise', equipment: ['bodyweight_only', 'dumbbells'], category: 'legs', muscle_groups: ['calves'], sets: 4, reps_min: 15, reps_max: 25, rest_seconds: 45, is_compound: false },
  { name: 'Barbell Deadlift', equipment: ['barbell'], category: 'legs', muscle_groups: ['hamstrings', 'glutes', 'back'], sets: 4, reps_min: 3, reps_max: 6, rest_seconds: 240, is_compound: true },

  // Core
  { name: 'Plank', equipment: ['bodyweight_only', 'yoga_mat'], category: 'core', muscle_groups: ['core', 'shoulders'], sets: 3, reps_min: 30, reps_max: 60, rest_seconds: 45, is_compound: false },
  { name: 'Dead Bug', equipment: ['yoga_mat'], category: 'core', muscle_groups: ['core'], sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 45, is_compound: false },
  { name: 'Russian Twist', equipment: ['bodyweight_only', 'dumbbells', 'kettlebell'], category: 'core', muscle_groups: ['core', 'obliques'], sets: 3, reps_min: 12, reps_max: 20, rest_seconds: 45, is_compound: false },
  { name: 'Bicycle Crunch', equipment: ['bodyweight_only', 'yoga_mat'], category: 'core', muscle_groups: ['core', 'obliques'], sets: 3, reps_min: 15, reps_max: 20, rest_seconds: 45, is_compound: false },
  { name: 'TRX Ab Pike', equipment: ['trx'], category: 'core', muscle_groups: ['core'], sets: 3, reps_min: 10, reps_max: 15, rest_seconds: 60, is_compound: false },

  // Cardio/HIIT
  { name: 'Jump Rope', equipment: ['jump_rope'], category: 'cardio', muscle_groups: ['full_body'], sets: 3, reps_min: 60, reps_max: 120, rest_seconds: 30, is_compound: true },
  { name: 'Burpee', equipment: ['bodyweight_only'], category: 'cardio', muscle_groups: ['full_body'], sets: 4, reps_min: 8, reps_max: 15, rest_seconds: 30, is_compound: true },
  { name: 'Mountain Climber', equipment: ['bodyweight_only', 'yoga_mat'], category: 'cardio', muscle_groups: ['core', 'full_body'], sets: 4, reps_min: 20, reps_max: 30, rest_seconds: 30, is_compound: true },
  { name: 'Box Jump', equipment: ['bodyweight_only'], category: 'cardio', muscle_groups: ['legs', 'glutes'], sets: 4, reps_min: 6, reps_max: 10, rest_seconds: 90, is_compound: true },
]

function exerciseFitsEquipment(ex: ExerciseTemplate, userEquipment: EquipmentType[]): boolean {
  if (userEquipment.includes('bodyweight_only') && ex.equipment.includes('bodyweight_only')) return true
  return ex.equipment.some(e => userEquipment.includes(e))
}

function pickExercises(
  category: string,
  equipment: EquipmentType[],
  count: number,
  goal: FitnessGoal,
  preferCompound: boolean
): ExerciseTemplate[] {
  let pool = EXERCISE_LIBRARY.filter(
    e => e.category === category && exerciseFitsEquipment(e, equipment)
  )

  if (preferCompound) {
    const compound = pool.filter(e => e.is_compound)
    const isolation = pool.filter(e => !e.is_compound)
    pool = [...compound, ...isolation]
  }

  // Adjust rep ranges for goal
  return pool.slice(0, count).map(ex => {
    if (goal === 'build_strength') return { ...ex, sets: Math.min(ex.sets + 1, 5), reps_min: 3, reps_max: 6, rest_seconds: 180 }
    if (goal === 'gain_muscle') return { ...ex, sets: 3, reps_min: 8, reps_max: 12, rest_seconds: 90 }
    if (goal === 'burn_fat') return { ...ex, sets: 3, reps_min: 12, reps_max: 20, rest_seconds: 45 }
    if (goal === 'lose_weight') return { ...ex, sets: 3, reps_min: 12, reps_max: 20, rest_seconds: 60 }
    return ex
  })
}

export function generateWorkoutPlan(
  goal: FitnessGoal,
  equipment: EquipmentType[],
  daysPerWeek: number
): WorkoutPlanSession[] {
  const preferCompound = goal === 'build_strength' || goal === 'gain_muscle'

  if (daysPerWeek <= 3) {
    // Full body splits
    return Array.from({ length: daysPerWeek }, (_, i) => ({
      id: `session-${i}`,
      plan_id: '',
      day_of_week: [1, 3, 5][i] ?? i,
      name: `Full Body Day ${i + 1}`,
      exercises: [
        ...pickExercises('legs', equipment, 2, goal, preferCompound),
        ...pickExercises('push', equipment, 2, goal, preferCompound),
        ...pickExercises('pull', equipment, 2, goal, preferCompound),
        ...pickExercises('core', equipment, 1, goal, false),
      ].map((ex, idx) => ({
        id: `ex-${i}-${idx}`,
        session_id: `session-${i}`,
        exercise_id: ex.name.toLowerCase().replace(/\s+/g, '-'),
        exercise: { id: ex.name.toLowerCase().replace(/\s+/g, '-'), name: ex.name, category: ex.category, muscle_groups: ex.muscle_groups, equipment_required: ex.equipment, instructions: '', difficulty: 'intermediate' as const, is_compound: ex.is_compound },
        sets: ex.sets,
        reps_min: ex.reps_min,
        reps_max: ex.reps_max,
        rest_seconds: ex.rest_seconds,
        order_index: idx,
      })),
    }))
  }

  // Upper/Lower or Push/Pull/Legs split for 4-5 days
  const templates = daysPerWeek === 4
    ? [
        { name: 'Upper A', categories: ['push', 'pull', 'core'] },
        { name: 'Lower A', categories: ['legs', 'core', 'cardio'] },
        { name: 'Upper B', categories: ['push', 'pull', 'core'] },
        { name: 'Lower B', categories: ['legs', 'core', 'cardio'] },
      ]
    : [
        { name: 'Push', categories: ['push', 'core'] },
        { name: 'Pull', categories: ['pull', 'core'] },
        { name: 'Legs', categories: ['legs', 'cardio'] },
        { name: 'Upper', categories: ['push', 'pull'] },
        { name: 'Full Body', categories: ['legs', 'push', 'pull', 'core'] },
      ]

  const dayMap = [1, 2, 3, 4, 5, 6, 0]

  return templates.slice(0, daysPerWeek).map((tmpl, i) => ({
    id: `session-${i}`,
    plan_id: '',
    day_of_week: dayMap[i],
    name: tmpl.name,
    exercises: tmpl.categories.flatMap((cat, ci) =>
      pickExercises(cat, equipment, cat === 'core' || cat === 'cardio' ? 1 : 2, goal, preferCompound).map((ex, eidx) => ({
        id: `ex-${i}-${ci}-${eidx}`,
        session_id: `session-${i}`,
        exercise_id: ex.name.toLowerCase().replace(/\s+/g, '-'),
        exercise: { id: ex.name.toLowerCase().replace(/\s+/g, '-'), name: ex.name, category: ex.category, muscle_groups: ex.muscle_groups, equipment_required: ex.equipment, instructions: '', difficulty: 'intermediate' as const, is_compound: ex.is_compound },
        sets: ex.sets,
        reps_min: ex.reps_min,
        reps_max: ex.reps_max,
        rest_seconds: ex.rest_seconds,
        order_index: ci * 10 + eidx,
      }))
    ),
  }))
}
