'use client'
import Link from 'next/link'

interface AuthCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F7FA',
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Left panel */}
      <div style={{
        width: '42%',
        minWidth: 380,
        background: '#0C2340',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>RegTrack</span>
        </Link>

        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 16px' }}>
            Fleet registration<br />made effortless.
          </h2>
          <p style={{ fontSize: 15, color: '#7A9AB8', lineHeight: 1.7, margin: '0 0 40px' }}>
            Track every vehicle, get automatic renewal reminders, and manage multiple companies — all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['Automatic email reminders', '30, 14, and 7-day alerts before registrations expire'],
              ['VIN auto-fill', 'Year, make, and model filled in automatically'],
              ['Cars, trucks & trailers', 'Separate tracking for every vehicle type'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(46,125,209,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2, letterSpacing: '-0.01em' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#5A7A96', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#2A4A64' }}>© 2025 RegTrack</div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#080F1A', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
            {title}
          </h1>
          <p style={{ fontSize: 15, color: '#6B8099', margin: '0 0 32px', lineHeight: 1.5 }}>
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}
