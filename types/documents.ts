export interface VehicleDocument {
  id: string
  vehicle_id: string
  user_id: string
  name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  created_at: string
}
