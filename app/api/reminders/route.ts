// app/api/reminders/route.ts
// Called daily by Vercel Cron to send registration reminder emails
// Vercel Cron config: vercel.json (added below)

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { differenceInDays, parseISO } from 'date-fns'
import type { Vehicle, Profile } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

// Secure this endpoint so only Vercel Cron can call it
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all non-archived vehicles with their owner profiles
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*, profiles(*)')
    .eq('archived', false)

  if (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let emailsSent = 0
  let errors = 0

  for (const vehicle of vehicles as any[]) {
    const profile: Profile = vehicle.profiles
    if (!profile || profile.plan_status !== 'active') continue

    const expiry = parseISO(vehicle.registration_expiry)
    const daysLeft = differenceInDays(expiry, today)

    const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || `Vehicle #${vehicle.fleet_number}`

    try {
      // 30-day notice
      if (daysLeft === 30 && !vehicle.notified_30_days) {
        await sendReminderEmail(resend, profile, vehicle, vehicleName, 30, daysLeft)
        await supabase.from('vehicles').update({ notified_30_days: true }).eq('id', vehicle.id)
        await logNotification(supabase, vehicle.id, profile.id, '30_day', profile.email)
        emailsSent++
      }
      // 14-day notice
      else if (daysLeft === 14 && !vehicle.notified_14_days) {
        await sendReminderEmail(resend, profile, vehicle, vehicleName, 14, daysLeft)
        await supabase.from('vehicles').update({ notified_14_days: true }).eq('id', vehicle.id)
        await logNotification(supabase, vehicle.id, profile.id, '14_day', profile.email)
        emailsSent++
      }
      // 7-day notice
      else if (daysLeft === 7 && !vehicle.notified_7_days) {
        await sendReminderEmail(resend, profile, vehicle, vehicleName, 7, daysLeft)
        await supabase.from('vehicles').update({ notified_7_days: true }).eq('id', vehicle.id)
        await logNotification(supabase, vehicle.id, profile.id, '7_day', profile.email)
        emailsSent++
      }
      // Expired notice
      else if (daysLeft < 0 && !vehicle.notified_expired) {
        await sendExpiredEmail(resend, profile, vehicle, vehicleName)
        await supabase.from('vehicles').update({ notified_expired: true }).eq('id', vehicle.id)
        await logNotification(supabase, vehicle.id, profile.id, 'expired', profile.email)
        emailsSent++
      }
    } catch (err: any) {
      console.error(`Failed to send email for vehicle ${vehicle.id}:`, err)
      await logNotification(supabase, vehicle.id, profile.id, '30_day', profile.email, err.message)
      errors++
    }
  }

  return NextResponse.json({ success: true, emailsSent, errors, vehiclesChecked: vehicles.length })
}

// ---- Email sending functions ----

async function sendReminderEmail(
  resend: Resend,
  profile: Profile,
  vehicle: Vehicle,
  vehicleName: string,
  daysNotice: number,
  daysLeft: number
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const urgency = daysLeft <= 7 ? 'URGENT: ' : daysLeft <= 14 ? 'Action needed: ' : ''

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: profile.email,
    subject: `${urgency}Fleet #${vehicle.fleet_number} registration expires in ${daysLeft} days`,
    html: reminderEmailHTML({
      name: profile.full_name || profile.email,
      vehicleName,
      fleetNumber: vehicle.fleet_number,
      vehicleType: vehicle.vehicle_type,
      licensePlate: vehicle.license_plate || 'N/A',
      expiryDate: vehicle.registration_expiry,
      daysLeft,
      dashboardUrl: `${appUrl}/dashboard/vehicles`,
    }),
  })
}

async function sendExpiredEmail(
  resend: Resend,
  profile: Profile,
  vehicle: Vehicle,
  vehicleName: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: profile.email,
    subject: `⚠️ Fleet #${vehicle.fleet_number} registration has EXPIRED`,
    html: expiredEmailHTML({
      name: profile.full_name || profile.email,
      vehicleName,
      fleetNumber: vehicle.fleet_number,
      vehicleType: vehicle.vehicle_type,
      licensePlate: vehicle.license_plate || 'N/A',
      expiryDate: vehicle.registration_expiry,
      dashboardUrl: `${appUrl}/dashboard/vehicles`,
    }),
  })
}

async function logNotification(
  supabase: any,
  vehicleId: string,
  userId: string,
  type: string,
  email: string,
  errorMessage?: string
) {
  await supabase.from('notification_log').insert({
    vehicle_id: vehicleId,
    user_id: userId,
    type,
    email_to: email,
    success: !errorMessage,
    error_message: errorMessage || null,
  })
}

// ---- Email HTML templates ----

function reminderEmailHTML(data: {
  name: string; vehicleName: string; fleetNumber: string; vehicleType: string;
  licensePlate: string; expiryDate: string; daysLeft: number; dashboardUrl: string;
}) {
  const urgencyColor = data.daysLeft <= 7 ? '#A32D2D' : data.daysLeft <= 14 ? '#854F0B' : '#1A5FA8'
  const urgencyBg    = data.daysLeft <= 7 ? '#FCEBEB' : data.daysLeft <= 14 ? '#FAEEDA' : '#E6F1FB'

  return `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:Inter,system-ui,sans-serif;background:#F5F8FC;margin:0;padding:32px 16px">
<div style="max-width:560px;margin:0 auto">
  <div style="background:#0C2340;border-radius:12px 12px 0 0;padding:24px 32px">
    <h1 style="color:white;font-size:20px;font-weight:600;margin:0">RegTrack</h1>
    <p style="color:#B5D4F4;font-size:13px;margin:4px 0 0">Fleet Registration Management</p>
  </div>
  <div style="background:white;border-radius:0 0 12px 12px;padding:32px;border:0.5px solid rgba(20,60,120,0.12)">
    <p style="font-size:15px;color:#0C2340;margin:0 0 20px">Hi ${data.name},</p>
    <div style="background:${urgencyBg};border-radius:10px;padding:20px;margin-bottom:24px;text-align:center">
      <p style="color:${urgencyColor};font-size:28px;font-weight:700;margin:0">${data.daysLeft} days</p>
      <p style="color:${urgencyColor};font-size:13px;margin:4px 0 0">until registration expires</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
      <tr style="border-bottom:1px solid #E6F1FB">
        <td style="padding:10px 0;color:#4a6080;font-weight:500">Fleet #</td>
        <td style="padding:10px 0;text-align:right;color:#0C2340;font-weight:600">${data.fleetNumber}</td>
      </tr>
      <tr style="border-bottom:1px solid #E6F1FB">
        <td style="padding:10px 0;color:#4a6080;font-weight:500">Vehicle</td>
        <td style="padding:10px 0;text-align:right;color:#0C2340">${data.vehicleName}</td>
      </tr>
      <tr style="border-bottom:1px solid #E6F1FB">
        <td style="padding:10px 0;color:#4a6080;font-weight:500">Type</td>
        <td style="padding:10px 0;text-align:right;color:#0C2340;text-transform:capitalize">${data.vehicleType}</td>
      </tr>
      <tr style="border-bottom:1px solid #E6F1FB">
        <td style="padding:10px 0;color:#4a6080;font-weight:500">License plate</td>
        <td style="padding:10px 0;text-align:right;color:#0C2340">${data.licensePlate}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#4a6080;font-weight:500">Expires</td>
        <td style="padding:10px 0;text-align:right;color:${urgencyColor};font-weight:600">${data.expiryDate}</td>
      </tr>
    </table>
    <a href="${data.dashboardUrl}" style="display:block;background:#0C2340;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View in RegTrack Dashboard →</a>
    <p style="font-size:12px;color:#9aabc0;margin-top:24px;text-align:center">You're receiving this because you have an active RegTrack subscription.<br>Manage your notification settings in your dashboard.</p>
  </div>
</div>
</body></html>`
}

function expiredEmailHTML(data: {
  name: string; vehicleName: string; fleetNumber: string; vehicleType: string;
  licensePlate: string; expiryDate: string; dashboardUrl: string;
}) {
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:Inter,system-ui,sans-serif;background:#F5F8FC;margin:0;padding:32px 16px">
<div style="max-width:560px;margin:0 auto">
  <div style="background:#0C2340;border-radius:12px 12px 0 0;padding:24px 32px">
    <h1 style="color:white;font-size:20px;font-weight:600;margin:0">RegTrack</h1>
  </div>
  <div style="background:white;border-radius:0 0 12px 12px;padding:32px;border:0.5px solid rgba(20,60,120,0.12)">
    <p style="font-size:15px;color:#0C2340;margin:0 0 20px">Hi ${data.name},</p>
    <div style="background:#FCEBEB;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center">
      <p style="color:#A32D2D;font-size:22px;font-weight:700;margin:0">Registration Expired</p>
      <p style="color:#A32D2D;font-size:13px;margin:4px 0 0">This vehicle may not be legally driven until renewed</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
      <tr style="border-bottom:1px solid #E6F1FB"><td style="padding:10px 0;color:#4a6080;font-weight:500">Fleet #</td><td style="padding:10px 0;text-align:right;font-weight:600">${data.fleetNumber}</td></tr>
      <tr style="border-bottom:1px solid #E6F1FB"><td style="padding:10px 0;color:#4a6080;font-weight:500">Vehicle</td><td style="padding:10px 0;text-align:right">${data.vehicleName}</td></tr>
      <tr style="border-bottom:1px solid #E6F1FB"><td style="padding:10px 0;color:#4a6080;font-weight:500">License plate</td><td style="padding:10px 0;text-align:right">${data.licensePlate}</td></tr>
      <tr><td style="padding:10px 0;color:#4a6080;font-weight:500">Expired on</td><td style="padding:10px 0;text-align:right;color:#A32D2D;font-weight:600">${data.expiryDate}</td></tr>
    </table>
    <a href="${data.dashboardUrl}" style="display:block;background:#A32D2D;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Renew Now in Dashboard →</a>
  </div>
</div>
</body></html>`
}
