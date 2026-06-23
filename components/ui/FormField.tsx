'use client'

interface FormFieldProps {
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  autoComplete?: string
  required?: boolean
  hint?: string
}

export default function FormField({ label, id, type = 'text', value, onChange, placeholder, error, autoComplete, required, hint }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A6080', marginBottom: 6, letterSpacing: '-0.01em' }}>
        {label}{required && <span style={{ color: '#D04040', marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        style={{
          width: '100%', padding: '11px 14px',
          border: error ? '1.5px solid #D04040' : '1px solid rgba(0,0,0,0.13)',
          borderRadius: 9, fontSize: 14, color: '#0A1929',
          background: 'white', outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxSizing: 'border-box' as const,
        }}
        onFocus={e => { e.target.style.borderColor = '#2E7DD1'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,209,0.12)' }}
        onBlur={e => { e.target.style.borderColor = error ? '#D04040' : 'rgba(0,0,0,0.13)'; e.target.style.boxShadow = 'none' }}
      />
      {hint && !error && <p style={{ fontSize: 12, color: '#9AABBC', marginTop: 5 }}>{hint}</p>}
      {error && <p style={{ color: '#D04040', fontSize: 12, marginTop: 5, fontWeight: 500 }}>{error}</p>}
    </div>
  )
}
