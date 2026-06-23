'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  plan: string
  planStatus: string
  hasCustomer: boolean
}

const BASIC_PRICE = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || ''
const PRO_PRICE = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ''

function BillingContent({ plan, planStatus, hasCustomer }: Props) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (searchParams.get('success') === 'true') setMessage({ type: 'success', text: 'Subscription activated! Welcome to RegTrack.' })
    if (searchParams.get('canceled') === 'true') setMessage({ type: 'error', text: 'Checkout was canceled. No charge was made.' })
  }, [searchParams])

  async function handleCheckout(priceId: string, planName: string) {
    if (!priceId) { setMessage({ type: 'error', text: 'Price not configured. Please contact support.' }); return }
    setLoading(planName)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planName }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
        setLoading(null)
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' })
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { setMessage({ type: 'error', text: data.error || 'Could not open billing portal.' }); setLoading(null) }
    } catch {
      setMessage({ type: 'error', text: 'Connection error.' })
      setLoading(null)
    }
  }

  const isActive = planStatus === 'active'

  const plans = [
    { name: 'basic', label: 'Basic', price: '$5', priceId: BASIC_PRICE, desc: 'For individuals and small fleets.', features: ['Up to 5 vehicles', 'Email reminders (30/14/7 day)', 'Fleet dashboard', 'VIN auto-fill', 'Cars, trucks & trailers'] },
    { name: 'pro', label: 'Pro', price: '$10', priceId: PRO_PRICE, desc: 'For growing fleets that need full visibility.', features: ['Unlimited vehicles', 'Email reminders (30/14/7 day)', 'Fleet dashboard', 'VIN auto-fill', 'All vehicle types', 'Multiple companies', 'Priority support'], featured: true },
  ]

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A1929', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Billing</h1>
        <p style={{ fontSize: 15, color: '#6B8099', margin: 0 }}>Manage your RegTrack subscription.</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding: '14px 18px', borderRadius: 10, marginBottom: 24, fontSize: 14, fontWeight: 500, background: message.type === 'success' ? '#EAF3DE' : '#FDECEC', color: message.type === 'success' ? '#2D5A0D' : '#922020', border: `1px solid ${message.type === 'success' ? '#B8DCA0' : '#F5BABA'}` }}>
          {message.text}
        </div>
      )}

      {/* Current plan card */}
      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '22px 28px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9AABBC', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Current plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: isActive ? '#EEF4FB' : '#F5F5F5', color: isActive ? '#1A5FA8' : '#8A9DB0', letterSpacing: '-0.01em' }}>
              {plan === 'none' ? 'Free trial' : plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
            <span style={{ fontSize: 14, color: isActive ? '#2D5A0D' : '#8A9DB0', fontWeight: 500 }}>
              {isActive ? '✓ Active' : planStatus === 'canceled' ? 'Canceled' : 'Free trial'}
            </span>
          </div>
        </div>
        {hasCustomer && isActive && (
          <button onClick={handlePortal} disabled={loading === 'portal'} style={{ fontSize: 14, fontWeight: 500, padding: '9px 20px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.10)', background: 'white', color: '#0A1929', cursor: 'pointer', fontFamily: 'inherit', opacity: loading === 'portal' ? 0.6 : 1 }}>
            {loading === 'portal' ? 'Loading...' : 'Manage billing →'}
          </button>
        )}
      </div>

      {/* Plans */}
      <div style={{ fontSize: 17, fontWeight: 600, color: '#0A1929', marginBottom: 16, letterSpacing: '-0.01em' }}>
        {isActive ? 'Change your plan' : 'Choose a plan'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {plans.map(p => {
          const isCurrent = plan === p.name && isActive
          return (
            <div key={p.name} style={{ background: 'white', border: isCurrent ? '1.5px solid #3B6D11' : p.featured ? '1.5px solid #2E7DD1' : '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '28px 24px', position: 'relative' }}>
              {p.featured && !isCurrent && <div style={{ position: 'absolute', top: -11, left: 20, background: '#2E7DD1', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.03em' }}>POPULAR</div>}
              {isCurrent && <div style={{ position: 'absolute', top: -11, left: 20, background: '#3B6D11', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>CURRENT</div>}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0A1929', letterSpacing: '-0.02em' }}>{p.label}</div>
                <div><span style={{ fontSize: 30, fontWeight: 700, color: '#0C2340', letterSpacing: '-0.03em' }}>{p.price}</span><span style={{ fontSize: 14, color: '#8A9DB0' }}>/mo</span></div>
              </div>
              <div style={{ fontSize: 13, color: '#8A9DB0', marginBottom: 20 }}>{p.desc}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: '#4a6080', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <i className="ti ti-check" style={{ fontSize: 14, color: '#1A5FA8', flexShrink: 0 }} aria-hidden="true" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => { if (!isCurrent) handleCheckout(p.priceId, p.name) }}
                disabled={isCurrent || loading === p.name}
                style={{
                  display: 'block', width: '100%', padding: '12px',
                  background: isCurrent ? '#EAF3DE' : p.featured ? '#0C2340' : 'transparent',
                  color: isCurrent ? '#2D5A0D' : p.featured ? 'white' : '#0C2340',
                  border: isCurrent ? 'none' : p.featured ? 'none' : '1.5px solid #0C2340',
                  borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: isCurrent ? 'default' : 'pointer',
                  opacity: loading === p.name ? 0.6 : 1, fontFamily: 'inherit', letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s',
                }}
              >
                {loading === p.name ? 'Loading...' : isCurrent ? 'Current plan' : isActive ? 'Switch plan' : `Subscribe — ${p.price}/mo`}
              </button>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 12, color: '#9AABBC', marginTop: 20, textAlign: 'center' }}>
        Secure payments via Stripe. Cancel anytime from the billing portal.
      </p>
    </div>
  )
}

export default function BillingClient(props: Props) {
  return (
    <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
      <BillingContent {...props} />
    </Suspense>
  )
}
