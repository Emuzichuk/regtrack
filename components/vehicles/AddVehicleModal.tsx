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
  companies?: Company[]
  activeCompanyId?: string | null
  onClose: () => void
  onSaved: () => void
}

const FIELD = (label: string, children: React.ReactNode, required = false) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
      {label}{required && <span style={{ color: '#C0392B' }}> *</span>}
    </label>
    {children}
  </div>
)

const INPUT = { width: '100%', padding: '9px 12px', border: '1px solid #E2E5EA', borderRadius: 6, fontSize: 14, color: '#0A1628', background: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }
const SELECT = { ...INPUT }

export default function AddVehicleModal({ userId, defaultType, companies = [], activeCompanyId = null, onClose, onSaved }: Props) {
  const supabase = createClient()
  const [type, setType] = useState<VehicleType>(defaultType)
  const [vin, setVin] = useState('')
  const [vinLoading, setVinLoading] = useState(false)
  const [vinFound, setVinFound] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fleet_number: '', license_plate: '', company_id: activeCompanyId || '',
    year: '', make: '', model: '', trim: '', driver_name: '',
    trailer_type: '', trailer_length: '',
    registration_expiry: '', registration_state: '', registration_number: '', notes: '',
  })

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  async function lookupVIN() {
    if (vin.trim().length !== 17) { toast.error('VIN must be 17 characters'); return }
    setVinLoading(true)
    try {
      const res = await fetch(`/api/vin?vin=${vin.trim()}`)
      const data = await res.json()
      if (data.found) {
        setForm(p => ({ ...p, year: data.year || '', make: data.make || '', model: data.model || '', trim: data.trim || '' }))
        setVinFound(true)
        toast.success('Vehicle found!')
      } else {
        setVinFound(false)
        toast('Not found — enter details manually.', { icon: '⚠️' })
      }
    } catch { setVinFound(false) }
    setVinLoading(false)
  }

  async function handleSave() {
    if (!form.fleet_number.trim()) { toast.error('Fleet number is required'); return }
    if (!form.registration_expiry) { toast.error('Expiry date is required'); return }
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
      driver_name: form.driver_name.trim() || null,
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', border: '1px solid #E2E5EA', width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E5EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 2 }}>Fleet</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.02em' }}>Add vehicle</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#9CA3AF', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Type selector */}
          {FIELD('Vehicle type', (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {(['car', 'truck', 'trailer'] as VehicleType[]).map(t => (
                <button key={t} onClick={() => setType(t)} style={{ padding: '9px', border: `1.5px solid ${type === t ? '#0A1628' : '#E2E5EA'}`, borderRadius: 6, background: type === t ? '#0A1628' : 'white', color: type === t ? 'white' : '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
          ), true)}

          {/* Company */}
          {companies.length > 0 && FIELD('Company', (
            <select style={SELECT} value={form.company_id} onChange={set('company_id')}>
              <option value="">— Unassigned —</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ))}

          {/* Fleet number */}
          {FIELD('Fleet number', <input style={INPUT} value={form.fleet_number} onChange={set('fleet_number')} placeholder="e.g. 001, T-12" />, true)}

          {/* Driver */}
          {FIELD('Assigned driver', <input style={INPUT} value={form.driver_name} onChange={set('driver_name')} placeholder="Driver name (optional)" />)}

          {/* VIN — for ALL vehicle types */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
              VIN {type !== 'trailer' && <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(auto-fills details)</span>}
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...INPUT, flex: 1, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }} value={vin} onChange={e => { setVin(e.target.value.toUpperCase()); setVinFound(null) }} placeholder="17-character VIN (optional)" maxLength={17} />
              {type !== 'trailer' && (
                <button onClick={lookupVIN} disabled={vinLoading || vin.length !== 17} style={{ padding: '9px 14px', background: vin.length === 17 ? '#0A1628' : '#F3F4F6', color: vin.length === 17 ? 'white' : '#9CA3AF', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  {vinLoading ? '...' : 'Look up'}
                </button>
              )}
            </div>
            {vinFound === true && <p style={{ fontSize: 12, color: '#15803D', marginTop: 4 }}>Vehicle found — details filled in below</p>}
            {vinFound === false && <p style={{ fontSize: 12, color: '#B45309', marginTop: 4 }}>Not found — enter details manually</p>}
          </div>

          {/* Year / Make / Model / Trim */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{FIELD('Year', <input style={INPUT} value={form.year} onChange={set('year')} placeholder="2022" maxLength={4} />)}</div>
            <div>{FIELD('Make', <input style={INPUT} value={form.make} onChange={set('make')} placeholder="Ford" />)}</div>
            <div>{FIELD('Model', <input style={INPUT} value={form.model} onChange={set('model')} placeholder="F-150" />)}</div>
            <div>{FIELD('Trim', <input style={INPUT} value={form.trim} onChange={set('trim')} placeholder="XLT (optional)" />)}</div>
          </div>

          {/* Trailer-specific */}
          {type === 'trailer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>{FIELD('Trailer type', <select style={SELECT} value={form.trailer_type} onChange={set('trailer_type')}><option value="">Select type</option>{TRAILER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>)}</div>
              <div>{FIELD('Length', <input style={INPUT} value={form.trailer_length} onChange={set('trailer_length')} placeholder='e.g. 53 ft' />)}</div>
            </div>
          )}

          {/* License plate */}
          {FIELD('License plate', <input style={{ ...INPUT, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }} value={form.license_plate} onChange={set('license_plate')} placeholder="ABC-1234" />)}

          {/* Registration */}
          {FIELD('Registration expiry', <input type="date" style={INPUT} value={form.registration_expiry} onChange={set('registration_expiry')} />, true)}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>{FIELD('State', <select style={SELECT} value={form.registration_state} onChange={set('registration_state')}><option value="">Select state</option>{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>)}</div>
            <div>{FIELD('Reg. number', <input style={INPUT} value={form.registration_number} onChange={set('registration_number')} placeholder="Optional" />)}</div>
          </div>

          {FIELD('Notes', <textarea style={{ ...INPUT, minHeight: 60, resize: 'vertical' as const }} value={form.notes} onChange={set('notes')} placeholder="Optional notes" />)}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid #E2E5EA', borderRadius: 6, fontSize: 13, fontWeight: 500, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : 'Add vehicle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
