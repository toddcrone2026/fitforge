'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { calculateTDEE, calculateMacros, macroPercents } from '@/lib/macros'
import { kgToLbs, lbsToKg, cmToInches, feetInchesToCm, formatGoal, formatActivity } from '@/lib/utils'
import { Loader2, Save } from 'lucide-react'
import type { ActivityLevel, DietaryPreference, EquipmentType, FitnessGoal, Gender } from '@/types'

const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string }[] = [
  { value: 'bodyweight_only', label: 'Bodyweight Only' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'barbell', label: 'Barbell' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'resistance_bands', label: 'Resistance Bands' },
  { value: 'pull_up_bar', label: 'Pull-Up Bar' },
  { value: 'bench', label: 'Bench' },
  { value: 'squat_rack', label: 'Squat Rack' },
  { value: 'cables', label: 'Cable Machine' },
  { value: 'machines', label: 'Weight Machines' },
  { value: 'trx', label: 'TRX / Suspension' },
  { value: 'yoga_mat', label: 'Yoga Mat' },
  { value: 'jump_rope', label: 'Jump Rope' },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [weightLbs, setWeightLbs] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active')
  const [goal, setGoal] = useState<FitnessGoal>('maintain')
  const [diet, setDiet] = useState<DietaryPreference>('pescatarian')
  const [equipment, setEquipment] = useState<EquipmentType[]>([])
  const [daysPerWeek, setDaysPerWeek] = useState(3)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setProfile(data)
        setName(data.name || '')
        setAge(data.age?.toString() || '')
        setGender(data.gender || 'male')
        setWeightLbs(kgToLbs(data.weight_kg).toString())
        const totalInches = cmToInches(data.height_cm)
        setHeightFt(Math.floor(totalInches / 12).toString())
        setHeightIn((totalInches % 12).toFixed(0))
        setActivityLevel(data.activity_level || 'moderately_active')
        setGoal(data.fitness_goal || 'maintain')
        setDiet(data.dietary_preference || 'pescatarian')
        setEquipment(data.equipment || [])
        setDaysPerWeek(data.days_per_week || 3)
      }
    }
    load()
  }, [])

  const tdee = age && heightFt && weightLbs
    ? calculateTDEE(lbsToKg(parseFloat(weightLbs)), feetInchesToCm(parseFloat(heightFt), parseFloat(heightIn || '0')), parseInt(age), gender, activityLevel)
    : 0
  const macros = tdee ? calculateMacros(tdee, goal, lbsToKg(parseFloat(weightLbs) || 0)) : null
  const percents = macros ? macroPercents(macros) : null

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('user_profiles').upsert({
      user_id: user.id,
      name,
      age: parseInt(age),
      gender,
      weight_kg: lbsToKg(parseFloat(weightLbs)),
      height_cm: feetInchesToCm(parseFloat(heightFt), parseFloat(heightIn || '0')),
      activity_level: activityLevel,
      fitness_goal: goal,
      dietary_preference: diet,
      equipment,
      days_per_week: daysPerWeek,
      tdee,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleEquip(e: EquipmentType) {
    setEquipment(prev =>
      prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>

      {/* Macro targets */}
      {macros && (
        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Your Daily Targets</CardTitle>
            <CardDescription className="text-slate-400">Recalculated from your current profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-emerald-400">{macros.calories}</div>
              <div className="text-slate-400 text-sm">calories/day (TDEE: {tdee})</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Protein', value: macros.protein_g, pct: percents?.protein, color: 'text-emerald-400' },
                { label: 'Carbs', value: macros.carbs_g, pct: percents?.carbs, color: 'text-blue-400' },
                { label: 'Fat', value: macros.fat_g, pct: percents?.fat, color: 'text-amber-400' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800 rounded-xl p-3">
                  <div className={`text-2xl font-bold ${m.color}`}>{m.value}g</div>
                  <div className="text-xs text-slate-400">{m.label} · {m.pct}%</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-center">
              <div className="bg-slate-800 rounded-xl p-2">
                <div className="text-lg font-bold text-purple-400">{macros.fiber_g}g</div>
                <div className="text-xs text-slate-400">Fiber</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-2">
                <div className="text-lg font-bold text-pink-400">&lt;{macros.sugar_g}g</div>
                <div className="text-xs text-slate-400">Sugar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal info */}
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="28" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
            <div className="flex gap-2">
              <Input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="5 ft" />
              <Input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="10 in" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (lbs)</label>
            <Input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} placeholder="160" />
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader><CardTitle>Goals & Activity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fitness Goal</label>
            <Select value={goal} onValueChange={(v) => setGoal(v as FitnessGoal)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['lose_weight', 'gain_muscle', 'build_strength', 'burn_fat', 'maintain', 'improve_endurance'].map(g => (
                  <SelectItem key={g} value={g}>{formatGoal(g)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
            <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'].map(a => (
                  <SelectItem key={a} value={a}>{formatActivity(a)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dietary Preference</label>
            <Select value={diet} onValueChange={(v) => setDiet(v as DietaryPreference)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="plant_based">🌱 Plant-Based</SelectItem>
                <SelectItem value="pescatarian">🐟 Pescatarian</SelectItem>
                <SelectItem value="vegetarian">🥦 Vegetarian</SelectItem>
                <SelectItem value="omnivore">🍽️ Omnivore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Training Days per Week</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  onClick={() => setDaysPerWeek(d)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${daysPerWeek === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Available Equipment</CardTitle>
          <CardDescription>Used to generate your workout plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(eq => (
              <button
                key={eq.value}
                onClick={() => toggleEquip(eq.value)}
                className={`text-left text-sm px-3 py-2 rounded-xl border-2 transition-all font-medium ${equipment.includes(eq.value) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-700'}`}
              >
                {eq.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        {saved ? '✓ Saved!' : 'Save Changes'}
      </Button>
    </div>
  )
}
