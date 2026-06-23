'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { VehicleType } from '@/types'
import { US_STATES, TRAILER_TYPES } from '@/lib/vehicles'

interface Company { id: string; name: string }

interface Props {
  userId: string
  defaultType: VehicleType
  activeCompanyId?: string | null
  companies?: Company[]
  onClose: () => void
  onSaved: () => void
}

const FIELD = (label: string, id: string, children: React.ReactNode, required = false) => (
  <div style={{ marginBottom: 14 }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 }}>
      {label}{required && <span style={{ color: '#E24B4A' }}> *</span>}
    </label>
    {children}
  </div>
)

const INPUT_STYLE = { width: '100%', padding: '8px 11px', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 7, fontSize: 14, color: '#0C2340', background: 'white', outline: 'none', boxSizing: 'border-box' as const }
const SELECT_STYLE = { ...INPUT_STYLE }

export default function AddVehicleModal({ userId, defaultType, companies = [], activeCompanyId = null, onClose, onSaved }: Props) {
  const supabase = createClient()
  const [type, setType] = useState<VehicleType>(defaultType)
  const [vin, setVin] = useState('')
  const [vinLoading, setVinLoading] = useState(false)
  const [vinFound, setVinFound] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fleet_number: '', license_plate: '', company_id: activeCompanyId || '',
    year: '', make: '', model: '', trim: '',
    trailer_type: '', trailer_length: '',
    registration_expiry: '', registration_state: '', registration_number: '', notes: '',
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function lookupVIN() {
    if (vin.trim().length !== 17) { toast.error('VIN must be 17 characters'); return }
    setVinLoading(true)
    try {
      const res = await fetch(`/api/vin?vin=${vin.trim()}`)
      const data = await res.json()
      if (data.found) {
        setForm(f => ({ ...f, year: data.year || '', make: data.make || '', model: data.model || '', trim: data.trim || '' }))
        setVinFound(true)
        toast.success('Vehicle found!')
      } else {
        setVinFound(false)
        toast('VIN not found — please enter details manually.', { icon: '⚠️' })
      }
    } catch {
      setVinFound(false)
      toast.error('VIN lookup failed — enter details manually')
    }
    setVinLoading(false)
  }

  async function handleSave() {
    if (!form.fleet_number.trim()) { toast.error('Fleet number is required'); return }
    if (!form.registration_expiry) { toast.error('Registration expiry date is required'); return }
    if (type !== 'trailer' && !vin.trim() && !form.make) { toast.error('Enter a VIN or vehicle make/model'); return }
    setSaving(true)

    const { error } = await supabase.from('vehicles').insert({
      user_id: userId,
      fleet_number: form.fleet_number.trim(),
      vehicle_type: type,
      company_id: form.company_id || null,
      vin: vin.trim() || null,
      license_plate: form.license_plate.trim() || null,
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
    })

    if (error) { toast.error('Failed to save: ' + error.message); setSaving(false); return }
    toast.success('Vehicle added!')
    onSaved()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0C2340', margin: 0 }}>Add vehicle</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9aabc0', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Vehicle type */}
        {FIELD('Vehicle type', 'type', (
          <div style={{ display: 'flex', gap: 8 }}>
            {([['car', 'Car'], ['truck', 'Truck'], ['trailer', 'Trailer']] as [VehicleType, string][]).map(([val, lbl]) => (
              <button key={val} onClick={() => setType(val)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${type === val ? '#0C2340' : 'rgba(20,60,120,0.15)'}`, background: type === val ? '#EEF4FB' : 'white', fontSize: 13, fontWeight: 500, color: type === val ? '#0C2340' : '#6b7c93', cursor: 'pointer' }}>
                {lbl}
              </button>
            ))}
          </div>
        ), true)}

        {/* Company */}
        {companies.length > 0 && FIELD('Assign to company', 'company_id',
          <select id="company_id" style={SELECT_STYLE} value={form.company_id} onChange={set('company_id')}>
            <option value="">— Unassigned (personal fleet) —</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}

        {/* Fleet number */}
        {FIELD('Fleet number', 'fleet_number',
          <input id="fleet_number" style={INPUT_STYLE} value={form.fleet_number} onChange={set('fleet_number')} placeholder="e.g. 001, T-12, TRUCK-4" />, true
        )}

        {/* VIN lookup */}
        {type !== 'trailer' && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 }}>VIN lookup</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...INPUT_STYLE, flex: 1, fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }} value={vin} onChange={e => { setVin(e.target.value.toUpperCase()); setVinFound(null) }} placeholder="17-character VIN" maxLength={17} />
              <button onClick={lookupVIN} disabled={vinLoading || vin.length !== 17} style={{ padding: '8px 14px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', opacity: vin.length !== 17 ? 0.5 : 1 }}>
                {vinLoading ? '...' : 'Look up'}
              </button>
            </div>
            {vinFound === true && <p style={{ fontSize: 12, color: '#3B6D11', marginTop: 4 }}>✓ Vehicle found — details filled in below</p>}
            {vinFound === false && <p style={{ fontSize: 12, color: '#854F0B', marginTop: 4 }}>⚠ Not found — enter details manually below</p>}
          </div>
        )}

        {type !== 'trailer' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{FIELD('Year', 'year', <input id="year" style={INPUT_STYLE} value={form.year} onChange={set('year')} placeholder="2022" maxLength={4} />)}</div>
              <div>{FIELD('Make', 'make', <input id="make" style={INPUT_STYLE} value={form.make} onChange={set('make')} placeholder="Ford" />)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{FIELD('Model', 'model', <input id="model" style={INPUT_STYLE} value={form.model} onChange={set('model')} placeholder="F-150" />)}</div>
              <div>{FIELD('Trim', 'trim', <input id="trim" style={INPUT_STYLE} value={form.trim} onChange={set('trim')} placeholder="XLT (optional)" />)}</div>
            </div>
          </>
        )}

        {type === 'trailer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{FIELD('Trailer type', 'trailer_type', <select id="trailer_type" style={SELECT_STYLE} value={form.trailer_type} onChange={set('trailer_type')}><option value="">Select type</option>{TRAILER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>)}</div>
            <div>{FIELD('Length', 'trailer_length', <input id="trailer_length" style={INPUT_STYLE} value={form.trailer_length} onChange={set('trailer_length')} placeholder='e.g. 53 ft' />)}</div>
          </div>
        )}

        {FIELD('License plate', 'license_plate',
          <input id="license_plate" style={{ ...INPUT_STYLE, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }} value={form.license_plate} onChange={set('license_plate')} placeholder="ABC-1234" />
        )}

        {FIELD('Registration expiry date', 'registration_expiry',
          <input id="registration_expiry" type="date" style={INPUT_STYLE} value={form.registration_expiry} onChange={set('registration_expiry')} />, true
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>{FIELD('State', 'registration_state', <select id="registration_state" style={SELECT_STYLE} value={form.registration_state} onChange={set('registration_state')}><option value="">Select state</option>{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>)}</div>
          <div>{FIELD('Registration #', 'registration_number', <input id="registration_number" style={INPUT_STYLE} value={form.registration_number} onChange={set('registration_number')} placeholder="Optional" />)}</div>
        </div>

        {FIELD('Notes', 'notes', <textarea id="notes" style={{ ...INPUT_STYLE, minHeight: 60, resize: 'vertical' as const }} value={form.notes} onChange={set('notes')} placeholder="Optional notes" />)}

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#6b7c93', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Add vehicle'}
          </button>
        </div>
      </div>
    </div>
  )
}
