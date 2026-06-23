'use client'
import Link from 'next/link'

const Logo = () => (
  <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 26, height: 26, background: '#0A1628', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
        <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
        <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
        <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.2"/>
      </svg>
    </div>
    <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: '#0A1628' }}>RegTrack</span>
  </Link>
)

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex' }}>

      {/* Left — dark panel */}
      <div style={{ width: '44%', minWidth: 360, background: '#0A1628', display: 'flex', flexDirection: 'column', padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Logo />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 60 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Fleet Registration Management</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
              Keep every<br />registration current.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontWeight: 300, marginBottom: 48, maxWidth: 320 }}>
              Automatic email reminders, VIN lookup, and fleet management for DMV professionals.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                ['Email reminders', '30, 14, and 7-day alerts before expiry'],
                ['VIN auto-fill', 'Year, make, and model from VIN'],
                ['Multiple companies', 'Manage multiple clients in one account'],
              ].map(([title, desc], i) => (
                <div key={title} style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>{title}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 300, textAlign: 'right' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 40 }}>© 2025 RegTrack</div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
        {/* Top bar */}
        <div style={{ padding: '24px 48px', borderBottom: '1px solid #E2E5EA', display: 'flex', justifyContent: 'flex-end', background: 'white' }}>
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            Need help?{' '}
            <Link href="/" style={{ color: '#0A1628', fontWeight: 500, textDecoration: 'none' }}>Back to home</Link>
          </div>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.2 }}>{title}</h1>
              <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 300, lineHeight: 1.5 }}>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
