'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Suspense } from 'react'

interface Props {
  plan: string
  planStatus: string
  hasCustomer: boolean
}

function BillingContent({ plan, planStatus, hasCustomer }: Props) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated! Welcome to RegTrack.')
    }
    if (searchParams.get('canceled') === 'true') {
      toast('Checkout canceled.', { icon: '⚠️' })
    }
  }, [searchParams])

  async function handleCheckout(priceId: string, planName: string) {
    setLoading(planName)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planName }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Something went wrong')
    } catch {
      toast.error('Failed to start checkout')
    }
    setLoading(null)
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Something went wrong')
    } catch {
      toast.error('Failed to open billing portal')
    }
    setLoading(null)
  }

  const isActive = planStatus === 'active'
  const planColors: Record<string, { bg: string; text: string; label: string }> = {
    none:  { bg: '#F0F4F8', text: '#6b7c93', label: 'Free trial' },
    basic: { bg: '#E6F1FB', text: '#1A5FA8', label: 'Basic' },
    pro:   { bg: '#EAF3DE', text: '#3B6D11', label: 'Pro' },
  }
  const currentPlan = planColors[plan] || planColors.none

  const plans = [
    {
      name: 'basic',
      label: 'Basic',
      price: '$5',
      priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '',
      desc: 'For individuals and small fleets.',
      features: ['Up to 5 vehicles', 'Email reminders', 'Fleet dashboard', 'VIN auto-fill', 'Car, truck & trailer tabs'],
      featured: false,
    },
    {
      name: 'pro',
      label: 'Pro',
      price: '$10',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
      desc: 'For growing fleets that need full visibility.',
      features: ['Unlimited vehicles', 'Email reminders', 'Fleet dashboard', 'VIN auto-fill', 'All vehicle types', 'Multi-company management', 'Priority support'],
      featured: true,
    },
  ]

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0C2340', margin: '0 0 4px' }}>Billing</h1>
        <p style={{ fontSize: 14, color: '#6b7c93', margin: 0 }}>Manage your RegTrack subscription.</p>
      </div>

      {/* Current plan */}
      <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: '#9aabc0', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current plan</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: currentPlan.bg, color: currentPlan.text }}>
                {currentPlan.label}
              </span>
              <span style={{ fontSize: 13, color: isActive ? '#3B6D11' : '#9aabc0' }}>
                {isActive ? '✓ Active' : planStatus === 'canceled' ? 'Canceled' : 'Inactive'}
              </span>
            </div>
          </div>
          {hasCustomer && isActive && (
            <button
              onClick={handlePortal}
              disabled={loading === 'portal'}
              style={{ fontSize: 13, fontWeight: 500, padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(20,60,120,0.18)', background: 'white', color: '#0C2340', cursor: 'pointer', opacity: loading === 'portal' ? 0.7 : 1 }}
            >
              {loading === 'portal' ? 'Loading...' : 'Manage billing →'}
            </button>
          )}
        </div>
      </div>

      {/* Pricing cards */}
      <div style={{ fontSize: 15, fontWeight: 600, color: '#0C2340', marginBottom: 16 }}>
        {isActive ? 'Change plan' : 'Choose a plan'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {plans.map(p => {
          const isCurrent = plan === p.name && isActive
          return (
            <div key={p.name} style={{ background: 'white', border: isCurrent ? '2px solid #3B6D11' : p.featured ? '2px solid #2E7DD1' : '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '24px 20px' }}>
              {p.featured && !isCurrent && (
                <div style={{ background: '#E6F1FB', color: '#1A5FA8', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>Most popular</div>
              )}
              {isCurrent && (
                <div style={{ background: '#EAF3DE', color: '#3B6D11', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>Current plan</div>
              )}
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0C2340', marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#1A5FA8', margin: '8px 0 4px' }}>
                {p.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#6b7c93' }}>/mo</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7c93', marginBottom: 16 }}>{p.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: '#0C2340', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#3B6D11', fontWeight: 600 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrent && handleCheckout(p.priceId, p.name)}
                disabled={isCurrent || loading === p.name}
                style={{
                  display: 'block', width: '100%', padding: '11px',
                  background: isCurrent ? '#EAF3DE' : p.featured ? '#0C2340' : 'white',
                  color: isCurrent ? '#3B6D11' : p.featured ? 'white' : '#0C2340',
                  border: isCurrent ? 'none' : '1px solid #0C2340',
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: isCurrent ? 'default' : 'pointer',
                  opacity: loading === p.name ? 0.7 : 1,
                }}
              >
                {loading === p.name ? 'Loading...' : isCurrent ? '✓ Current plan' : isActive ? 'Switch to this plan' : 'Get started'}
              </button>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: '#9aabc0', marginTop: 20, textAlign: 'center' }}>
        Secure payments powered by Stripe. Cancel anytime from the billing portal.
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
