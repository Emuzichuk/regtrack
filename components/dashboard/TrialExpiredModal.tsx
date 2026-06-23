'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  isExpired: boolean
}

export default function TrialExpiredModal({ isExpired }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  if (!isExpired || dismissed) return null

  return (
    <>
      {/* Overlay — blocks all clicks */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(12, 35, 64, 0.7)',
        zIndex: 200,
        backdropFilter: 'blur(2px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 201,
        background: 'white',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 480,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* X button — only way to dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', fontSize: 20,
            color: '#9aabc0', cursor: 'pointer', lineHeight: 1,
          }}
        >×</button>

        {/* Icon */}
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0C2340', margin: '0 0 10px' }}>
          Your free trial has ended
        </h2>
        <p style={{ fontSize: 15, color: '#6b7c93', lineHeight: 1.6, margin: '0 0 28px' }}>
          Subscribe to continue managing your fleet and receiving email reminders. Plans start at just <strong>$5/month</strong>.
        </p>

        {/* Plan buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => router.push('/dashboard/billing')}
            style={{
              padding: '14px', border: '1.5px solid #0C2340', borderRadius: 10,
              background: 'white', cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0C2340' }}>Basic</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A5FA8', margin: '4px 0 2px' }}>$5<span style={{ fontSize: 13, fontWeight: 400, color: '#9aabc0' }}>/mo</span></div>
            <div style={{ fontSize: 12, color: '#6b7c93' }}>Up to 5 vehicles</div>
          </button>
          <button
            onClick={() => router.push('/dashboard/billing')}
            style={{
              padding: '14px', border: '2px solid #2E7DD1', borderRadius: 10,
              background: '#EEF4FB', cursor: 'pointer', position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#2E7DD1', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>POPULAR</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0C2340' }}>Pro</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A5FA8', margin: '4px 0 2px' }}>$10<span style={{ fontSize: 13, fontWeight: 400, color: '#9aabc0' }}>/mo</span></div>
            <div style={{ fontSize: 12, color: '#6b7c93' }}>Unlimited vehicles</div>
          </button>
        </div>

        <button
          onClick={() => router.push('/dashboard/billing')}
          style={{
            width: '100%', padding: '14px', background: '#0C2340', color: 'white',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Choose a plan →
        </button>

        <p style={{ fontSize: 12, color: '#9aabc0', marginTop: 14 }}>
          Cancel anytime. No contracts.
        </p>
      </div>
    </>
  )
}
