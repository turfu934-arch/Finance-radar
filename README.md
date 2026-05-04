# FinanceRadar Pro

Détectez les fuites d'argent cachées dans vos emails.

## Stack
- **Next.js 14** App Router
- **Supabase** Auth + Database
- **Stripe** Billing
- **TypeScript**

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.local` and fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Users (extends auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  provider text,
  plan text default 'free',
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  category text,
  amount numeric(10,2) not null,
  frequency text default 'Mensuel',
  last_used text,
  risk text check (risk in ('high', 'med', 'low')) default 'low',
  active boolean default true,
  created_at timestamptz default now()
);

-- Scans
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  emails_count integer default 0,
  savings_found numeric(10,2) default 0,
  status text check (status in ('pending', 'done', 'error')) default 'pending',
  created_at timestamptz default now()
);

-- Invoices
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  merchant text not null,
  amount numeric(10,2) not null,
  date text,
  flag text,
  severity text check (severity in ('high', 'med')) default 'med',
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scans enable row level security;
alter table public.invoices enable row level security;

create policy "Users can read own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

create policy "Users can CRUD own subscriptions" on public.subscriptions for all using (auth.uid() = user_id);
create policy "Users can CRUD own scans" on public.scans for all using (auth.uid() = user_id);
create policy "Users can CRUD own invoices" on public.invoices for all using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, provider)
  values (new.id, new.email, new.raw_app_meta_data->>'provider');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Stripe Setup
1. Create a product "FinanceRadar Pro" at 9€/month
2. Copy the Price ID → `STRIPE_PRICE_PRO_MONTHLY`
3. Set up webhook endpoint: `https://yourdomain.com/api/webhook`
4. Subscribe to: `checkout.session.completed`, `customer.subscription.deleted`

### 5. Supabase Auth — Enable Google & Apple
In Supabase dashboard → Authentication → Providers:
- Enable **Google** with your OAuth credentials
- Enable **Apple** with your Apple Developer credentials

---

## Project Structure

```
financeradar-pro/
├── app/
│   ├── layout.tsx              # Root layout + global styles
│   ├── page.tsx                # Redirect to /onboarding or /dashboard
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── onboarding/page.tsx     # 4-step onboarding flow
│   ├── subscriptions/page.tsx  # Subscription manager
│   ├── invoices/page.tsx       # Suspicious invoices
│   ├── scans/page.tsx          # Gmail scan history
│   ├── settings/page.tsx       # Account settings
│   └── api/
│       ├── checkout/route.ts   # Stripe checkout
│       ├── billing-portal/route.ts
│       └── webhook/route.ts    # Stripe webhooks
├── components/
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── SubscriptionTable.tsx
│   ├── Paywall.tsx
│   └── ScanAnimation.tsx
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── stripe.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useSubscriptions.ts
│   └── useScans.ts
├── styles/globals.css
├── middleware.ts               # Route protection
└── .env.local
```

## User Journey
1. `/` → redirect based on session
2. `/onboarding` → signup → Google/Apple OAuth → Gmail scan → paywall
3. Payment via Stripe → `/dashboard`
4. Full SaaS dashboard with sidebar nav

## Run locally
```bash
npm run dev
# open http://localhost:3000
```
