import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        background: 'white', borderBottom: '0.5px solid rgba(20,60,120,0.10)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--navy)' }}>RegTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: 'var(--navy)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 14, background: 'var(--navy)', color: 'white', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(55,138,221,0.2)', color: '#B5D4F4', fontSize: 12, fontWeight: 500, padding: '4px 14px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(55,138,221,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Built for fleet owners & DMV professionals
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'white', lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Never miss a vehicle<br/>registration renewal again.
          </h1>
          <p style={{ fontSize: 16, color: '#B5D4F4', lineHeight: 1.7, margin: '0 0 36px' }}>
            RegTrack keeps every registration in your fleet organized in one place — with automatic email alerts before they expire.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ background: '#2E7DD1', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
              Start free trial →
            </Link>
            <Link href="#how-it-works" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)' }}>
              See how it works
            </Link>
          </div>
          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, marginTop: 48, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
            {[['30-day', 'advance notice'], ['Cars, trucks', '& trailers'], ['2 min', 'to add a vehicle']].map(([num, lbl]) => (
              <div key={num} style={{ padding: '20px 16px', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>{num}</div>
                <div style={{ fontSize: 12, color: '#7BA8D4', marginTop: 3 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', textAlign: 'center', margin: '0 0 8px' }}>
          Everything you need to stay compliant
        </h2>
        <p style={{ fontSize: 15, color: '#6b7c93', textAlign: 'center', margin: '0 0 48px' }}>
          Built specifically for fleets — from a single truck to hundreds of vehicles.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { icon: '🔔', title: 'Email reminders', desc: '30, 14, and 7-day alerts before any registration expires.' },
            { icon: '🔍', title: 'VIN auto-fill', desc: 'Enter a VIN and we look up year, make, and model automatically.' },
            { icon: '🚛', title: 'Cars, trucks & trailers', desc: 'Separate views for each vehicle type, with the right fields for each.' },
            { icon: '#', title: 'Fleet numbers', desc: 'Assign your own internal fleet # to every vehicle for easy tracking.' },
            { icon: '📅', title: 'Expiry calendar', desc: 'See upcoming renewals at a glance so you can plan ahead.' },
            { icon: '🔒', title: 'Your data, only yours', desc: 'Row-level security means each customer only sees their own fleet.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#6b7c93', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', textAlign: 'center', margin: '0 0 8px' }}>Up and running in minutes</h2>
          <p style={{ fontSize: 15, color: '#6b7c93', textAlign: 'center', margin: '0 0 40px' }}>No technical setup required.</p>
          {[
            ['Create your account', 'Sign up with your email. No credit card required to start.'],
            ['Add your vehicles', 'Enter each vehicle\'s VIN — year, make, model fill in automatically. Add fleet # and expiry date.'],
            ['Set your reminders', 'Choose when to be notified: 30 days, 2 weeks, or 1 week before expiry.'],
            ['We\'ll remind you', 'RegTrack monitors your fleet daily and sends email alerts automatically.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: '50%', background: 'var(--navy)', color: 'white', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#6b7c93', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '64px 24px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', textAlign: 'center', margin: '0 0 8px' }}>Simple pricing</h2>
        <p style={{ fontSize: 15, color: '#6b7c93', textAlign: 'center', margin: '0 0 40px' }}>No hidden fees. Cancel anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { name: 'Basic', price: '$5', desc: 'For individuals and small fleets.', features: ['Up to 5 vehicles', 'Email reminders', 'Fleet dashboard', 'VIN auto-fill'], featured: false },
            { name: 'Pro', price: '$10', desc: 'For growing fleets that need full visibility.', features: ['Unlimited vehicles', 'Email reminders', 'Fleet dashboard', 'VIN auto-fill', 'All vehicle types', 'Priority support'], featured: true },
          ].map(plan => (
            <div key={plan.name} className="card" style={{ padding: '28px 24px', border: plan.featured ? '2px solid #2E7DD1' : undefined }}>
              {plan.featured && <div style={{ background: '#E6F1FB', color: '#1A5FA8', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>Most popular</div>}
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1A5FA8', margin: '8px 0 4px' }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#6b7c93' }}>/mo</span></div>
              <div style={{ fontSize: 13, color: '#6b7c93', marginBottom: 20 }}>{plan.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#3B6D11', fontWeight: 600 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" style={{ display: 'block', background: plan.featured ? 'var(--navy)' : 'transparent', color: plan.featured ? 'white' : 'var(--navy)', border: '1px solid var(--navy)', textAlign: 'center', padding: '11px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 8 }}>RegTrack</div>
        <div style={{ fontSize: 12, color: '#7BA8D4' }}>Fleet registration management made simple.</div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 20 }}>
          <Link href="/auth/login" style={{ fontSize: 12, color: '#7BA8D4', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 12, color: '#7BA8D4', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </footer>
    </div>
  )
}
