'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { VehicleWithStatus } from '@/types'

interface Props {
  vehicle: VehicleWithStatus
  onClose: () => void
  onSaved: () => void
}

type RegStatus = 'registered' | 'in_process' | 'not_registered'

const OPTIONS: { value: RegStatus; label: string; desc: string; color: string; bg: string }[] = [
  { value: 'registered',     label: '✓ Registered',   desc: 'Registration is current — set new expiry date', color: '#3B6D11', bg: '#EAF3DE' },
  { value: 'in_process',     label: '⟳ In process',   desc: 'Renewal submitted, waiting on DMV',             color: '#854F0B', bg: '#FAEEDA' },
  { value: 'not_registered', label: '✗ Not registered', desc: 'Registration has lapsed or not yet renewed',   color: '#A32D2D', bg: '#FCEBEB' },
]

export default function RegistrationStatusModal({ vehicle, onClose, onSaved }: Props) {
  const supabase = createClient()
  const [status, setStatus] = useState<RegStatus>('registered')
  const [newExpiry, setNewExpiry] = useState('')
  const [saving, setSaving] = useState(false)

  const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || `Fleet #${vehicle.fleet_number}`

  // Auto-suggest expiry 1 year from today when "registered" is picked
  function handleStatusChange(val: RegStatus) {
    setStatus(val)
    if (val === 'registered' && !newExpiry) {
      const next = new Date()
      next.setFullYear(next.getFullYear() + 1)
      setNewExpiry(next.toISOString().split('T')[0])
    }
  }

  async function handleSave() {
    if (status === 'registered' && !newExpiry) {
      toast.error('Please enter the new expiry date')
      return
    }
    setSaving(true)

    const updates: Record<string, any> = {
      notified_30_days: false,
      notified_14_days: false,
      notified_7_days: false,
      notified_expired: false,
    }

    if (status === 'registered') {
      updates.registration_expiry = newExpiry
      updates.notes = vehicle.notes || null
    } else if (status === 'in_process') {
      updates.notes = `[In process as of ${new Date().toLocaleDateString()}] ${vehicle.notes || ''}`.trim()
    } else {
      updates.notes = `[Not registered as of ${new Date().toLocaleDateString()}] ${vehicle.notes || ''}`.trim()
    }

    const { error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', vehicle.id)

    if (error) {
      toast.error('Failed to update: ' + error.message)
      setSaving(false)
      return
    }

    const msg = status === 'registered' ? 'Registration updated!' : status === 'in_process' ? 'Marked as in process' : 'Marked as not registered'
    toast.success(msg)
    onSaved()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 440, padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0C2340', margin: '0 0 3px' }}>Update registration</h2>
            <p style={{ fontSize: 13, color: '#9aabc0', margin: 0 }}>Fleet #{vehicle.fleet_number} · {vehicleName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9aabc0', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Status options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                border: status === opt.value ? `2px solid ${opt.color}` : '1.5px solid rgba(20,60,120,0.12)',
                background: status === opt.value ? opt.bg : 'white',
                transition: 'all 0.1s',
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${status === opt.value ? opt.color : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {status === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: opt.color }} />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: status === opt.value ? opt.color : '#0C2340' }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: '#9aabc0', marginTop: 1 }}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* New expiry date — only shown when "registered" */}
        {status === 'registered' && (
          <div style={{ marginBottom: 20, padding: '16px', background: '#F5F8FC', borderRadius: 10 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 6 }}>
              New expiry date <span style={{ color: '#E24B4A' }}>*</span>
            </label>
            <input
              type="date"
              value={newExpiry}
              onChange={e => setNewExpiry(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, color: '#0C2340', background: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
            <p style={{ fontSize: 11, color: '#9aabc0', marginTop: 6, marginBottom: 0 }}>
              Pre-filled to one year from today — adjust if needed.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#6b7c93', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '10px 24px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}
