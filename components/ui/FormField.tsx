'use client'

interface Props {
  label: string; id: string; type?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; error?: string; autoComplete?: string
  required?: boolean; hint?: string
}

export default function FormField({ label, id, type = 'text', value, onChange, placeholder, error, autoComplete, required, hint }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
        {label}{required && <span style={{ color: '#C0392B', marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete} required={required}
        style={{
          width: '100%', padding: '11px 14px', border: `1px solid ${error ? '#C0392B' : '#E2E5EA'}`,
          borderRadius: 8, fontSize: 14, color: '#0A1628', background: 'white',
          outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
          boxSizing: 'border-box' as const,
        }}
        onFocus={e => { e.target.style.borderColor = '#1B4FD8'; e.target.style.boxShadow = '0 0 0 3px rgba(27,79,216,0.08)' }}
        onBlur={e => { e.target.style.borderColor = error ? '#C0392B' : '#E2E5EA'; e.target.style.boxShadow = 'none' }}
      />
      {hint && !error && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5 }}>{hint}</p>}
      {error && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  )
}
