'use client'
import { useState, useCallback } from 'react'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: string
  open: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...opts, id, open: true }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, opts.duration ?? 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
