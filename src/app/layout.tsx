import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitForge — Personal Trainer & Nutrition Coach',
  description: 'Track macros, log workouts, and achieve your fitness goals with a plant-based and pescatarian focus.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
