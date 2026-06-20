'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { VehicleWithStatus } from '@/types'
import { US_STATES, TRAILER_TYPES } from '@/lib/vehicles'

interface Company { id: string; name: string }

interface Props {
  vehicle: VehicleWithStatus
  companies?: Company[]
  onClose: () => void
  onSaved: () => void
}

const INPUT_STYLE = { width: '100%', padding: '8px 11px', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 7, fontSize: 14, color: '#0C2340', background: 'white', outline: 'none', boxSizing: 'border-box' as const }
const SELECT_STYLE = { ...INPUT_STYLE }
const FIELD = (label: string, id: string, children: React.ReactNode, required = false) => (
  <div style={{ marginBottom: 14 }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 }}>
      {label}{required && <span style={{ color: '#E24B4A' }}> *</span>}
    </label>
    {children}
  </div>
)

export default function EditVehicleModal({ vehicle, companies = [], onClose, onSaved }: Props) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fleet_number: vehicle.fleet_number || '',
    license_plate: vehicle.license_plate || '',
    company_id: (vehicle as any).company_id || '',
    year: vehicle.year?.toString() || '',
    make: vehicle.make || '',
    model: vehicle.model || '',
    trim: vehicle.trim || '',
    trailer_type: vehicle.trailer_type || '',
    trailer_length: vehicle.trailer_length || '',
    registration_expiry: vehicle.registration_expiry || '',
    registration_state: vehicle.registration_state || '',
    registration_number: vehicle.registration_number || '',
    notes: vehicle.notes || '',
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSave() {
    if (!form.fleet_number.trim()) { toast.error('Fleet number is required'); return }
    if (!form.registration_expiry) { toast.error('Expiry date is required'); return }
    setSaving(true)

    const { error } = await supabase.from('vehicles').update({
      fleet_number: form.fleet_number.trim(),
      license_plate: form.license_plate.trim() || null,
      company_id: form.company_id || null,
      year: form.year ? parseInt(form.year) : null,
      make: form.make.trim() || null,
      model: form.model.trim() || null,
      trim: form.trim.trim() || null,
      trailer_type: form.trailer_type || null,
      trailer_length: form.trailer_length.trim() || null,
      registration_expiry: form.registration_expiry,
      registration_state: form.registration_state || null,
      registration_number: form.registration_number.trim() || null,
      notes: form.notes.trim() || null,
      notified_30_days: false,
      notified_14_days: false,
      notified_7_days: false,
      notified_expired: false,
    }).eq('id', vehicle.id)

    if (error) { toast.error('Failed to save: ' + error.message); setSaving(false); return }
    toast.success('Vehicle updated!')
    onSaved()
  }

  const isTrailer = vehicle.vehicle_type === 'trailer'
  const typeIcon = { car: '🚗', truck: '🛻', trailer: '🚛' }[vehicle.vehicle_type]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0C2340', margin: '0 0 2px' }}>Edit vehicle</h2>
            <p style={{ fontSize: 12, color: '#9aabc0', margin: 0 }}>{typeIcon} {vehicle.vehicle_type} · Fleet #{vehicle.fleet_number}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9aabc0', cursor: 'pointer' }}>×</button>
        </div>

        {companies.length > 0 && FIELD('Company', 'company_id',
          <select id="company_id" style={SELECT_STYLE} value={form.company_id} onChange={set('company_id')}>
            <option value="">— Unassigned —</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}

        {FIELD('Fleet number', 'fleet_number', <input id="fleet_number" style={INPUT_STYLE} value={form.fleet_number} onChange={set('fleet_number')} />, true)}

        {!isTrailer && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{FIELD('Year', 'year', <input id="year" style={INPUT_STYLE} value={form.year} onChange={set('year')} maxLength={4} />)}</div>
              <div>{FIELD('Make', 'make', <input id="make" style={INPUT_STYLE} value={form.make} onChange={set('make')} />)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{FIELD('Model', 'model', <input id="model" style={INPUT_STYLE} value={form.model} onChange={set('model')} />)}</div>
              <div>{FIELD('Trim', 'trim', <input id="trim" style={INPUT_STYLE} value={form.trim} onChange={set('trim')} placeholder="Optional" />)}</div>
            </div>
          </>
        )}

        {isTrailer && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{FIELD('Trailer type', 'trailer_type', <select id="trailer_type" style={SELECT_STYLE} value={form.trailer_type} onChange={set('trailer_type')}><option value="">Select type</option>{TRAILER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>)}</div>
            <div>{FIELD('Length', 'trailer_length', <input id="trailer_length" style={INPUT_STYLE} value={form.trailer_length} onChange={set('trailer_length')} placeholder='e.g. 53 ft' />)}</div>
          </div>
        )}

        {FIELD('License plate', 'license_plate',
          <input id="license_plate" style={{ ...INPUT_STYLE, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }} value={form.license_plate} onChange={set('license_plate')} />
        )}

        {FIELD('Registration expiry date', 'registration_expiry',
          <input id="registration_expiry" type="date" style={INPUT_STYLE} value={form.registration_expiry} onChange={set('registration_expiry')} />, true
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>{FIELD('State', 'registration_state', <select id="registration_state" style={SELECT_STYLE} value={form.registration_state} onChange={set('registration_state')}><option value="">Select state</option>{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>)}</div>
          <div>{FIELD('Registration #', 'registration_number', <input id="registration_number" style={INPUT_STYLE} value={form.registration_number} onChange={set('registration_number')} placeholder="Optional" />)}</div>
        </div>

        {FIELD('Notes', 'notes', <textarea id="notes" style={{ ...INPUT_STYLE, minHeight: 60, resize: 'vertical' as const }} value={form.notes} onChange={set('notes')} />)}

        <p style={{ fontSize: 12, color: '#9aabc0', marginBottom: 20, padding: '8px 12px', background: '#F5F8FC', borderRadius: 7 }}>
          Saving will reset email reminders for the updated expiry date.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#6b7c93', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
