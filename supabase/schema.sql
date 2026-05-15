-- ============================================================
-- FitForge Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USER PROFILES
-- ============================================================
create table if not exists public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  age integer,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  activity_level text check (activity_level in ('sedentary','lightly_active','moderately_active','very_active','extremely_active')),
  fitness_goal text check (fitness_goal in ('lose_weight','gain_muscle','build_strength','burn_fat','maintain','improve_endurance')),
  dietary_preference text check (dietary_preference in ('plant_based','pescatarian','vegetarian','omnivore')),
  equipment text[] default '{}',
  days_per_week integer default 3,
  tdee integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- FOOD LOGS
-- ============================================================
create table if not exists public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')) not null,
  food_name text not null,
  brand_name text,
  serving_qty numeric(6,2) not null default 1,
  serving_unit text,
  serving_weight_grams numeric(7,2),
  calories numeric(7,1) not null default 0,
  protein_g numeric(6,2) default 0,
  carbs_g numeric(6,2) default 0,
  fat_g numeric(6,2) default 0,
  fiber_g numeric(6,2) default 0,
  sugar_g numeric(6,2) default 0,
  photo_url text,
  created_at timestamptz default now()
);

create index if not exists food_logs_user_date on public.food_logs(user_id, date);

-- ============================================================
-- WORKOUT LOGS
-- ============================================================
create table if not exists public.workout_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  name text not null,
  duration_minutes integer,
  notes text,
  completed boolean default false,
  created_at timestamptz default now()
);

create index if not exists workout_logs_user_date on public.workout_logs(user_id, date);

create table if not exists public.workout_log_exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_log_id uuid references public.workout_logs(id) on delete cascade not null,
  exercise_name text not null,
  order_index integer default 0,
  notes text
);

create table if not exists public.workout_sets (
  id uuid default uuid_generate_v4() primary key,
  workout_log_exercise_id uuid references public.workout_log_exercises(id) on delete cascade not null,
  set_number integer not null,
  weight_kg numeric(6,2),
  reps integer,
  duration_seconds integer,
  distance_m numeric(8,2),
  rpe integer check (rpe between 1 and 10),
  completed boolean default false
);

-- ============================================================
-- BODY MEASUREMENTS
-- ============================================================
create table if not exists public.body_measurements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  weight_kg numeric(5,1),
  body_fat_percent numeric(4,1),
  chest_cm numeric(5,1),
  waist_cm numeric(5,1),
  hips_cm numeric(5,1),
  thigh_cm numeric(5,1),
  bicep_cm numeric(5,1),
  notes text,
  created_at timestamptz default now()
);

create index if not exists body_measurements_user_date on public.body_measurements(user_id, date);

-- ============================================================
-- WATER LOGS
-- ============================================================
create table if not exists public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  amount_ml integer not null default 250,
  logged_at timestamptz default now()
);

create index if not exists water_logs_user_date on public.water_logs(user_id, date);

-- ============================================================
-- ROW LEVEL SECURITY — users can only access their own data
-- ============================================================
alter table public.user_profiles enable row level security;
alter table public.food_logs enable row level security;
alter table public.workout_logs enable row level security;
alter table public.workout_log_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.body_measurements enable row level security;
alter table public.water_logs enable row level security;

-- user_profiles policies
create policy "Users can manage own profile"
  on public.user_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- food_logs policies
create policy "Users can manage own food logs"
  on public.food_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- workout_logs policies
create policy "Users can manage own workout logs"
  on public.workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- workout_log_exercises: allow access via parent workout_log
create policy "Users can manage own workout exercises"
  on public.workout_log_exercises for all
  using (
    exists (
      select 1 from public.workout_logs
      where id = workout_log_id and user_id = auth.uid()
    )
  );

-- workout_sets: allow access via parent exercise
create policy "Users can manage own workout sets"
  on public.workout_sets for all
  using (
    exists (
      select 1 from public.workout_log_exercises wle
      join public.workout_logs wl on wl.id = wle.workout_log_id
      where wle.id = workout_log_exercise_id and wl.user_id = auth.uid()
    )
  );

-- body_measurements policies
create policy "Users can manage own measurements"
  on public.body_measurements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- water_logs policies
create policy "Users can manage own water logs"
  on public.water_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
