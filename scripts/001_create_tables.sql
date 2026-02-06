-- =============================================
-- 创业投资平台 - Database Schema
-- =============================================

-- 1. Members / Profiles table
create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  invite_code text unique not null,
  invited_by uuid,
  parent_path text default '',
  level int default 0,
  direct_referrals int default 0,
  status text default 'pending' check (status in ('pending', 'active', 'suspended')),
  is_admin boolean default false,
  wallet_balance numeric(18,2) default 0,
  total_earned numeric(18,2) default 0,
  usdt_address text,
  created_at timestamptz default now(),
  activated_at timestamptz
);

-- 2. Invite codes table
create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  owner_id uuid not null references public.members(id) on delete cascade,
  used_by uuid,
  is_used boolean default false,
  created_at timestamptz default now(),
  used_at timestamptz
);

-- 3. Deposits
create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(18,2) not null default 300,
  tx_hash text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamptz default now(),
  confirmed_at timestamptz
);

-- 4. Fund pools
create table if not exists public.fund_pools (
  id uuid primary key default gen_random_uuid(),
  pool_type text unique not null check (pool_type in ('startup', 'charity', 'commission', 'platform')),
  balance numeric(18,2) default 0,
  total_in numeric(18,2) default 0,
  total_out numeric(18,2) default 0,
  updated_at timestamptz default now()
);

-- 5. Fund pool transactions
create table if not exists public.fund_pool_transactions (
  id uuid primary key default gen_random_uuid(),
  pool_type text not null,
  amount numeric(18,2) not null,
  direction text not null check (direction in ('in', 'out')),
  description text,
  related_deposit_id uuid,
  related_member_id uuid,
  created_at timestamptz default now()
);

-- 6. Commission records
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.members(id) on delete cascade,
  source_member_id uuid not null references public.members(id),
  deposit_id uuid,
  commission_level int not null check (commission_level between 1 and 7),
  rate numeric(5,2) not null,
  amount numeric(18,2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  period text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- 7. Wallet transactions
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(18,2) not null,
  tx_type text not null check (tx_type in ('commission_credit', 'withdrawal', 'deposit', 'adjustment')),
  description text,
  balance_after numeric(18,2),
  created_at timestamptz default now()
);

-- 8. Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.members(id),
  title text not null,
  description text,
  investment_amount numeric(18,2) not null,
  net_profit numeric(18,2) default 0,
  status text default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 9. Project distributions
create table if not exists public.project_distributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  recipient_id uuid not null references public.members(id),
  distribution_type text not null check (distribution_type in ('owner', 'upline', 'startup_pool', 'charity_pool', 'platform')),
  level int,
  rate numeric(5,2) not null,
  amount numeric(18,2) not null,
  created_at timestamptz default now()
);

-- =============================================
-- Indexes
-- =============================================
create index if not exists idx_members_invite_code on public.members(invite_code);
create index if not exists idx_members_invited_by on public.members(invited_by);
create index if not exists idx_members_parent_path on public.members(parent_path);
create index if not exists idx_invite_codes_code on public.invite_codes(code);
create index if not exists idx_invite_codes_owner on public.invite_codes(owner_id);
create index if not exists idx_commissions_beneficiary on public.commissions(beneficiary_id);
create index if not exists idx_commissions_source on public.commissions(source_member_id);
create index if not exists idx_wallet_transactions_member on public.wallet_transactions(member_id);

-- =============================================
-- Enable RLS
-- =============================================
alter table public.members enable row level security;
alter table public.invite_codes enable row level security;
alter table public.deposits enable row level security;
alter table public.fund_pools enable row level security;
alter table public.fund_pool_transactions enable row level security;
alter table public.commissions enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.projects enable row level security;
alter table public.project_distributions enable row level security;

-- =============================================
-- RLS Policies
-- =============================================

-- Members
create policy "members_select_own" on public.members for select using (
  auth.uid() = id
);
create policy "members_select_admin" on public.members for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);
create policy "members_select_team" on public.members for select using (
  parent_path like '%' || auth.uid()::text || '%'
);
create policy "members_update_own" on public.members for update using (auth.uid() = id);
create policy "members_insert_own" on public.members for insert with check (auth.uid() = id);

-- Invite codes
create policy "invite_codes_select_own" on public.invite_codes for select using (
  owner_id = auth.uid()
);
create policy "invite_codes_select_admin" on public.invite_codes for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);
create policy "invite_codes_insert_own" on public.invite_codes for insert with check (owner_id = auth.uid());
create policy "invite_codes_update_own" on public.invite_codes for update using (owner_id = auth.uid());

-- Deposits
create policy "deposits_select_own" on public.deposits for select using (
  member_id = auth.uid()
);
create policy "deposits_select_admin" on public.deposits for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);
create policy "deposits_insert_own" on public.deposits for insert with check (member_id = auth.uid());

-- Fund pools: admin only
create policy "fund_pools_select_admin" on public.fund_pools for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);

-- Fund pool transactions: admin only
create policy "fund_pool_tx_select_admin" on public.fund_pool_transactions for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);

-- Commissions
create policy "commissions_select_own" on public.commissions for select using (
  beneficiary_id = auth.uid()
);
create policy "commissions_select_admin" on public.commissions for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);

-- Wallet transactions
create policy "wallet_tx_select_own" on public.wallet_transactions for select using (
  member_id = auth.uid()
);
create policy "wallet_tx_select_admin" on public.wallet_transactions for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);

-- Projects
create policy "projects_select_own" on public.projects for select using (
  owner_id = auth.uid()
);
create policy "projects_select_admin" on public.projects for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);
create policy "projects_insert_own" on public.projects for insert with check (owner_id = auth.uid());

-- Project distributions
create policy "project_dist_select_own" on public.project_distributions for select using (
  recipient_id = auth.uid()
);
create policy "project_dist_select_admin" on public.project_distributions for select using (
  exists (select 1 from public.members m where m.id = auth.uid() and m.is_admin = true)
);

-- =============================================
-- Seed fund pools
-- =============================================
insert into public.fund_pools (pool_type, balance, total_in, total_out) values
  ('startup', 0, 0, 0),
  ('charity', 0, 0, 0),
  ('commission', 0, 0, 0),
  ('platform', 0, 0, 0)
on conflict (pool_type) do nothing;

-- =============================================
-- Auto-create member profile trigger
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_invite_code text;
  parent_member_id uuid;
  parent_member_path text;
  parent_member_level int;
  i int;
begin
  new_invite_code := upper(substr(md5(random()::text), 1, 8));

  if new.raw_user_meta_data ->> 'invite_code' is not null then
    select ic.owner_id into parent_member_id
    from public.invite_codes ic
    where ic.code = upper(new.raw_user_meta_data ->> 'invite_code')
    and ic.is_used = false
    limit 1;

    if parent_member_id is not null then
      select m.parent_path, m.level into parent_member_path, parent_member_level
      from public.members m where m.id = parent_member_id;
    end if;
  end if;

  insert into public.members (id, email, display_name, invite_code, invited_by, parent_path, level, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new_invite_code,
    parent_member_id,
    case
      when parent_member_id is not null then
        coalesce(parent_member_path, '') ||
        case when coalesce(parent_member_path, '') = '' then '' else '.' end ||
        parent_member_id::text
      else ''
    end,
    case
      when parent_member_id is not null then coalesce(parent_member_level, 0) + 1
      else 0
    end,
    'pending'
  )
  on conflict (id) do nothing;

  if parent_member_id is not null then
    update public.invite_codes
    set is_used = true, used_by = new.id, used_at = now()
    where code = upper(new.raw_user_meta_data ->> 'invite_code')
    and is_used = false;

    update public.members
    set direct_referrals = direct_referrals + 1
    where id = parent_member_id;
  end if;

  for i in 1..5 loop
    insert into public.invite_codes (code, owner_id)
    values (upper(substr(md5(random()::text || i::text || new.id::text), 1, 8)), new.id);
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
