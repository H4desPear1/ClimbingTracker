import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── SQL to run in Supabase SQL Editor ───────────────────────────────────────
// Copy and paste this into your Supabase project → SQL Editor → New Query
//
// create table sessions (
//   id uuid default gen_random_uuid() primary key,
//   created_at timestamptz default now(),
//   date date not null,
//   day_name text not null,
//   session_type text not null,
//   completed boolean default false,
//   overall_feel integer check (overall_feel between 1 and 5),
//   energy integer check (energy between 1 and 5),
//   notes text,
//   duration_minutes integer
// );
//
// create table problems (
//   id uuid default gen_random_uuid() primary key,
//   session_id uuid references sessions(id) on delete cascade,
//   created_at timestamptz default now(),
//   grade text not null,
//   attempts integer default 1,
//   sent boolean default false,
//   board text,
//   notes text
// );
//
// create table strength_logs (
//   id uuid default gen_random_uuid() primary key,
//   session_id uuid references sessions(id) on delete cascade,
//   created_at timestamptz default now(),
//   exercise text not null,
//   sets integer,
//   reps integer,
//   hang_seconds integer,
//   edge_mm integer,
//   weight_added_lbs integer default 0,
//   notes text
// );
//
// -- Enable Row Level Security (open access for personal use)
// alter table sessions enable row level security;
// alter table problems enable row level security;
// alter table strength_logs enable row level security;
//
// create policy "Allow all" on sessions for all using (true) with check (true);
// create policy "Allow all" on problems for all using (true) with check (true);
// create policy "Allow all" on strength_logs for all using (true) with check (true);
