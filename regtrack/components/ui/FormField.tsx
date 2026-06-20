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

export default function FormField({
  label, id, type = 'text', value, onChange,
  placeholder, error, autoComplete, required, hint,
}: FormFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} className="label">
        {label}{required && <span style={{ color: '#E24B4A', marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="input"
        style={error ? { borderColor: '#E24B4A' } : {}}
      />
      {hint && !error && (
        <p style={{ fontSize: 12, color: '#9aabc0', marginTop: 4 }}>{hint}</p>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
