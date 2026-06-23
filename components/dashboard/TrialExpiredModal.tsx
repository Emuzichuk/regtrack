'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrialExpiredModal({ isExpired }: { isExpired: boolean }) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()
  if (!isExpired || dismissed) return null

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: 'white', width: '100%', maxWidth: 480, border: '1px solid #E2E5EA' }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E5EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>Free trial ended</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em' }}>Choose a plan to continue</h2>
          </div>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            { name: 'Basic', price: '$5', desc: 'Up to 5 vehicles', accent: false },
            { name: 'Pro', price: '$10', desc: 'Unlimited vehicles', accent: true },
          ].map((p, i) => (
            <div key={p.name} style={{ padding: '28px', borderRight: i === 0 ? '1px solid #E2E5EA' : 'none', background: p.accent ? '#0A1628' : 'white' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.accent ? 'rgba(255,255,255,0.5)' : '#6B7280', marginBottom: 10 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: p.accent ? 'white' : '#0A1628', letterSpacing: '-0.04em', marginBottom: 4 }}>{p.price}<span style={{ fontSize: 13, fontWeight: 400, color: p.accent ? 'rgba(255,255,255,0.3)' : '#9CA3AF' }}>/mo</span></div>
              <div style={{ fontSize: 12, color: p.accent ? 'rgba(255,255,255,0.4)' : '#6B7280', marginBottom: 20, fontWeight: 300 }}>{p.desc}</div>
              <button onClick={() => router.push('/dashboard/billing')} style={{ width: '100%', padding: '10px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: p.accent ? 'white' : '#0A1628', color: p.accent ? '#0A1628' : 'white', fontFamily: 'inherit' }}>
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 28px', borderTop: '1px solid #E2E5EA', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF' }}>Secure payments via Stripe. Cancel anytime.</p>
        </div>
      </div>
    </>
  )
}
