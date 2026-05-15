'use client'
import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { toDateString, kgToLbs } from '@/lib/utils'
import { TrendingUp, Scale, Ruler, Flame } from 'lucide-react'

export default function ProgressPage() {
  const [measurements, setMeasurements] = useState<any[]>([])
  const [calorieHistory, setCalorieHistory] = useState<any[]>([])
  const [workoutStats, setWorkoutStats] = useState<any[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [newBodyFat, setNewBodyFat] = useState('')
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
      const since = new Date()
      since.setDate(since.getDate() - days)
      const sinceStr = toDateString(since)

      const [measRes, foodRes, workoutRes] = await Promise.all([
        supabase.from('body_measurements').select('*').eq('user_id', user.id).gte('date', sinceStr).order('date'),
        supabase.from('food_logs').select('date, calories, protein_g').eq('user_id', user.id).gte('date', sinceStr).order('date'),
        supabase.from('workout_logs').select('date, duration_minutes, completed').eq('user_id', user.id).gte('date', sinceStr).order('date'),
      ])

      setMeasurements(measRes.data?.map(m => ({
        ...m,
        weight_lbs: m.weight_kg ? kgToLbs(m.weight_kg) : null,
        label: new Date(m.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })) || [])

      // Aggregate food by date
      const foodByDate: Record<string, { date: string; calories: number; protein: number; count: number }> = {}
      for (const f of foodRes.data || []) {
        if (!foodByDate[f.date]) foodByDate[f.date] = { date: f.date, calories: 0, protein: 0, count: 0 }
        foodByDate[f.date].calories += f.calories
        foodByDate[f.date].protein += f.protein_g
        foodByDate[f.date].count++
      }
      setCalorieHistory(Object.values(foodByDate).map(d => ({
        ...d,
        label: new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: Math.round(d.calories),
        protein: Math.round(d.protein),
      })))

      // Aggregate workouts by week
      const workoutByWeek: Record<string, { week: string; count: number; duration: number }> = {}
      for (const w of workoutRes.data || []) {
        const weekStart = new Date(w.date + 'T12:00:00')
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const key = toDateString(weekStart)
        if (!workoutByWeek[key]) workoutByWeek[key] = { week: key, count: 0, duration: 0 }
        if (w.completed) workoutByWeek[key].count++
        workoutByWeek[key].duration += w.duration_minutes || 0
      }
      setWorkoutStats(Object.values(workoutByWeek).map(w => ({
        ...w,
        label: new Date(w.week + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })))
    }
    load()
  }, [range])

  async function logMeasurement() {
    if (!userId || !newWeight) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('body_measurements').insert({
      user_id: userId,
      date: toDateString(),
      weight_kg: parseFloat(newWeight) * 0.453592,
      body_fat_percent: newBodyFat ? parseFloat(newBodyFat) : null,
    })
    setNewWeight('')
    setNewBodyFat('')
    setSaving(false)
    // reload
    window.location.reload()
  }

  const latestMeasurement = measurements[measurements.length - 1]
  const firstMeasurement = measurements[0]
  const weightChange = latestMeasurement && firstMeasurement && latestMeasurement.weight_lbs !== null && firstMeasurement.weight_lbs !== null
    ? latestMeasurement.weight_lbs - firstMeasurement.weight_lbs
    : null

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-500 font-medium">Current Weight</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{latestMeasurement?.weight_lbs?.toFixed(1) ?? '—'} <span className="text-sm font-normal text-slate-400">lbs</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500 font-medium">Weight Change</span>
            </div>
            <p className={`text-2xl font-bold ${weightChange === null ? 'text-slate-300' : weightChange < 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
              {weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs` : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-slate-500 font-medium">Avg Calories</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {calorieHistory.length > 0 ? Math.round(calorieHistory.reduce((s, d) => s + d.calories, 0) / calorieHistory.length) : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Ruler className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-500 font-medium">Body Fat</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{latestMeasurement?.body_fat_percent?.toFixed(1) ?? '—'}<span className="text-sm font-normal text-slate-400">%</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Log measurement */}
      <Card>
        <CardHeader>
          <CardTitle>Log Today's Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Weight (lbs)</label>
              <Input type="number" placeholder="165" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Body Fat % (optional)</label>
              <Input type="number" placeholder="18" value={newBodyFat} onChange={e => setNewBodyFat(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={logMeasurement} disabled={!newWeight || saving}>
                {saving ? 'Saving...' : 'Log'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="weight">
        <TabsList>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Over Time</CardTitle>
              <CardDescription>{measurements.length} measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {measurements.length > 1 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={measurements}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} unit=" lbs" />
                    <Tooltip formatter={(v: any) => [`${v} lbs`, 'Weight']} />
                    <Area type="monotone" dataKey="weight_lbs" stroke="#10b981" strokeWidth={2} fill="url(#weightGrad)" dot={{ r: 3, fill: '#10b981' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                  Log more measurements to see your trend
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Daily Calories & Protein</CardTitle>
            </CardHeader>
            <CardContent>
              {calorieHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={calorieHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="cal" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="prot" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="cal" dataKey="calories" name="Calories" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="prot" dataKey="protein" name="Protein (g)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                  Log food to see your nutrition trends
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Workouts per Week</CardTitle>
            </CardHeader>
            <CardContent>
              {workoutStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={workoutStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Workouts" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                  Complete workouts to see your consistency
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
