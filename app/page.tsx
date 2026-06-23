import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Inter, system-ui, sans-serif', color: '#0A1929' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(250,250,250,0.97)', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0C2340', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: '#0A1929' }}>RegTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: '#5A7090', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: 8 }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 14, background: '#0C2340', color: 'white', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 660 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EEF4FB', border: '1px solid #C8DFF5', borderRadius: 20, padding: '5px 14px', marginBottom: 28, fontSize: 13, fontWeight: 600, color: '#1A5FA8', letterSpacing: '-0.01em' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A5FA8' }} />
            Built for DMV professionals &amp; fleet owners
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', margin: '0 0 22px', color: '#080F1A' }}>
            Never miss a vehicle<br />registration renewal.
          </h1>
          <p style={{ fontSize: 18, color: '#5A7090', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 500 }}>
            RegTrack keeps your entire fleet organized in one place — with automatic email alerts before any registration expires.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/auth/signup" style={{ fontSize: 15, background: '#0C2340', color: 'white', padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Start free — 7 days free
            </Link>
            <Link href="#how" style={{ fontSize: 15, color: '#5A7090', textDecoration: 'none', fontWeight: 500, padding: '13px 20px' }}>
              See how it works →
            </Link>
          </div>
          <p style={{ fontSize: 13, color: '#9AABBC', marginTop: 14 }}>No credit card required. Cancel anytime.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, marginTop: 72, flexWrap: 'wrap' }}>
          {[['30-day advance notice', 'Get alerts well before registrations expire'],
            ['Cars, trucks & trailers', 'Separate tracking for every vehicle type'],
            ['2 minutes to add a vehicle', 'VIN lookup fills details automatically']].map(([title, sub]) => (
            <div key={title} style={{ borderLeft: '3px solid #C8DFF5', paddingLeft: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0A1929', letterSpacing: '-0.02em', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#8A9DB0', lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 52 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px', color: '#080F1A' }}>Everything you need</h2>
            <p style={{ fontSize: 16, color: '#5A7090', lineHeight: 1.6, margin: 0, maxWidth: 460 }}>Built specifically for fleets that can't afford to miss a renewal.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              ['Automatic reminders', '30, 14, and 7-day email alerts before any registration expires. Set it and forget it.'],
              ['VIN lookup', 'Enter a VIN and we automatically fill in year, make, and model. Manual entry always available.'],
              ['Cars, trucks & trailers', 'Separate views for each vehicle type with the right data fields for each one.'],
              ['Fleet numbers', 'Assign your own internal fleet numbers to every vehicle for easy tracking.'],
              ['Multiple companies', 'Manage registrations for multiple companies or clients from a single account.'],
              ['Secure by default', 'Each customer only sees their own vehicles. Bank-level security powered by Supabase.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: '32px 28px', background: '#FAFAFA' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#080F1A', marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#6B8099', lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + Pricing */}
      <section id="how" style={{ padding: '80px 48px', background: '#FAFAFA', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px', color: '#080F1A' }}>Up and running<br />in minutes</h2>
            <p style={{ fontSize: 15, color: '#5A7090', lineHeight: 1.6, margin: '0 0 40px' }}>No technical setup required.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                ['Create your account', 'Sign up with your email. No credit card required for your 7-day trial.'],
                ['Add your vehicles', "Enter each vehicle's VIN — year, make, and model fill in automatically."],
                ['Set your reminders', 'Choose when to be notified before registrations expire.'],
                ['Relax — we remind you', 'RegTrack monitors your fleet daily and sends automatic email alerts.'],
              ].map(([title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: 0, paddingBottom: 28 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20, flexShrink: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0C2340', color: 'white', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                    {i < 3 && <div style={{ width: 1, flex: 1, background: '#E0E8F0', marginTop: 8 }} />}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#080F1A', marginBottom: 5, letterSpacing: '-0.02em' }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#6B8099', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px', color: '#080F1A' }}>Simple pricing</h2>
            <p style={{ fontSize: 15, color: '#8A9DB0', margin: '0 0 28px' }}>No hidden fees. Cancel anytime.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Basic', price: '$5', desc: 'For individuals and small fleets.', features: ['Up to 5 vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard'], featured: false },
                { name: 'Pro', price: '$10', desc: 'For growing fleets and operations.', features: ['Unlimited vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'Multiple companies', 'Priority support'], featured: true },
              ].map(plan => (
                <div key={plan.name} style={{ padding: '24px', border: plan.featured ? '1.5px solid #2E7DD1' : '1px solid rgba(0,0,0,0.09)', borderRadius: 14, background: plan.featured ? '#F5F9FE' : 'white', position: 'relative' }}>
                  {plan.featured && <div style={{ position: 'absolute', top: -11, left: 20, background: '#2E7DD1', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.04em' }}>MOST POPULAR</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#080F1A', letterSpacing: '-0.02em' }}>{plan.name}</div>
                      <div style={{ fontSize: 13, color: '#8A9DB0', marginTop: 2 }}>{plan.desc}</div>
                    </div>
                    <div><span style={{ fontSize: 30, fontWeight: 800, color: '#0C2340', letterSpacing: '-0.03em' }}>{plan.price}</span><span style={{ fontSize: 13, color: '#8A9DB0' }}>/mo</span></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ fontSize: 13, color: '#4a6080', display: 'flex', alignItems: 'center', gap: 9 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#1A5FA8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 700, background: plan.featured ? '#0C2340' : 'transparent', color: plan.featured ? 'white' : '#0C2340', border: plan.featured ? 'none' : '1.5px solid #0C2340', letterSpacing: '-0.01em' }}>
                    Start free trial
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: '#0C2340' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.1 }}>Ready to get started?</h2>
          <p style={{ fontSize: 16, color: '#7A9AB8', lineHeight: 1.7, margin: '0 0 36px' }}>Join fleet owners and DMV professionals who use RegTrack to stay compliant — without the stress.</p>
          <Link href="/auth/signup" style={{ display: 'inline-block', fontSize: 15, background: 'white', color: '#0C2340', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Start your free 7-day trial →
          </Link>
          <p style={{ fontSize: 13, color: '#4A6A84', marginTop: 14 }}>No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#07162A', padding: '28px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.2"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>RegTrack</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: '#4A6A84', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 13, color: '#4A6A84', textDecoration: 'none' }}>Sign up</Link>
          </div>
          <div style={{ fontSize: 12, color: '#2A4A64' }}>© 2025 RegTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
