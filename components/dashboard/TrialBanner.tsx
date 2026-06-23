'use client'
import { getTrialDaysLeft } from '@/lib/trial'
import Link from 'next/link'

export default function TrialBanner({ trialStartedAt, plan, planStatus }: { trialStartedAt: string | null; plan: string; planStatus: string }) {
  if (plan !== 'none' && planStatus === 'active') return null
  const daysLeft = getTrialDaysLeft(trialStartedAt)
  if (daysLeft === 0) return null

  return (
    <div style={{ borderBottom: '1px solid #E2E5EA', padding: '10px 32px', background: daysLeft <= 2 ? '#FFFBEB' : '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: daysLeft <= 2 ? '#B45309' : '#6B7280', fontWeight: 500 }}>
        {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining in your free trial
      </span>
      <Link href="/dashboard/billing" style={{ fontSize: 12, fontWeight: 600, color: '#0A1628', textDecoration: 'none', background: '#0A1628', color: 'white', padding: '5px 14px', borderRadius: 6, display: 'inline-block' }}>
        Subscribe now →
      </Link>
    </div>
  )
}
