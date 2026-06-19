# RegTrack — Setup Guide

## What's in this project
- **Next.js 14** — frontend + backend
- **Supabase** — database, authentication, user accounts
- **Resend** — automated email reminders
- **Vercel** — hosting + daily cron job for reminders
- **NHTSA API** — free VIN lookup (no key needed)
- **Stripe** — subscriptions (added in a later step)

---

## Step 1 — Supabase database setup

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **SQL Editor** in the left sidebar
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon / public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2 — Resend email setup

1. Go to [resend.com](https://resend.com) and create an API key
2. Add your sending domain (or use the free `onboarding@resend.dev` for testing)
3. Copy your API key → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to your sending address

---

## Step 3 — Local development

```bash
# 1. Copy the env template
cp .env.example .env.local

# 2. Fill in your keys in .env.local

# 3. Install dependencies
npm install

# 4. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 4 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your environment variables in Vercel dashboard:
# Settings → Environment Variables
# Add all the variables from your .env.local
```

The `vercel.json` cron job runs daily at 9am UTC to send reminder emails.

---

## Environment variables reference

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | Your verified sending email |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your Vercel URL in prod |
| `CRON_SECRET` | Any random string — keep it secret |

---

## Project structure

```
regtrack/
├── app/
│   ├── api/
│   │   ├── vin/          # VIN lookup endpoint
│   │   └── reminders/    # Daily email cron job
│   ├── auth/             # Login, signup, reset password
│   └── dashboard/        # Main app (vehicles, settings)
├── components/           # Reusable UI components
├── lib/
│   ├── supabase/         # Database clients
│   ├── vin-lookup.ts     # NHTSA VIN decoder
│   └── vehicles.ts       # Fleet utility functions
├── types/                # TypeScript types
└── supabase/migrations/  # Database schema
```
