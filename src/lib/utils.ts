import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54)
}

export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54)
}

export function formatGoal(goal: string): string {
  const map: Record<string, string> = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    build_strength: 'Build Strength',
    burn_fat: 'Burn Fat',
    maintain: 'Maintain',
    improve_endurance: 'Improve Endurance',
  }
  return map[goal] || goal
}

export function formatActivity(level: string): string {
  const map: Record<string, string> = {
    sedentary: 'Sedentary (desk job, no exercise)',
    lightly_active: 'Lightly Active (1-3 days/week)',
    moderately_active: 'Moderately Active (3-5 days/week)',
    very_active: 'Very Active (6-7 days/week)',
    extremely_active: 'Extremely Active (athlete/physical job)',
  }
  return map[level] || level
}
