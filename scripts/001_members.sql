create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  invite_code text unique not null,
  invited_by uuid,
  parent_path text default '',
  level int default 0,
  direct_referrals int default 0,
  status text default 'pending',
  is_admin boolean default false,
  wallet_balance numeric(18,2) default 0,
  total_earned numeric(18,2) default 0,
  usdt_address text,
  created_at timestamptz default now(),
  activated_at timestamptz
);

alter table public.members enable row level security;

create policy "members_select_own" on public.members for select using (auth.uid() = id);
create policy "members_update_own" on public.members for update using (auth.uid() = id);
create policy "members_insert_own" on public.members for insert with check (auth.uid() = id);
