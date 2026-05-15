'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Dumbbell, Play, Check, ChevronDown, ChevronUp, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SetLogger } from '@/components/workout/set-logger'
import { createClient } from '@/lib/supabase/client'
import { generateWorkoutPlan } from '@/lib/workout-generator'
import { toDateString } from '@/lib/utils'
import type { WorkoutPlanSession, WorkoutSet, EquipmentType, FitnessGoal } from '@/types'

interface ActiveExercise {
  name: string
  sets: WorkoutSet[]
  target_sets: number
  reps_min: number
  reps_max: number
  rest_seconds: number
  expanded: boolean
}

export default function WorkoutPage() {
  const [profile, setProfile] = useState<any>(null)
  const [plan, setPlan] = useState<WorkoutPlanSession[] | null>(null)
  const [todaySession, setTodaySession] = useState<WorkoutPlanSession | null>(null)
  const [activeWorkout, setActiveWorkout] = useState<{ name: string; exercises: ActiveExercise[] } | null>(null)
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, workoutsRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('workout_logs').select('*, workout_log_exercises(*, workout_sets(*))').eq('user_id', user.id).order('date', { ascending: false }).limit(10),
      ])

      if (profileRes.data) {
        setProfile(profileRes.data)
        const generatedPlan = generateWorkoutPlan(
          profileRes.data.fitness_goal as FitnessGoal,
          profileRes.data.equipment as EquipmentType[],
          profileRes.data.days_per_week || 3
        )
        setPlan(generatedPlan)
        const dayOfWeek = new Date().getDay()
        const todaySess = generatedPlan.find(s => s.day_of_week === dayOfWeek)
        setTodaySession(todaySess || null)
      }

      setRecentWorkouts(workoutsRes.data || [])
    }
    load()
  }, [])

  function startWorkout(session?: WorkoutPlanSession) {
    const exercises: ActiveExercise[] = session
      ? session.exercises.map(ex => ({
          name: ex.exercise.name,
          sets: [],
          target_sets: ex.sets,
          reps_min: ex.reps_min,
          reps_max: ex.reps_max,
          rest_seconds: ex.rest_seconds,
          expanded: true,
        }))
      : []

    setActiveWorkout({
      name: session?.name || 'Custom Workout',
      exercises,
    })
    setStartTime(new Date())
  }

  function updateSet(exerciseIdx: number, setUpdate: Partial<WorkoutSet> & { set_number: number }) {
    setActiveWorkout(prev => {
      if (!prev) return prev
      const exercises = [...prev.exercises]
      const ex = { ...exercises[exerciseIdx] }
      const existingIdx = ex.sets.findIndex(s => s.set_number === setUpdate.set_number)
      if (existingIdx >= 0) {
        ex.sets = ex.sets.map((s, i) => i === existingIdx ? { ...s, ...setUpdate } : s)
      } else {
        ex.sets = [...ex.sets, { id: '', workout_log_exercise_id: '', duration_seconds: undefined, distance_m: undefined, rpe: undefined, ...setUpdate } as WorkoutSet]
      }
      exercises[exerciseIdx] = ex
      return { ...prev, exercises }
    })
  }

  function toggleExpand(idx: number) {
    setActiveWorkout(prev => {
      if (!prev) return prev
      const exercises = prev.exercises.map((ex, i) => i === idx ? { ...ex, expanded: !ex.expanded } : ex)
      return { ...prev, exercises }
    })
  }

  async function finishWorkout() {
    if (!activeWorkout || !profile) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : undefined

    const { data: log } = await supabase.from('workout_logs').insert({
      user_id: user.id,
      date: toDateString(),
      name: activeWorkout.name,
      duration_minutes: duration,
      completed: true,
    }).select().single()

    if (log) {
      for (const ex of activeWorkout.exercises) {
        const { data: logEx } = await supabase.from('workout_log_exercises').insert({
          workout_log_id: log.id,
          exercise_name: ex.name,
          order_index: activeWorkout.exercises.indexOf(ex),
        }).select().single()

        if (logEx && ex.sets.length > 0) {
          await supabase.from('workout_sets').insert(
            ex.sets.map(s => ({
              workout_log_exercise_id: logEx.id,
              set_number: s.set_number,
              weight_kg: s.weight_kg,
              reps: s.reps,
              completed: s.completed,
            }))
          )
        }
      }
    }

    setActiveWorkout(null)
    setSaving(false)
    router.refresh()
  }

  if (activeWorkout) {
    const completedSets = activeWorkout.exercises.reduce((s, ex) => s + ex.sets.filter(set => set.completed).length, 0)
    const totalSets = activeWorkout.exercises.reduce((s, ex) => s + ex.target_sets, 0)

    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeWorkout.name}</h1>
            <p className="text-sm text-slate-500">{completedSets}/{totalSets} sets complete</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Timer className="w-4 h-4" />
            {startTime ? `${Math.round((Date.now() - startTime.getTime()) / 60000)}m` : '0m'}
          </div>
        </div>

        <div className="h-2 bg-slate-100 rounded-full">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }}
          />
        </div>

        {activeWorkout.exercises.map((ex, idx) => (
          <Card key={idx}>
            <CardHeader>
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleExpand(idx)}
              >
                <div>
                  <CardTitle className="text-base">{ex.name}</CardTitle>
                  <CardDescription>{ex.target_sets} sets · {ex.reps_min}–{ex.reps_max} reps · {ex.rest_seconds}s rest</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ex.sets.filter(s => s.completed).length >= ex.target_sets ? 'default' : 'secondary'}>
                    {ex.sets.filter(s => s.completed).length}/{ex.target_sets}
                  </Badge>
                  {ex.expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>
            </CardHeader>
            {ex.expanded && (
              <CardContent>
                <SetLogger
                  sets={ex.sets}
                  targetSets={ex.target_sets}
                  targetRepsMin={ex.reps_min}
                  targetRepsMax={ex.reps_max}
                  onUpdateSet={upd => updateSet(idx, upd)}
                />
              </CardContent>
            )}
          </Card>
        ))}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => setActiveWorkout(null)} className="flex-1">
            Discard
          </Button>
          <Button onClick={finishWorkout} disabled={saving} className="flex-1" size="lg">
            <Check className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Finish Workout'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Workouts</h1>

      {/* Today's plan */}
      {todaySession && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="default" className="mb-2">Today's Workout</Badge>
                <CardTitle>{todaySession.name}</CardTitle>
                <CardDescription>{todaySession.exercises.length} exercises</CardDescription>
              </div>
              <Button onClick={() => startWorkout(todaySession)}>
                <Play className="w-4 h-4 mr-2" /> Start
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaySession.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Dumbbell className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{ex.exercise.name}</span>
                  <span className="text-slate-500">{ex.sets}×{ex.reps_min}–{ex.reps_max}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full weekly plan */}
      {plan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Weekly Plan</CardTitle>
            <CardDescription>
              Based on your goal and available equipment — {profile?.days_per_week || 3} days/week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.map((session, i) => {
                const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                const isToday = session.day_of_week === new Date().getDay()
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl ${isToday ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 w-8">{DAYS[session.day_of_week]}</span>
                        <span className="font-semibold text-sm text-slate-900">{session.name}</span>
                        {isToday && <Badge variant="default" className="text-xs">Today</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 ml-10">{session.exercises.length} exercises</p>
                    </div>
                    <Button size="sm" variant={isToday ? 'default' : 'outline'} onClick={() => startWorkout(session)}>
                      <Play className="w-3 h-3 mr-1" /> Start
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Log a custom workout session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => startWorkout()} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Start Empty Workout
          </Button>
        </CardContent>
      </Card>

      {/* Recent workouts */}
      {recentWorkouts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Workouts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkouts.slice(0, 5).map((w: any) => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{w.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {w.duration_minutes && ` · ${w.duration_minutes}min`}
                    </p>
                  </div>
                  <Badge variant={w.completed ? 'default' : 'secondary'}>
                    {w.completed ? '✓' : 'Partial'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
