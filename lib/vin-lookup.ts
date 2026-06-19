// lib/vin-lookup.ts
// Free NHTSA VIN decoder — no API key needed
// Docs: https://vpic.nhtsa.dot.gov/api/

import type { VINLookupResult } from '@/types'

const NHTSA_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin'

interface NHTSAVariable {
  Variable: string
  Value: string | null
}

export async function lookupVIN(vin: string): Promise<VINLookupResult> {
  const cleaned = vin.trim().toUpperCase()

  if (cleaned.length !== 17) {
    return { year: null, make: null, model: null, trim: null, vehicleType: null, found: false, error: 'VIN must be exactly 17 characters.' }
  }

  try {
    const res = await fetch(`${NHTSA_URL}/${cleaned}?format=json`, {
      next: { revalidate: 3600 } // cache for 1 hour
    })

    if (!res.ok) throw new Error('NHTSA API unavailable')

    const data = await res.json()
    const results: NHTSAVariable[] = data.Results

    const get = (name: string) => {
      const match = results.find(r => r.Variable === name)
      return match?.Value && match.Value !== '0' && match.Value !== 'Not Applicable' ? match.Value : null
    }

    const make  = get('Make')
    const model = get('Model')
    const year  = get('Model Year')

    // If we can't find basic info, VIN wasn't recognized
    if (!make && !model) {
      return { year: null, make: null, model: null, trim: null, vehicleType: null, found: false, error: 'VIN not found in NHTSA database. Please enter vehicle details manually.' }
    }

    return {
      year:        year,
      make:        make ? titleCase(make) : null,
      model:       model ? titleCase(model) : null,
      trim:        get('Trim') ? titleCase(get('Trim')!) : null,
      vehicleType: get('Vehicle Type'),
      found:       true,
    }
  } catch (err) {
    return {
      year: null, make: null, model: null, trim: null, vehicleType: null,
      found: false,
      error: 'Could not reach VIN lookup service. Please enter vehicle details manually.',
    }
  }
}

function titleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}
