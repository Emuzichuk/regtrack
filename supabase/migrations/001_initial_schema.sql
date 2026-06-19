-- ============================================================
-- RegTrack Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with subscription info
-- ============================================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text not null,
  full_name     text,
  company_name  text,
  phone         text,
  plan          text not null default 'none' check (plan in ('none', 'basic', 'pro')),
  plan_status   text not null default 'inactive' check (plan_status in ('active', 'inactive', 'canceled', 'past_due')),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- VEHICLES
-- Cars, trucks, and trailers tracked per user
-- ============================================================
create table public.vehicles (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,

  -- Identity
  fleet_number    text not null,
  vehicle_type    text not null check (vehicle_type in ('car', 'truck', 'trailer')),
  vin             text,
  license_plate   text,

  -- Auto-filled from VIN lookup (NHTSA API)
  year            integer,
  make            text,
  model           text,
  trim            text,

  -- Trailer-specific (no VIN required)
  trailer_type    text, -- e.g. "flatbed", "box", "refrigerated"
  trailer_length  text,

  -- Registration info
  registration_expiry   date not null,
  registration_state    text,
  registration_number   text,
  notes                 text,

  -- Notification tracking (so we don't double-send)
  notified_30_days  boolean default false,
  notified_14_days  boolean default false,
  notified_7_days   boolean default false,
  notified_expired  boolean default false,

  -- Soft delete + timestamps
  archived      boolean default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATION LOG
-- Keeps a record of every email reminder sent
-- ============================================================
create table public.notification_log (
  id            uuid default uuid_generate_v4() primary key,
  vehicle_id    uuid references public.vehicles(id) on delete cascade not null,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  type          text not null check (type in ('30_day', '14_day', '7_day', 'expired')),
  sent_at       timestamptz not null default now(),
  email_to      text not null,
  success       boolean not null default true,
  error_message text
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each customer can ONLY see their own data
-- ============================================================

alter table public.profiles    enable row level security;
alter table public.vehicles    enable row level security;
alter table public.notification_log enable row level security;

-- Profiles: users can read/update only their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Vehicles: users can only CRUD their own vehicles
create policy "Users can view own vehicles"
  on public.vehicles for select
  using (auth.uid() = user_id);

create policy "Users can insert own vehicles"
  on public.vehicles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vehicles"
  on public.vehicles for update
  using (auth.uid() = user_id);

create policy "Users can delete own vehicles"
  on public.vehicles for delete
  using (auth.uid() = user_id);

-- Notification log: read-only for the user
create policy "Users can view own notifications"
  on public.notification_log for select
  using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- Auto-update updated_at on changes
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_vehicle_updated
  before update on public.vehicles
  for each row execute procedure public.handle_updated_at();

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES
-- Speed up common queries
-- ============================================================

create index idx_vehicles_user_id on public.vehicles(user_id);
create index idx_vehicles_expiry  on public.vehicles(registration_expiry) where archived = false;
create index idx_vehicles_type    on public.vehicles(user_id, vehicle_type) where archived = false;
create index idx_notif_log_vehicle on public.notification_log(vehicle_id);

-- ============================================================
-- DONE
-- Your RegTrack database is ready!
-- ============================================================
