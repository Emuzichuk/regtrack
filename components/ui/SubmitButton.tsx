'use client'

export default function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel?: string }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '12px', background: loading ? '#374151' : '#0A1628',
      color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      letterSpacing: '-0.01em', transition: 'background 0.15s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {loading && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
          <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      {loading ? (loadingLabel || label) : label}
    </button>
  )
}
