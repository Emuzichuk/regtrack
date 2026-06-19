// ============================================================
// RegTrack — Shared TypeScript Types
// ============================================================

export type VehicleType = 'car' | 'truck' | 'trailer'
export type Plan = 'none' | 'basic' | 'pro'
export type PlanStatus = 'active' | 'inactive' | 'canceled' | 'past_due'
export type NotificationType = '30_day' | '14_day' | '7_day' | 'expired'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  plan: Plan
  plan_status: PlanStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  fleet_number: string
  vehicle_type: VehicleType
  vin: string | null
  license_plate: string | null

  // Auto-filled from VIN
  year: number | null
  make: string | null
  model: string | null
  trim: string | null

  // Trailer-specific
  trailer_type: string | null
  trailer_length: string | null

  // Registration
  registration_expiry: string   // ISO date string YYYY-MM-DD
  registration_state: string | null
  registration_number: string | null
  notes: string | null

  // Notification flags
  notified_30_days: boolean
  notified_14_days: boolean
  notified_7_days: boolean
  notified_expired: boolean

  archived: boolean
  created_at: string
  updated_at: string
}

export interface NotificationLog {
  id: string
  vehicle_id: string
  user_id: string
  type: NotificationType
  sent_at: string
  email_to: string
  success: boolean
  error_message: string | null
}

// ---- VIN Lookup (NHTSA API) ----
export interface VINLookupResult {
  year: string | null
  make: string | null
  model: string | null
  trim: string | null
  vehicleType: string | null
  found: boolean
  error?: string
}

// ---- Dashboard derived types ----
export type VehicleStatus = 'current' | 'expiring_soon' | 'expired'

export interface VehicleWithStatus extends Vehicle {
  status: VehicleStatus
  daysUntilExpiry: number
}

export interface FleetSummary {
  total: number
  current: number
  expiringSoon: number   // within 30 days
  expired: number
  cars: number
  trucks: number
  trailers: number
}

// ---- Form types ----
export interface AddVehicleFormData {
  fleet_number: string
  vehicle_type: VehicleType
  vin: string
  license_plate: string
  year: string
  make: string
  model: string
  trim: string
  trailer_type: string
  trailer_length: string
  registration_expiry: string
  registration_state: string
  registration_number: string
  notes: string
}
