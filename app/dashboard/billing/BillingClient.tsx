'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props { plan: string; planStatus: string; hasCustomer: boolean }

const BASIC = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || ''
const PRO = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ''
const S = { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

function BillingContent({ plan, planStatus, hasCustomer }: Props) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const isActive = planStatus === 'active'

  useEffect(() => {
    if (searchParams.get('success') === 'true') setMsg({ ok: true, text: 'Subscription activated. Welcome to RegTrack.' })
    if (searchParams.get('canceled') === 'true') setMsg({ ok: false, text: 'Checkout canceled. No charge was made.' })
  }, [searchParams])

  async function checkout(priceId: string, planName: string) {
    if (!priceId) { setMsg({ ok: false, text: 'Price not configured. Contact support.' }); return }
    setLoading(planName)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId, plan: planName }) })
      const data = await res.json()
      if (data.url) { window.location.href = data.url } else { setMsg({ ok: false, text: data.error || 'Something went wrong.' }); setLoading(null) }
    } catch { setMsg({ ok: false, text: 'Connection error. Please try again.' }); setLoading(null) }
  }

  async function portal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url } else { setMsg({ ok: false, text: data.error || 'Could not open portal.' }); setLoading(null) }
    } catch { setMsg({ ok: false, text: 'Connection error.' }); setLoading(null) }
  }

  const plans = [
    { name: 'basic', label: 'Basic', price: '$5', priceId: BASIC, desc: 'For individuals and small fleets.', features: ['Up to 5 vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'Cars, trucks & trailers'], accent: false },
    { name: 'pro', label: 'Pro', price: '$10', priceId: PRO, desc: 'For growing fleets and operations.', features: ['Unlimited vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'All vehicle types', 'Multiple companies', 'Priority support'], accent: true },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ borderBottom: '1px solid #E2E5EA', paddingBottom: 32, marginBottom: 40 }}>
        <p style={S}>Billing</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 6 }}>Subscription</h1>
      </div>

      {msg && (
        <div style={{ padding: '14px 18px', borderRadius: 0, marginBottom: 32, fontSize: 13, background: msg.ok ? '#F0FDF4' : '#FEF2F2', color: msg.ok ? '#15803D' : '#B91C1C', border: `1px solid ${msg.ok ? '#BBF7D0' : '#FECACA'}` }}>
          {msg.text}
        </div>
      )}

      {/* Current plan */}
      <div style={{ border: '1px solid #E2E5EA', marginBottom: 40 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E5EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={S}>Current plan</p>
          {hasCustomer && isActive && (
            <button onClick={portal} disabled={loading === 'portal'} style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', border: '1px solid #E2E5EA', borderRadius: 6, background: 'white', color: '#374151', cursor: 'pointer', fontFamily: 'inherit', opacity: loading === 'portal' ? 0.6 : 1 }}>
              {loading === 'portal' ? 'Loading...' : 'Manage billing →'}
            </button>
          )}
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.02em' }}>
              {plan === 'none' ? 'Free trial' : plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: isActive ? '#F0FDF4' : '#F7F8FA', color: isActive ? '#15803D' : '#6B7280', fontWeight: 600, letterSpacing: '0.04em' }}>
              {isActive ? 'ACTIVE' : 'TRIAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <p style={{ ...S, marginBottom: 20 }}>{isActive ? 'Change plan' : 'Choose a plan'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #E2E5EA' }}>
        {plans.map((p, i) => {
          const isCurrent = plan === p.name && isActive
          return (
            <div key={p.name} style={{ padding: '36px 32px', borderRight: i === 0 ? '1px solid #E2E5EA' : 'none', background: p.accent ? '#0A1628' : 'white', position: 'relative' }}>
              {p.accent && !isCurrent && <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: 20 }}>POPULAR</div>}
              {isCurrent && <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', background: '#F0FDF4', color: '#15803D', padding: '3px 10px', borderRadius: 20 }}>CURRENT</div>}
              <div style={{ fontSize: 13, fontWeight: 600, color: p.accent ? 'rgba(255,255,255,0.4)' : '#6B7280', marginBottom: 16, letterSpacing: '-0.01em' }}>{p.label}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', color: p.accent ? 'white' : '#0A1628' }}>{p.price}</span>
                <span style={{ fontSize: 13, color: p.accent ? 'rgba(255,255,255,0.3)' : '#9CA3AF' }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: p.accent ? 'rgba(255,255,255,0.4)' : '#6B7280', marginBottom: 28, fontWeight: 300 }}>{p.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: p.accent ? 'rgba(255,255,255,0.65)' : '#374151', fontWeight: 300 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke={p.accent ? 'rgba(255,255,255,0.4)' : '#1B4FD8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => !isCurrent && checkout(p.priceId, p.name)}
                disabled={isCurrent || loading === p.name}
                style={{ display: 'block', width: '100%', padding: '12px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: isCurrent ? 'default' : 'pointer', background: isCurrent ? 'rgba(255,255,255,0.1)' : p.accent ? 'white' : '#0A1628', color: isCurrent ? (p.accent ? 'rgba(255,255,255,0.3)' : '#9CA3AF') : p.accent ? '#0A1628' : 'white', fontFamily: 'inherit', letterSpacing: '-0.01em', opacity: loading === p.name ? 0.6 : 1 }}
              >
                {loading === p.name ? 'Loading...' : isCurrent ? 'Current plan' : isActive ? 'Switch plan' : `Subscribe — ${p.price}/mo`}
              </button>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 20, textAlign: 'center', letterSpacing: '0.02em' }}>SECURE PAYMENTS VIA STRIPE · CANCEL ANYTIME</p>
    </div>
  )
}

export default function BillingClient(props: Props) {
  return <Suspense fallback={<div style={{ minHeight: '50vh' }} />}><BillingContent {...props} /></Suspense>
}
