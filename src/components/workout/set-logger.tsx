'use client'
import { useState } from 'react'
import { Check, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { WorkoutSet } from '@/types'

interface SetLoggerProps {
  sets: WorkoutSet[]
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  onUpdateSet: (set: Partial<WorkoutSet> & { set_number: number }) => void
}

export function SetLogger({ sets, targetSets, targetRepsMin, targetRepsMax, onUpdateSet }: SetLoggerProps) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs')

  const displayedSets = Array.from({ length: Math.max(sets.length, targetSets) }, (_, i) => {
    return sets.find(s => s.set_number === i + 1) || {
      id: '',
      workout_log_exercise_id: '',
      set_number: i + 1,
      weight_kg: undefined,
      reps: undefined,
      completed: false,
    }
  })

  function toKg(val: number) {
    return unit === 'lbs' ? val * 0.453592 : val
  }
  function fromKg(val: number) {
    return unit === 'lbs' ? Math.round(val * 2.20462 * 10) / 10 : val
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-4 gap-2 text-xs text-slate-400 font-medium px-1 flex-1">
          <span>SET</span>
          <span>WEIGHT ({unit})</span>
          <span>REPS ({targetRepsMin}-{targetRepsMax})</span>
          <span></span>
        </div>
        <button
          className="text-xs text-emerald-600 font-medium hover:underline ml-2"
          onClick={() => setUnit(u => u === 'kg' ? 'lbs' : 'kg')}
        >
          {unit === 'kg' ? 'Switch to lbs' : 'Switch to kg'}
        </button>
      </div>

      {displayedSets.map(set => {
        const displayWeight = set.weight_kg !== undefined ? fromKg(set.weight_kg) : ''
        return (
          <div
            key={set.set_number}
            className={cn(
              'grid grid-cols-4 gap-2 items-center p-2 rounded-lg transition-colors',
              set.completed ? 'bg-emerald-50' : 'bg-slate-50'
            )}
          >
            <span className={cn('text-sm font-semibold pl-1', set.completed ? 'text-emerald-600' : 'text-slate-500')}>
              {set.set_number}
            </span>
            <Input
              type="number"
              placeholder="0"
              value={displayWeight}
              className="h-8 text-center text-sm bg-white"
              onChange={e => {
                const raw = parseFloat(e.target.value)
                onUpdateSet({ set_number: set.set_number, weight_kg: isNaN(raw) ? undefined : toKg(raw) })
              }}
            />
            <Input
              type="number"
              placeholder={`${targetRepsMin}`}
              value={set.reps ?? ''}
              className="h-8 text-center text-sm bg-white"
              onChange={e => {
                const raw = parseInt(e.target.value)
                onUpdateSet({ set_number: set.set_number, reps: isNaN(raw) ? undefined : raw })
              }}
            />
            <Button
              size="sm"
              variant={set.completed ? 'default' : 'outline'}
              className="h-8 w-8 p-0"
              onClick={() => onUpdateSet({ set_number: set.set_number, completed: !set.completed })}
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
          </div>
        )
      })}

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-500"
          onClick={() => onUpdateSet({ set_number: displayedSets.length + 1, completed: false })}
        >
          <Plus className="w-3 h-3 mr-1" /> Add Set
        </Button>
      </div>
    </div>
  )
}
