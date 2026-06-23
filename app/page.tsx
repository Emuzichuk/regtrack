import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Inter, system-ui, sans-serif', color: '#0C2340' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(250,250,250,0.95)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0C2340', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>RegTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: '#4a6080', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: 8 }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 14, background: '#0C2340', color: 'white', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontWeight: 500, letterSpacing: '-0.01em' }}>
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EEF4FB', border: '1px solid #C8DFF5', borderRadius: 20, padding: '5px 14px', marginBottom: 32, fontSize: 13, fontWeight: 500, color: '#1A5FA8' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A5FA8' }} />
            Built for DMV professionals &amp; fleet owners
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 24px', color: '#0A1929' }}>
            Never miss a vehicle<br />registration renewal.
          </h1>
          <p style={{ fontSize: 18, color: '#5A7090', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 520 }}>
            RegTrack keeps your entire fleet organized in one place — with automatic email alerts before any registration expires.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/auth/signup" style={{ fontSize: 15, background: '#0C2340', color: 'white', padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Start free — 7 days free
            </Link>
            <Link href="#how" style={{ fontSize: 15, color: '#4a6080', textDecoration: 'none', fontWeight: 500, padding: '13px 20px' }}>
              See how it works →
            </Link>
          </div>
          <p style={{ fontSize: 13, color: '#9AABBC', marginTop: 16 }}>No credit card required. Cancel anytime.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, marginTop: 80, background: '#E8EDF2', borderRadius: 14, overflow: 'hidden', maxWidth: 560 }}>
          {[['30-day', 'advance notice'], ['Cars, trucks & trailers', 'all vehicle types'], ['2 min', 'to add a vehicle']].map(([num, lbl]) => (
            <div key={num} style={{ padding: '24px 20px', background: '#FAFAFA', textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0A1929', letterSpacing: '-0.02em' }}>{num}</div>
              <div style={{ fontSize: 12, color: '#8A9DB0', marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px', color: '#0A1929' }}>Everything you need</h2>
            <p style={{ fontSize: 16, color: '#5A7090', lineHeight: 1.6, margin: 0 }}>Built specifically for fleets that can't afford to miss a renewal.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: 'ti-bell', title: 'Automatic reminders', desc: '30, 14, and 7-day email alerts before any registration expires. Set it and forget it.' },
              { icon: 'ti-search', title: 'VIN lookup', desc: 'Enter a VIN and we automatically fill in the year, make, and model. Manual entry always available.' },
              { icon: 'ti-car', title: 'Cars, trucks & trailers', desc: 'Separate views for each vehicle type with the right fields for each one.' },
              { icon: 'ti-hash', title: 'Fleet numbers', desc: 'Assign custom fleet numbers to every vehicle for easy internal tracking.' },
              { icon: 'ti-building', title: 'Multiple companies', desc: 'Manage registrations for multiple companies or clients from one account.' },
              { icon: 'ti-shield-check', title: 'Secure by default', desc: 'Each customer only sees their own vehicles. Bank-level security powered by Supabase.' },
            ].map(f => (
              <div key={f.title} style={{ padding: '28px 24px', border: '1px solid #EDF0F4', borderRadius: 14, background: '#FAFAFA' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize: 20, color: '#1A5FA8' }} aria-hidden="true" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0A1929', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#6B8099', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 48px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px', color: '#0A1929' }}>Up and running in minutes</h2>
            <p style={{ fontSize: 16, color: '#5A7090', lineHeight: 1.6, margin: '0 0 40px' }}>No technical setup required.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                ['Create your account', 'Sign up with your email. No credit card required for your 7-day trial.'],
                ['Add your vehicles', 'Enter each vehicle\'s VIN — year, make, and model fill in automatically.'],
                ['Set your reminders', 'Choose when to be notified before registrations expire.'],
                ['Relax — we remind you', 'RegTrack monitors your fleet daily and sends email alerts automatically.'],
              ].map(([title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ minWidth: 32, height: 32, borderRadius: '50%', background: '#0C2340', color: 'white', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0A1929', marginBottom: 4, letterSpacing: '-0.01em' }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#6B8099', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Pricing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#0A1929' }}>Simple pricing</h3>
            <p style={{ fontSize: 14, color: '#8A9DB0', margin: '0 0 16px' }}>No hidden fees. Cancel anytime.</p>
            {[
              { name: 'Basic', price: '$5', desc: 'For small fleets.', features: ['Up to 5 vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard'], featured: false },
              { name: 'Pro', price: '$10', desc: 'For growing operations.', features: ['Unlimited vehicles', 'Email reminders', 'VIN auto-fill', 'Fleet dashboard', 'Multiple companies', 'Priority support'], featured: true },
            ].map(plan => (
              <div key={plan.name} style={{ padding: '24px', border: plan.featured ? '1.5px solid #2E7DD1' : '1px solid #EDF0F4', borderRadius: 14, background: plan.featured ? '#F5F9FE' : 'white', position: 'relative' }}>
                {plan.featured && <div style={{ position: 'absolute', top: -11, left: 20, background: '#2E7DD1', color: 'white', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.03em' }}>MOST POPULAR</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#0A1929', marginBottom: 2 }}>{plan.name}</div>
                    <div style={{ fontSize: 13, color: '#8A9DB0' }}>{plan.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: '#0C2340', letterSpacing: '-0.02em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: '#8A9DB0' }}>/mo</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ fontSize: 13, color: '#4a6080', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="ti ti-check" style={{ fontSize: 14, color: '#1A5FA8' }} aria-hidden="true" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 600, background: plan.featured ? '#0C2340' : 'transparent', color: plan.featured ? 'white' : '#0C2340', border: plan.featured ? 'none' : '1px solid #0C2340' }}>
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: '#0C2340' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', margin: '0 0 16px' }}>Ready to get started?</h2>
          <p style={{ fontSize: 16, color: '#8AAAC8', lineHeight: 1.6, margin: '0 0 36px' }}>Join fleet owners and DMV professionals who use RegTrack to stay compliant effortlessly.</p>
          <Link href="/auth/signup" style={{ display: 'inline-block', fontSize: 15, background: 'white', color: '#0C2340', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Start your free 7-day trial →
          </Link>
          <p style={{ fontSize: 13, color: '#5A7A96', marginTop: 16 }}>No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#07162A', padding: '32px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.2"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'white', letterSpacing: '-0.01em' }}>RegTrack</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: '#5A7A96', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ fontSize: 13, color: '#5A7A96', textDecoration: 'none' }}>Sign up</Link>
          </div>
          <div style={{ fontSize: 12, color: '#3A5068' }}>© 2025 RegTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
