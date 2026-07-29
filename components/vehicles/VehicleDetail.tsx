'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { VehicleDocument } from '@/types/documents'

interface Vehicle {
  id: string; fleet_number: string; vehicle_type: string; vin: string | null
  year: number | null; make: string | null; model: string | null; trim: string | null
  license_plate: string | null; registration_expiry: string; registration_state: string | null
  registration_number: string | null; notes: string | null; driver_name: string | null
  trailer_type: string | null; trailer_length: string | null
}

const S = { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }
const INPUT = { width: '100%', padding: '9px 12px', border: '1px solid #E2E5EA', borderRadius: 6, fontSize: 14, color: '#0A1628', background: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function VehicleDetail({ vehicle, documents: initialDocs, userId }: { vehicle: Vehicle; documents: VehicleDocument[]; userId: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<VehicleDocument[]>(initialDocs)
  const [driver, setDriver] = useState(vehicle.driver_name || '')
  const [savingDriver, setSavingDriver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [docName, setDocName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || vehicle.trailer_type || `Fleet #${vehicle.fleet_number}`

  const expiry = new Date(vehicle.registration_expiry + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const status = daysLeft < 0 ? 'expired' : daysLeft <= 30 ? 'expiring' : 'current'
  const statusLabel = daysLeft < 0 ? `Expired ${Math.abs(daysLeft)}d ago` : daysLeft === 0 ? 'Expires today' : daysLeft <= 30 ? `${daysLeft} days left` : 'Current'
  const statusStyle = { expired: { bg: '#FEF2F2', color: '#B91C1C' }, expiring: { bg: '#FFFBEB', color: '#B45309' }, current: { bg: '#F0FDF4', color: '#15803D' } }[status]

  async function saveDriver() {
    setSavingDriver(true)
    await fetch('/api/vehicles/driver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: vehicle.id, driver_name: driver.trim() || null }),
    })
    setSavingDriver(false)
    router.refresh()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!docName) setDocName(file.name.replace(/\.[^.]+$/, ''))
    }
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    const form = new FormData()
    form.append('file', selectedFile)
    form.append('vehicle_id', vehicle.id)
    form.append('name', docName || selectedFile.name)

    const res = await fetch('/api/documents', { method: 'POST', body: form })
    const data = await res.json()
    if (data.document) {
      setDocs(prev => [data.document, ...prev])
      setSelectedFile(null)
      setDocName('')
      if (fileRef.current) fileRef.current.value = ''
    }
    setUploading(false)
  }

  async function handleDownload(doc: VehicleDocument) {
    const res = await fetch(`/api/documents/download?path=${encodeURIComponent(doc.file_path)}`)
    const data = await res.json()
    if (data.url) {
      const a = document.createElement('a')
      a.href = data.url
      a.download = doc.name
      a.click()
    }
  }

  async function handleDelete(doc: VehicleDocument) {
    if (!confirm(`Delete "${doc.name}"?`)) return
    setDeletingId(doc.id)
    await fetch('/api/documents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: doc.id, file_path: doc.file_path }) })
    setDocs(prev => prev.filter(d => d.id !== doc.id))
    setDeletingId(null)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

      {/* Back */}
      <Link href="/dashboard/vehicles" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to fleet
      </Link>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #E2E5EA', paddingBottom: 32, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={S}>Fleet #{vehicle.fleet_number} · {vehicle.vehicle_type}</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 6 }}>{vehicleName}</h1>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 4, background: statusStyle.bg, color: statusStyle.color, letterSpacing: '0.04em' }}>
          {statusLabel.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Left column */}
        <div>
          {/* Vehicle info */}
          <div style={{ border: '1px solid #E2E5EA', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA' }}>
              <p style={S}>Vehicle information</p>
            </div>
            <div style={{ padding: '20px' }}>
              {[
                ['VIN', vehicle.vin || '—'],
                ['Year', vehicle.year?.toString() || '—'],
                ['Make', vehicle.make || '—'],
                ['Model', vehicle.model || '—'],
                ['Trim', vehicle.trim || '—'],
                ['License plate', vehicle.license_plate || '—'],
                ['Trailer type', vehicle.trailer_type || '—'],
                ['Trailer length', vehicle.trailer_length || '—'],
                ['State', vehicle.registration_state || '—'],
                ['Reg. number', vehicle.registration_number || '—'],
                ['Expiry date', formatDate(vehicle.registration_expiry)],
              ].filter(([, v]) => v !== '—' || ['VIN', 'License plate', 'Expiry date'].includes('')).map(([label, value], i, arr) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, color: value === '—' ? '#D1D5DB' : '#0A1628', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
              {vehicle.notes && (
                <div style={{ marginTop: 16, padding: '12px', background: '#F7F8FA', borderRadius: 6 }}>
                  <p style={{ ...S, marginBottom: 6 }}>Notes</p>
                  <p style={{ fontSize: 13, color: '#374151', fontWeight: 300, lineHeight: 1.6 }}>{vehicle.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Driver */}
          <div style={{ border: '1px solid #E2E5EA' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA' }}>
              <p style={S}>Assigned driver</p>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 14, fontWeight: 300 }}>
                Assign a driver to this vehicle for tracking purposes.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  style={{ ...INPUT, flex: 1 }}
                  value={driver}
                  onChange={e => setDriver(e.target.value)}
                  placeholder="Driver name"
                  onKeyDown={e => { if (e.key === 'Enter') saveDriver() }}
                />
                <button
                  onClick={saveDriver}
                  disabled={savingDriver}
                  style={{ fontSize: 13, fontWeight: 600, padding: '9px 18px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', opacity: savingDriver ? 0.6 : 1 }}
                >
                  {savingDriver ? 'Saving...' : 'Save'}
                </button>
              </div>
              {vehicle.driver_name && (
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 10 }}>
                  Currently assigned: <strong style={{ color: '#0A1628' }}>{vehicle.driver_name}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — Documents */}
        <div>
          <div style={{ border: '1px solid #E2E5EA' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={S}>Documents</p>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Upload area */}
            <div style={{ padding: '20px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA' }}>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />

              {!selectedFile ? (
                <label htmlFor="file-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px', border: '1px dashed #D1D5DB', borderRadius: 8, cursor: 'pointer', textAlign: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 12, color: '#9CA3AF' }}>
                    <path d="M14 4v14M7 11l7-7 7 7" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 20v2a2 2 0 002 2h16a2 2 0 002-2v-2" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Click to upload a document</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>PDF, JPG, or PNG</p>
                </label>
              ) : (
                <div style={{ border: '1px solid #E2E5EA', borderRadius: 8, padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" stroke="#1B4FD8" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9 1v4h4" stroke="#1B4FD8" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF' }}>{formatBytes(selectedFile.size)}</p>
                    </div>
                    <button onClick={() => { setSelectedFile(null); setDocName(''); if (fileRef.current) fileRef.current.value = '' }} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 18 }}>×</button>
                  </div>
                  <input
                    style={{ ...INPUT, marginBottom: 12 }}
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    placeholder="Document name (e.g. Registration 2025)"
                  />
                  <button onClick={handleUpload} disabled={uploading} style={{ width: '100%', fontSize: 13, fontWeight: 600, padding: '10px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.6 : 1 }}>
                    {uploading ? 'Uploading...' : 'Upload document'}
                  </button>
                </div>
              )}
            </div>

            {/* Documents list */}
            {docs.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 300 }}>No documents uploaded yet.</p>
              </div>
            ) : (
              <div>
                {docs.map((doc, i) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < docs.length - 1 ? '1px solid #E2E5EA' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F7F8FA', border: '1px solid #E2E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" stroke="#6B7280" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9 1v4h4" stroke="#6B7280" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(doc.created_at)} · {formatBytes(doc.file_size)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleDownload(doc)} style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', border: '1px solid #E2E5EA', borderRadius: 5, background: 'white', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Download
                      </button>
                      <button onClick={() => handleDelete(doc)} disabled={deletingId === doc.id} style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', border: '1px solid #FECACA', borderRadius: 5, background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {deletingId === doc.id ? '...' : 'Del'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
