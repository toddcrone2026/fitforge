'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface MacroRingProps {
  label: string
  current: number
  target: number
  unit: string
  color: string
  size?: 'sm' | 'lg'
}

export function MacroRing({ label, current, target, unit, color, size = 'sm' }: MacroRingProps) {
  const pct = Math.min((current / target) * 100, 100)
  const over = current > target

  const data = [
    { value: Math.min(current, target) },
    { value: Math.max(target - current, 0) },
  ]

  const dim = size === 'lg' ? 120 : 80
  const inner = size === 'lg' ? 38 : 26
  const outer = size === 'lg' ? 54 : 36

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: dim, height: dim }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={over ? '#ef4444' : color} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold leading-none', size === 'lg' ? 'text-base' : 'text-xs')}>
            {Math.round(current)}
          </span>
          <span className="text-[9px] text-slate-400">{unit}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-[10px] text-slate-400">{Math.round(target)} goal</span>
    </div>
  )
}
