'use client'
import { getTrialDaysLeft } from '@/lib/trial'
import Link from 'next/link'

interface Props {
  trialStartedAt: string | null
  plan: string
  planStatus: string
}

export default function TrialBanner({ trialStartedAt, plan, planStatus }: Props) {
  // Don't show if on paid plan
  if (plan !== 'none' && planStatus === 'active') return null

  const daysLeft = getTrialDaysLeft(trialStartedAt)

  // Don't show if trial expired (the modal handles that)
  if (daysLeft === 0) return null

  const urgent = daysLeft <= 2

  return (
    <div style={{
      background: urgent ? '#FAEEDA' : '#E6F1FB',
      border: `1px solid ${urgent ? '#FAC775' : '#B5D4F4'}`,
      borderRadius: 10,
      padding: '10px 20px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
    }}>
      <div style={{ fontSize: 14, color: urgent ? '#854F0B' : '#1A5FA8', fontWeight: 500 }}>
        {urgent ? '⚠️' : 'ℹ️'} {daysLeft === 1 ? 'Last day' : `${daysLeft} days`} left in your free trial
      </div>
      <Link href="/dashboard/billing" style={{
        fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 7,
        background: urgent ? '#854F0B' : '#0C2340', color: 'white', textDecoration: 'none',
      }}>
        Subscribe now →
      </Link>
    </div>
  )
}
