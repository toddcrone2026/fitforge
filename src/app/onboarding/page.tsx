'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { calculateTDEE, calculateMacros } from '@/lib/macros'
import { feetInchesToCm, lbsToKg } from '@/lib/utils'
import type { ActivityLevel, DietaryPreference, EquipmentType, FitnessGoal, Gender } from '@/types'

const GOALS: { value: FitnessGoal; label: string; desc: string; emoji: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight', desc: 'Reduce body fat with a calorie deficit', emoji: '🔥' },
  { value: 'gain_muscle', label: 'Gain Muscle', desc: 'Build lean mass with a slight surplus', emoji: '💪' },
  { value: 'build_strength', label: 'Build Strength', desc: 'Increase your maximal lifts', emoji: '🏋️' },
  { value: 'burn_fat', label: 'Burn Fat', desc: 'Improve body composition', emoji: '⚡' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay at your current weight', emoji: '⚖️' },
  { value: 'improve_endurance', label: 'Endurance', desc: 'Boost stamina and cardio', emoji: '🏃' },
]

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Athlete', desc: 'Twice daily or physical job' },
]

const DIETARY_PREFS: { value: DietaryPreference; label: string; desc: string; emoji: string }[] = [
  { value: 'plant_based', label: 'Plant-Based', desc: 'No animal products', emoji: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian', desc: 'Plants + fish & seafood', emoji: '🐟' },
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, includes dairy/eggs', emoji: '🥦' },
  { value: 'omnivore', label: 'Omnivore', desc: 'All foods included', emoji: '🍽️' },
]

const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string; emoji: string }[] = [
  { value: 'bodyweight_only', label: 'Bodyweight Only', emoji: '🤸' },
  { value: 'dumbbells', label: 'Dumbbells', emoji: '🏋️' },
  { value: 'barbell', label: 'Barbell', emoji: '🪝' },
  { value: 'kettlebell', label: 'Kettlebell', emoji: '⚾' },
  { value: 'resistance_bands', label: 'Resistance Bands', emoji: '🎽' },
  { value: 'pull_up_bar', label: 'Pull-Up Bar', emoji: '🔩' },
  { value: 'bench', label: 'Bench', emoji: '🪑' },
  { value: 'squat_rack', label: 'Squat Rack', emoji: '🏗️' },
  { value: 'cables', label: 'Cable Machine', emoji: '🔗' },
  { value: 'machines', label: 'Weight Machines', emoji: '⚙️' },
  { value: 'trx', label: 'TRX / Suspension', emoji: '🧲' },
  { value: 'yoga_mat', label: 'Yoga Mat', emoji: '🧘' },
  { value: 'jump_rope', label: 'Jump Rope', emoji: '🪢' },
]

type Step = 'goal' | 'diet' | 'body' | 'activity' | 'equipment' | 'summary'
const STEPS: Step[] = ['goal', 'diet', 'body', 'activity', 'equipment', 'summary']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('goal')
  const [saving, setSaving] = useState(false)

  const [goal, setGoal] = useState<FitnessGoal | null>(null)
  const [diet, setDiet] = useState<DietaryPreference | null>(null)
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [activity, setActivity] = useState<ActivityLevel | null>(null)
  const [equipment, setEquipment] = useState<EquipmentType[]>([])
  const [daysPerWeek, setDaysPerWeek] = useState(3)

  const stepIndex = STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  function toggleEquipment(item: EquipmentType) {
    if (item === 'bodyweight_only') {
      setEquipment(['bodyweight_only'])
      return
    }
    setEquipment(prev => {
      const filtered = prev.filter(e => e !== 'bodyweight_only')
      return filtered.includes(item) ? filtered.filter(e => e !== item) : [...filtered, item]
    })
  }

  function next() {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }
  function back() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  function canProceed(): boolean {
    if (step === 'goal') return goal !== null
    if (step === 'diet') return diet !== null
    if (step === 'body') return !!age && !!feet && !!weightLbs
    if (step === 'activity') return activity !== null
    if (step === 'equipment') return equipment.length > 0
    return true
  }

  const tdee = age && feet && weightLbs && activity
    ? calculateTDEE(lbsToKg(parseFloat(weightLbs)), feetInchesToCm(parseFloat(feet), parseFloat(inches || '0')), parseInt(age), gender, activity)
    : 0
  const macros = tdee && goal ? calculateMacros(tdee, goal, lbsToKg(parseFloat(weightLbs))) : null

  async function handleSave() {
    if (!goal || !diet || !activity || equipment.length === 0) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const weight_kg = lbsToKg(parseFloat(weightLbs))
    const height_cm = feetInchesToCm(parseFloat(feet), parseFloat(inches || '0'))

    await supabase.from('user_profiles').upsert({
      user_id: user.id,
      name: user.user_metadata?.name || '',
      age: parseInt(age),
      gender,
      height_cm,
      weight_kg,
      activity_level: activity,
      fitness_goal: goal,
      dietary_preference: diet,
      equipment,
      days_per_week: daysPerWeek,
      tdee,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-xl mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-400 text-sm">Step {stepIndex + 1} of {STEPS.length}</p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'goal' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">What's your goal?</h2>
              <p className="text-slate-500 text-sm mb-6">We'll build your plan around this.</p>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all',
                      goal === g.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="text-2xl mb-2">{g.emoji}</div>
                    <div className="font-semibold text-sm text-slate-900">{g.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'diet' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Dietary preference?</h2>
              <p className="text-slate-500 text-sm mb-6">We'll tailor food suggestions and protein sources to match.</p>
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_PREFS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDiet(d.value)}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all',
                      diet === d.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="text-2xl mb-2">{d.emoji}</div>
                    <div className="font-semibold text-sm text-slate-900">{d.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'body' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">About your body</h2>
              <p className="text-slate-500 text-sm mb-6">Used to calculate your personal calorie and macro targets.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sex assigned at birth</label>
                  <div className="flex gap-3">
                    {(['male', 'female', 'other'] as Gender[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          'flex-1 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all',
                          gender === g ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <Input type="number" placeholder="28" value={age} onChange={e => setAge(e.target.value)} min="14" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="5 ft" value={feet} onChange={e => setFeet(e.target.value)} min="3" max="8" />
                    <Input type="number" placeholder="10 in" value={inches} onChange={e => setInches(e.target.value)} min="0" max="11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current weight (lbs)</label>
                  <Input type="number" placeholder="160" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} min="50" max="600" />
                </div>
              </div>
            </div>
          )}

          {step === 'activity' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Activity level</h2>
              <p className="text-slate-500 text-sm mb-6">How active are you outside of your workouts?</p>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(a => (
                  <button
                    key={a.value}
                    onClick={() => setActivity(a.value)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all',
                      activity === a.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{a.label}</div>
                        <div className="text-xs text-slate-500">{a.desc}</div>
                      </div>
                      {activity === a.value && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'equipment' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Available equipment</h2>
              <p className="text-slate-500 text-sm mb-2">Select everything you have access to — at home or the gym.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Days per week you can train</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      onClick={() => setDaysPerWeek(d)}
                      className={cn(
                        'flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all',
                        daysPerWeek === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_OPTIONS.map(eq => (
                  <button
                    key={eq.value}
                    onClick={() => toggleEquipment(eq.value)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all text-left',
                      equipment.includes(eq.value) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-700 hover:border-slate-200'
                    )}
                  >
                    <span>{eq.emoji}</span>
                    <span className="font-medium text-xs">{eq.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'summary' && macros && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Your personalized targets</h2>
              <p className="text-slate-500 text-sm mb-6">Based on your profile — we'll track your progress toward these daily goals.</p>

              <div className="bg-emerald-50 rounded-xl p-4 mb-4 text-center">
                <div className="text-4xl font-bold text-emerald-600">{macros.calories}</div>
                <div className="text-sm text-emerald-700 font-medium">Daily Calories (TDEE: {tdee})</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Protein', value: macros.protein_g, unit: 'g', color: 'emerald' },
                  { label: 'Carbs', value: macros.carbs_g, unit: 'g', color: 'blue' },
                  { label: 'Fat', value: macros.fat_g, unit: 'g', color: 'amber' },
                  { label: 'Fiber', value: macros.fiber_g, unit: 'g', color: 'purple' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-slate-900">{m.value}<span className="text-sm font-normal text-slate-400">g</span></div>
                    <div className="text-xs text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 text-center mb-4">These targets can be adjusted anytime in your profile settings.</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {stepIndex > 0 && (
              <Button variant="outline" onClick={back} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step !== 'summary' ? (
              <Button onClick={next} disabled={!canProceed()} className="flex-1">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving} className="flex-1" size="lg">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start My Journey 🚀'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
