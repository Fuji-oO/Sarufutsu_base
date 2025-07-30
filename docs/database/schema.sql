-- Supabase Database Schema
-- Created: 2025-07-22

-- reservationsテーブル（予約情報）
create table public.reservations (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  checkin_date date not null,
  checkout_date date not null,
  checkin_time text not null,
  num_guests integer not null,
  adult_male integer null default 0,
  adult_female integer null default 0,
  child integer null default 0,
  room_type text not null,
  notes text null,
  status text not null,
  total_price bigint null,
  price_detail text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint reservations_pkey primary key (id)
) TABLESPACE pg_default;

-- usersテーブル（管理者ユーザ情報）
create table public.users (
  id uuid not null default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  name text null default '',
  role text not null default 'admin',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  last_login_at timestamp with time zone null,
  mfa_enabled boolean null default false,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;

-- updated_atを自動更新するためのトリガー関数
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- reservationsテーブルのupdated_at自動更新トリガー
create trigger update_reservations_updated_at
  before update on public.reservations
  for each row
  execute function update_updated_at_column();

-- usersテーブルのupdated_at自動更新トリガー
create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function update_updated_at_column(); 