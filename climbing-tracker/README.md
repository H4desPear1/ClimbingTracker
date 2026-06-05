# 🧗 Climbing Tracker

A mobile-first web app to track your climbing sessions, problems sent, and strength progress.

---

## Setup (~20 minutes)

### Step 1 — Set up Supabase (your database)

1. Go to **supabase.com** and create a free account
2. Click **"New Project"** — name it `climbing-tracker`, pick a region close to you
3. Wait ~2 min for it to provision
4. Go to **SQL Editor** (left sidebar) → **New Query**
5. Paste and run this SQL:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  day_name text not null,
  session_type text not null,
  completed boolean default false,
  overall_feel integer check (overall_feel between 1 and 5),
  energy integer check (energy between 1 and 5),
  notes text,
  duration_minutes integer
);

create table problems (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  created_at timestamptz default now(),
  grade text not null,
  attempts integer default 1,
  sent boolean default false,
  board text,
  notes text
);

create table strength_logs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  created_at timestamptz default now(),
  exercise text not null,
  sets integer,
  reps integer,
  hang_seconds integer,
  edge_mm integer,
  weight_added_lbs integer default 0,
  notes text
);

alter table sessions enable row level security;
alter table problems enable row level security;
alter table strength_logs enable row level security;

create policy "Allow all" on sessions for all using (true) with check (true);
create policy "Allow all" on problems for all using (true) with check (true);
create policy "Allow all" on strength_logs for all using (true) with check (true);
```

6. Go to **Settings → API** (left sidebar)
7. Copy your **Project URL** and **anon/public key** — you'll need these next

---

### Step 2 — Deploy to Vercel

1. Go to **github.com** and create a new repository called `climbing-tracker`
2. Upload all the files from this folder to that repo (drag & drop works)
3. Go to **vercel.com**, sign up with your GitHub account
4. Click **"Add New Project"** → import your `climbing-tracker` repo
5. Before clicking Deploy, click **"Environment Variables"** and add:
   - `REACT_APP_SUPABASE_URL` → your Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → your Supabase anon key
6. Click **Deploy**

Vercel will give you a URL like `climbing-tracker-abc123.vercel.app`

---

### Step 3 — Add to your phone home screen

**iPhone:**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. It'll look and feel like a native app

**Android:**
1. Open the URL in Chrome
2. Tap the three dots menu
3. Tap "Add to Home Screen"

---

## What the app tracks

| Tab | What it does |
|-----|-------------|
| **Today** | Shows today's scheduled session, this week's progress, streak |
| **Log** | Log a session with feel/energy ratings, problems climbed, and strength work |
| **History** | Calendar view of all sessions + full session list |
| **Stats** | Grade pyramid, send rates by grade, dead hang progress over time |

---

## Local development (optional)

If you want to run it locally first:

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase values in .env.local
npm start
```

---

## File structure

```
src/
  lib/
    supabase.js      # Database client
    constants.js     # Grades, session types, exercises
  hooks/
    useData.js       # Data fetching hooks
  components/
    BottomNav.jsx    # Mobile navigation
  pages/
    Today.jsx        # Home/today view
    Log.jsx          # Session logging
    History.jsx      # Calendar + session list
    Stats.jsx        # Grade pyramid + charts
    SessionDetail.jsx # View a single session
```
