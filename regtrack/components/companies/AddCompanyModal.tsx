'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  onClose: () => void
  onSaved: (company: { id: string; name: string }) => void
}

const INPUT_STYLE = { width: '100%', padding: '9px 12px', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, color: '#0C2340', background: 'white', outline: 'none', boxSizing: 'border-box' as const }

export default function AddCompanyModal({ userId, onClose, onSaved }: Props) {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) { toast.error('Company name is required'); return }
    setSaving(true)
    const { data, error } = await supabase
      .from('companies')
      .insert({ user_id: userId, name: name.trim(), notes: notes.trim() || null })
      .select()
      .single()
    if (error) { toast.error('Failed to create company'); setSaving(false); return }
    toast.success(`"${name}" added!`)
    onSaved(data)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 420, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0C2340', margin: 0 }}>Add company</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9aabc0', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 }}>
            Company name <span style={{ color: '#E24B4A' }}>*</span>
          </label>
          <input
            style={INPUT_STYLE}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Santos Transport LLC"
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 }}>Notes (optional)</label>
          <textarea
            style={{ ...INPUT_STYLE, minHeight: 70, resize: 'vertical' as const }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Contact info, notes about this client..."
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#6b7c93', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Add company'}
          </button>
        </div>
      </div>
    </div>
  )
}
