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
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--navy)', letterSpacing: '-0.02em' }}>
            RegTrack
          </span>
        </div>
      </Link>

      {/* Card */}
      <div style={{
        background: 'white',
        border: '0.5px solid rgba(20,60,120,0.12)',
        borderRadius: 16,
        padding: '36px 40px',
        width: '100%',
        maxWidth: 420,
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--navy)', margin: '0 0 6px' }}>
          {title}
        </h1>
        <p style={{ fontSize: 14, color: '#6b7c93', margin: '0 0 28px', lineHeight: 1.5 }}>
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  )
}
