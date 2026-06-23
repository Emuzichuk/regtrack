import Link from 'next/link'

const NAV_H = 60

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#0A1628', background: '#fff', minHeight: '100vh' }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E2E5EA', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', height: NAV_H, display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#0A1628', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.2"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>RegTrack</span>
          </div>
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link href="#features" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Features</Link>
            <Link href="#pricing" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/auth/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 14, background: '#0A1628', color: 'white', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ borderBottom: '1px solid #E2E5EA', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 24 }}>
              Fleet Registration Management
            </p>
            <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#0A1628', marginBottom: 28 }}>
              Never miss a<br />registration renewal.
            </h1>
            <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, marginBottom: 40, maxWidth: 520, fontWeight: 300 }}>
              RegTrack keeps your entire fleet organized — with automatic email alerts 30, 14, and 7 days before any registration expires.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ fontSize: 14, fontWeight: 600, background: '#0A1628', color: 'white', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', letterSpacing: '-0.01em' }}>
                Start free trial — 7 days
              </Link>
              <Link href="#how" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                How it works
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>No credit card required. One free trial per account.</p>
          </div>

          {/* Metric strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginTop: 72, borderTop: '1px solid #E2E5EA', borderLeft: '1px solid #E2E5EA' }}>
            {[
              ['30 days', 'Advance notice before expiry'],
              ['3 types', 'Cars, trucks & trailers tracked'],
              ['2 minutes', 'To add a vehicle via VIN lookup'],
            ].map(([val, label]) => (
              <div key={val} style={{ padding: '32px 32px', borderRight: '1px solid #E2E5EA', borderBottom: '1px solid #E2E5EA' }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#0A1628', marginBottom: 6 }}>{val}</div>
                <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 300 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ borderBottom: '1px solid #E2E5EA', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>Features</p>
              <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0A1628' }}>Built for fleet professionals</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #E2E5EA' }}>
              {[
                ['Automatic reminders', '30, 14, and 7-day email alerts before any registration expires.'],
                ['VIN lookup', 'Enter a VIN and year, make, and model fill in automatically.'],
                ['Cars, trucks & trailers', 'Separate views and fields for each vehicle category.'],
                ['Fleet numbers', 'Assign internal fleet numbers for easy tracking and sorting.'],
                ['Multiple companies', 'Manage registrations for multiple clients from one account.'],
                ['Status tracking', 'Mark vehicles as registered, in process, or not registered.'],
              ].map(([title, desc], i) => (
                <div key={title} style={{ padding: '32px', borderRight: i % 2 === 0 ? '1px solid #E2E5EA' : 'none', borderBottom: i < 4 ? '1px solid #E2E5EA' : 'none', background: i % 2 === 1 ? '#FAFAFA' : 'white' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0A1628', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, fontWeight: 300 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ borderBottom: '1px solid #E2E5EA', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 48 }}>How it works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid #E2E5EA', borderLeft: '1px solid #E2E5EA' }}>
            {[
              ['01', 'Create account', 'Sign up with your email. No credit card needed for your 7-day trial.'],
              ['02', 'Add vehicles', 'Enter a VIN — year, make, and model fill in automatically.'],
              ['03', 'Set reminders', 'Choose when to be notified before each registration expires.'],
              ['04', 'Stay compliant', 'RegTrack monitors your fleet daily and sends automatic alerts.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ padding: '40px 32px', borderRight: '1px solid #E2E5EA', borderBottom: '1px solid #E2E5EA' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 20 }}>{num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#0A1628', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, fontWeight: 300 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ borderBottom: '1px solid #E2E5EA', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>Pricing</p>
              <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0A1628', marginBottom: 16 }}>Simple, transparent pricing</h2>
              <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 300, lineHeight: 1.6 }}>No contracts. No hidden fees. Cancel anytime from your billing portal.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #E2E5EA' }}>
              {[
                { name: 'Basic', price: '$5', period: '/month', desc: 'For individuals managing a small fleet.', features: ['Up to 5 vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'Car, truck & trailer tabs'], cta: 'Start free trial', accent: false },
                { name: 'Pro', price: '$10', period: '/month', desc: 'For operations that need full visibility.', features: ['Unlimited vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'All vehicle types', 'Multiple companies', 'Priority support'], cta: 'Start free trial', accent: true },
              ].map((plan, i) => (
                <div key={plan.name} style={{ padding: '40px 32px', borderRight: i === 0 ? '1px solid #E2E5EA' : 'none', background: plan.accent ? '#0A1628' : 'white', position: 'relative' }}>
                  {plan.accent && <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: 20 }}>POPULAR</div>}
                  <div style={{ fontSize: 13, fontWeight: 600, color: plan.accent ? 'rgba(255,255,255,0.5)' : '#6B7280', marginBottom: 20, letterSpacing: '-0.01em' }}>{plan.name}</div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', color: plan.accent ? 'white' : '#0A1628' }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: plan.accent ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: 13, color: plan.accent ? 'rgba(255,255,255,0.5)' : '#6B7280', marginBottom: 28, fontWeight: 300 }}>{plan.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: plan.accent ? 'rgba(255,255,255,0.75)' : '#374151', fontWeight: 300 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke={plan.accent ? 'rgba(255,255,255,0.6)' : '#1B4FD8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600, background: plan.accent ? 'white' : '#0A1628', color: plan.accent ? '#0A1628' : 'white', letterSpacing: '-0.01em' }}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderBottom: '1px solid #E2E5EA', padding: '100px 40px', background: '#0A1628' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
              Ready to get<br />started?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontWeight: 300, maxWidth: 400, lineHeight: 1.6 }}>
              Join fleet owners and DMV professionals keeping their registrations current.
            </p>
          </div>
          <div>
            <Link href="/auth/signup" style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, background: 'white', color: '#0A1628', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', letterSpacing: '-0.01em' }}>
              Start your free 7-day trial
            </Link>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12, textAlign: 'center' }}>No credit card required.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 40px', borderBottom: '1px solid #E2E5EA' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, background: '#0A1628', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.2"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>RegTrack</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>© 2025 RegTrack. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/auth/login" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'none' }}>Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
