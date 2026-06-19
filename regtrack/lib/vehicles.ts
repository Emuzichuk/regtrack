// lib/vehicles.ts
// Helper functions for vehicle status and fleet summaries

import { differenceInDays, parseISO } from 'date-fns'
import type { Vehicle, VehicleWithStatus, VehicleStatus, FleetSummary } from '@/types'

export function getVehicleStatus(expiryDateStr: string): { status: VehicleStatus; daysUntilExpiry: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = parseISO(expiryDateStr)
  const daysUntilExpiry = differenceInDays(expiry, today)

  let status: VehicleStatus
  if (daysUntilExpiry < 0)        status = 'expired'
  else if (daysUntilExpiry <= 30) status = 'expiring_soon'
  else                             status = 'current'

  return { status, daysUntilExpiry }
}

export function enrichVehicles(vehicles: Vehicle[]): VehicleWithStatus[] {
  return vehicles
    .filter(v => !v.archived)
    .map(v => {
      const { status, daysUntilExpiry } = getVehicleStatus(v.registration_expiry)
      return { ...v, status, daysUntilExpiry }
    })
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry) // most urgent first
}

export function getFleetSummary(vehicles: VehicleWithStatus[]): FleetSummary {
  return {
    total:         vehicles.length,
    current:       vehicles.filter(v => v.status === 'current').length,
    expiringSoon:  vehicles.filter(v => v.status === 'expiring_soon').length,
    expired:       vehicles.filter(v => v.status === 'expired').length,
    cars:          vehicles.filter(v => v.vehicle_type === 'car').length,
    trucks:        vehicles.filter(v => v.vehicle_type === 'truck').length,
    trailers:      vehicles.filter(v => v.vehicle_type === 'trailer').length,
  }
}

export function formatExpiryLabel(daysUntilExpiry: number): string {
  if (daysUntilExpiry < 0)  return `Expired ${Math.abs(daysUntilExpiry)}d ago`
  if (daysUntilExpiry === 0) return 'Expires today'
  if (daysUntilExpiry === 1) return 'Expires tomorrow'
  if (daysUntilExpiry <= 30) return `${daysUntilExpiry} days left`
  return ''
}

export function getStatusColor(status: VehicleStatus) {
  switch (status) {
    case 'current':       return { bg: '#EAF3DE', text: '#3B6D11', dot: '#639922' }
    case 'expiring_soon': return { bg: '#FAEEDA', text: '#854F0B', dot: '#BA7517' }
    case 'expired':       return { bg: '#FCEBEB', text: '#A32D2D', dot: '#E24B4A' }
  }
}

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  car:     'Car',
  truck:   'Truck',
  trailer: 'Trailer',
}

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

export const TRAILER_TYPES = [
  'Flatbed', 'Box / Dry Van', 'Refrigerated (Reefer)',
  'Lowboy', 'Step Deck', 'Tanker', 'Car Hauler',
  'Dump', 'Livestock', 'Curtainside', 'Other'
]
